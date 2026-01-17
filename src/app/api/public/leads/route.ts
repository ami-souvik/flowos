import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Basic validation
    if (!body.name || !body.phone) {
        return NextResponse.json({ error: 'Name and Phone are required' }, { status: 400 });
    }

    const lead = await prisma.lead.create({
      data: {
        name: body.name,
        email: body.email,
        phone: body.phone,
        status: 'NEW', // Always default to NEW for public leads
        source: body.source || 'Public API',
        budgetRange: body.budgetRange,
        notes: body.notes,
      },
    });

    // Return a sanitized response
    return NextResponse.json({ 
        message: 'Lead created successfully',
        id: lead.id,
        name: lead.name 
    }, { status: 201 });

  } catch (error) {
    console.error('Public API Error:', error);
    return NextResponse.json({ error: 'Failed to create lead' }, { status: 500 });
  }
}
