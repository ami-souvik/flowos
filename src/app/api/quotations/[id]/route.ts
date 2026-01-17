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
    const quotation = await prisma.quotation.findUnique({
      where: { id },
      include: { lead: true, items: true },
    });
    if (!quotation) {
      return NextResponse.json({ error: 'Quotation not found' }, { status: 404 });
    }
    return NextResponse.json(quotation);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch quotation' }, { status: 500 });
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
    // Transaction to update quotation and items
    const updatedQuotation = await prisma.$transaction(async (tx) => {
      // 1. Update basic fields
      await tx.quotation.update({
        where: { id },
        data: {
          leadId: body.leadId ? parseInt(body.leadId) : undefined,
          validUntil: body.validUntil ? new Date(body.validUntil) : undefined,
        },
      });

      // 2. Handle Items if provided
      if (body.items) {
        // Delete existing items
        await tx.quotationItem.deleteMany({
          where: { quotationId: id },
        });

        // Create new items
        if (body.items.length > 0) {
            await tx.quotationItem.createMany({
            data: body.items.map((item: any) => ({
                quotationId: id,
                productId: item.productId ? parseInt(item.productId) : null,
                description: item.description,
                quantity: parseInt(item.quantity),
                unitPrice: parseFloat(item.unitPrice),
                subtotal: parseInt(item.quantity) * parseFloat(item.unitPrice),
            })),
            });
        }
      }

      // 3. Recalculate Total
      const allItems = await tx.quotationItem.findMany({
        where: { quotationId: id },
      });
      const totalAmount = allItems.reduce((sum, item) => sum + Number(item.subtotal), 0);

      const finalQuotation = await tx.quotation.update({
        where: { id },
        data: { totalAmount },
        include: { items: true, lead: true },
      });

      return finalQuotation;
    });

    return NextResponse.json(updatedQuotation);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update quotation' }, { status: 500 });
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
    await prisma.quotation.delete({
      where: { id },
    });
    return NextResponse.json({ message: 'Quotation deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete quotation' }, { status: 500 });
  }
}
