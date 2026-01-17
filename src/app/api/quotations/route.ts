import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const quotations = await prisma.quotation.findMany({
      orderBy: { createdAt: 'desc' },
      include: { lead: true, items: true },
    });
    return NextResponse.json(quotations);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch quotations' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    
    // Calculate total
    let totalAmount = 0;
    if (body.items && Array.isArray(body.items)) {
      totalAmount = body.items.reduce((sum: number, item: any) => sum + (item.quantity * item.unitPrice), 0);
    }

    const quotation = await prisma.quotation.create({
      data: {
        leadId: parseInt(body.leadId),
        validUntil: body.validUntil ? new Date(body.validUntil) : null,
        totalAmount: totalAmount,
        items: {
          create: body.items?.map((item: any) => ({
            productId: item.productId ? parseInt(item.productId) : null,
            description: item.description,
            quantity: parseInt(item.quantity),
            unitPrice: parseFloat(item.unitPrice),
            subtotal: parseInt(item.quantity) * parseFloat(item.unitPrice)
          }))
        }
      },
      include: { items: true }
    });
    return NextResponse.json(quotation, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create quotation' }, { status: 500 });
  }
}
