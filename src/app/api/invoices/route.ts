import { NextResponse, NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


export async function GET() {
  const invoices = await prisma.invoice.findMany({
    include: {
      client: true,
      user: true,
      items: true,
    },
  });

  const result = invoices.map((inv) => ({
    id: inv.id,
    invoiceDate: inv.invoiceDate.toISOString(),
    paymentDue: inv.paymentDue.toISOString(),
    description: inv.description ?? '',
    status: inv.status,
    client: {
      name: inv.client.name,
      email: inv.client.email,
      street: inv.client.street ?? '',
      city: inv.client.city ?? '',
      postCode: inv.client.postalCode ?? '',
      country: inv.client.country ?? '',
    },
    totalAmount: inv.totalAmount,
    senderAddress: {
      street: inv.user.street ?? '',
      city: inv.user.city ?? '',
      postCode: inv.user.postalCode ?? '',
      country: inv.user.country ?? '',
    },
    clientAddress: {
      street: inv.client.street ?? '',
      city: inv.client.city ?? '',
      postCode: inv.client.postalCode ?? '',
      country: inv.client.country ?? '',
    },
    items: inv.items.map((item) => ({
      name: item.description,
      quantity: item.quantity,
      price: item.unitPrice,
    })),
  }));
  

  return NextResponse.json(result);
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    await prisma.invoice.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Invoice deleted' }, { status: 200 });
  } catch (error) {
    console.error('Delete failed:', error);
    return NextResponse.json({ error: 'Failed to delete invoice' }, { status: 500 });
  }
}
