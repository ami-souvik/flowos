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
    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: { lead: true, quotation: true, payments: true },
    });
    if (!invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }
    return NextResponse.json(invoice);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch invoice' }, { status: 500 });
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
    const invoice = await prisma.invoice.update({
      where: { id },
      data: {
        leadId: body.leadId ? parseInt(body.leadId) : undefined,
        quotationId: body.quotationId ? parseInt(body.quotationId) : undefined,
        dueDate: body.dueDate ? new Date(body.dueDate) : undefined,
        amount: body.amount ? parseFloat(body.amount) : undefined,
        status: body.status,
      },
    });
    return NextResponse.json(invoice);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update invoice' }, { status: 500 });
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
    await prisma.invoice.delete({
      where: { id },
    });
    return NextResponse.json({ message: 'Invoice deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete invoice' }, { status: 500 });
  }
}
