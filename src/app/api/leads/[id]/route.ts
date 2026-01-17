import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const id = parseInt((await params).id);

  try {
    const lead = await prisma.lead.findUnique({
      where: { id },
      include: { assignedVendor: true, activities: true, quotations: true, invoices: true, notesList: true },
    });
    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }
    return NextResponse.json(lead);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch lead' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const id = parseInt((await params).id);
  const body = await request.json();

  try {
    const result = await prisma.$transaction(async (tx) => {
      const updatedLead = await tx.lead.update({
        where: { id },
        data: {
          name: body.name,
          email: body.email,
          phone: body.phone,
          status: body.status,
          source: body.source,
          vendorId: body.vendorId ? parseInt(body.vendorId) : null,
          notes: body.notes,
        },
      });

      if (updatedLead.status === 'WON') {
        const existingProject = await tx.project.findFirst({
          where: { leadId: id },
        });

        if (!existingProject) {
          // Try to parse a budget from string like "10000-20000" or "15000"
          let budget = 0;
          if (updatedLead.budgetRange) {
            const matches = updatedLead.budgetRange.match(/(\d+)/);
            if (matches && matches[0]) {
              budget = parseFloat(matches[0]);
            }
          }

          await tx.project.create({
            data: {
              name: `${updatedLead.name}'s Project`,
              leadId: updatedLead.id,
              status: 'CONCEPT',
              budget: budget,
              startDate: new Date(),
            },
          });
        }
      }

      return updatedLead;
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error updating lead:', error);
    return NextResponse.json({ error: 'Failed to update lead' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const id = parseInt((await params).id);

  try {
    await prisma.lead.delete({
      where: { id },
    });
    return NextResponse.json({ message: 'Lead deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete lead' }, { status: 500 });
  }
}
