import { NextResponse, NextRequest } from 'next/server';
import { PrismaClient } from '@generated/prisma';


export async function DELETE(request: NextRequest, { params }: { params: { invoiceNumber: string } }) {
    const { invoiceNumber } = params;
  
    try {
      await prisma.invoice.delete({
        where: { invoiceNumber },
      });
  
      return NextResponse.json({ message: 'Invoice deleted' }, { status: 200 });
    } catch (error) {
      console.error('Delete failed:', error);
      return NextResponse.json({ error: 'Failed to delete invoice' }, { status: 500 });
    }
  }

export async function PATCH(
  req: NextRequest,
  { params }: { params: { invoiceNumber: string } }
) {
  try {
    const data = await req.json();

    const updated = await prisma.invoice.update({
      where: { invoiceNumber: params.invoiceNumber },
      data: {
        invoiceDate: data.invoiceDate ? new Date(data.invoiceDate) : undefined,
        paymentDue: data.paymentDue ? new Date(data.paymentDue) : undefined,
        description: data.description ?? '',
        status: data.status,
        totalAmount: data.totalAmount ?? 0,

        // Update or connect client
        client: {
          update: {
            name: data.clientName || '',
            email: data.clientEmail,
            street: data.clientAddress?.street || '',
            city: data.clientAddress?.city || '',
            postalCode: data.clientAddress?.postCode || '',
            country: data.clientAddress?.country || '',
          },
        },

        // Replace all invoice items
        items: {
          deleteMany: {}, // Remove existing items
          create: Array.isArray(data.items)
            ? data.items.map((item: any) => ({
                description: item.name,
                quantity: item.quantity,
                unitPrice: item.price,
                totalPrice: item.quantity * item.price,
              }))
            : [],
        },
      },
      include: {
        client: true,
        user: true,
        items: true,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('❌ Failed to update invoice:', error);
    return NextResponse.json({ error: 'Failed to update invoice' }, { status: 500 });
  }
}

  