import { NextResponse, NextRequest } from 'next/server';
import { PrismaClient } from '@generated/prisma';

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
    invoiceNumber: inv.invoiceNumber,
    clientId: inv.clientId, 
    userId: inv.userId,   
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

type InvoiceInput = {
  invoiceDate: string;
  paymentDue: string;
  description?: string;
  status: 'draft' | 'pending' | 'paid';
  totalAmount: number;
  clientId: string;
  userId: string;
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
};

function generateInvoiceNumber(): string {
  const letters = Array.from({ length: 2 }, () =>
    String.fromCharCode(65 + Math.floor(Math.random() * 26))
  ).join('');
  const numbers = Math.floor(1000 + Math.random() * 9000);
  return `${letters}${numbers}`; // e.g., "RT3080"
}

function buildClient(data: InvoiceInput) {
  if (!data.clientEmail) return undefined;

  return {
    connectOrCreate: {
      where: { email: data.clientEmail },
      create: {
        name: data.clientName || '',
        email: data.clientEmail,
        street: data.clientAddress?.street || '',
        city: data.clientAddress?.city || '',
        postalCode: data.clientAddress?.postCode || '',
        country: data.clientAddress?.country || '',
      },
    },
  };
}


function validateInvoiceInput(data: InvoiceInput): string[] {
  const errors: string[] = [];
  const isDraft = data.status === 'draft';
  

  if (!isDraft) {
    if (!data.clientEmail) errors.push('Client email is required.');
    if (!data.clientName) errors.push('Client name is required.');
    if (!data.invoiceDate) errors.push('Invoice date is required.');
    if (!data.paymentDue) errors.push('Payment due date is required.');
    if (!data.items || data.items.length === 0) errors.push('At least one item is required.');
  }

  return errors;
}



export async function POST(request: NextRequest) {
  console.log("🔥 POST /api/invoices called");

  const HARDCODED_USER_ID = 'cmb6m322b0000yi6s4ef5uq1t';

  try {
    const data = await request.json();
    
    console.log('✅ Parsed JSON:', data);
    console.log('📧 clientEmail:', data.clientEmail);

    const isDraft = data.mode === 'draft';
const errors = isDraft ? [] : validateInvoiceInput(data);
    if (errors.length > 0) {
      return NextResponse.json({ errors }, { status: 400 });
    }
    const clientData = buildClient(data);
    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber: generateInvoiceNumber(),
        invoiceDate: data.invoiceDate ? new Date(data.invoiceDate) : new Date(),
        paymentDue: data.paymentDue ? new Date(data.paymentDue) : new Date(),
        description: data.description ?? '',
        status: data.status,
        totalAmount: data.totalAmount ?? 0,

        user: {
          connect: { id: HARDCODED_USER_ID },
        },

        ...(clientData ? { client: clientData } : {}),

      items: {
  create: Array.isArray(data.items)
    ? data.items
        .filter(item => item?.name && item?.quantity && item?.price)
        .map(item => ({
          description: item.name,
          quantity: item.quantity,
          unitPrice: item.price,
          totalPrice: item.quantity * item.price,
        }))
    : [],
}

      },
      include: {
        client: true,
        user: true,
        items: true,
      },
    });

    return NextResponse.json(invoice, { status: 201 });
  } catch (error) {
    console.error('❌ Create failed:', error);
    return NextResponse.json({ error: 'Failed to create invoice' }, { status: 500 });
  }
}



