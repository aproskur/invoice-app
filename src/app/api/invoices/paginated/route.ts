import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { formatInvoice } from '@/lib/formatInvoice';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '5', 10);
  const skip = (page - 1) * limit;

  try {
    const [invoices, total] = await Promise.all([
      prisma.invoice.findMany({
        skip,
        take: limit,
        orderBy: { invoiceDate: 'desc' },
        select: {
          id: true,
          invoiceNumber: true,
          description: true,
          status: true,
          invoiceDate: true,
          paymentDue: true,
          totalAmount: true,
          clientId: true,
          userId: true,
          client: {
            select: {
              name: true,
            },
          },
        },
      }),
      prisma.invoice.count(),
    ]);

    const formattedInvoices = invoices.map(formatInvoice);

    return NextResponse.json({
      invoices: formattedInvoices,
      page,
      totalPages: Math.ceil(total / limit),
      totalInvoices: total,
    });
  } catch (error) {
    console.error('❌ Failed to fetch paginated invoices:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
