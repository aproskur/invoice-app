import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { PaymentTerms } from '@generated/prisma';
import { normalizeItems, calculateTotalAmount } from '@/lib/invoiceTotals';



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
      name: inv.client?.name ?? '',
      email: inv.client?.email ?? '',
      street: inv.client?.street ?? '',
      city: inv.client?.city ?? '',
      postCode: inv.client?.postalCode ?? '',
      country: inv.client?.country ?? '',
    },
    totalAmount: inv.totalAmount,
    senderAddress: {
      street: inv.user.street ?? '',
      city: inv.user.city ?? '',
      postCode: inv.user.postalCode ?? '',
      country: inv.user.country ?? '',
    },
    clientAddress: {
      street: inv.client?.street ?? '',
      city: inv.client?.city ?? '',
      postCode: inv.client?.postalCode ?? '',
      country: inv.client?.country ?? '',
    },
    items: inv.items.map((item) => ({
      name: item.description,
      quantity: item.quantity,
      price: item.unitPrice,
    })),
  }));
  

  return NextResponse.json(result);
}

type AddressInput = {
  street?: string;
  city?: string;
  postCode?: string;
  country?: string;
};

type InvoiceInput = {
  invoiceNumber?: string;
  mode?: 'draft' | 'send';
  description?: string;
  status: 'draft' | 'pending' | 'paid';
  invoiceDate?: string;
  paymentDue?: string;
  clientName?: string;
  clientEmail?: string;
  clientAddress?: AddressInput;
  senderAddress?: AddressInput;
  totalAmount?: number;
  clientId?: string;
  userId?: string;
  items?: {
    name?: string;
    quantity?: number;
    price?: number;
  }[];
  paymentTerms?: string;
};

const DEFAULT_USER_EMAIL = 'trigonotarb@am.am';

const mapPaymentTerms = (value?: string): PaymentTerms => {
  if (!value) return PaymentTerms.NET_30;
  const normalized = value.toUpperCase().replace(/\s+/g, '_');
  switch (normalized) {
    case 'NET_7':
      return PaymentTerms.NET_7;
    case 'NET_14':
      return PaymentTerms.NET_14;
    case 'NET_30':
      return PaymentTerms.NET_30;
    case 'DUE_ON_RECEIPT':
      return PaymentTerms.DUE_ON_RECEIPT;
    default:
      return PaymentTerms.NET_30;
  }
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

async function ensureDefaultUser() {
  const user = await prisma.user.upsert({
    where: { email: DEFAULT_USER_EMAIL },
    update: {},
    create: {
      email: DEFAULT_USER_EMAIL,
      name: 'Demo User',
      street: '',
      city: '',
      postalCode: '',
      country: '',
      photoUrl: '',
    },
  });
  return user;
}

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
    const normalizedItems = normalizeItems(data.items);
    const totalAmount = calculateTotalAmount(normalizedItems);
    const defaultUser = await ensureDefaultUser();
    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber: generateInvoiceNumber(),
        invoiceDate: data.invoiceDate ? new Date(data.invoiceDate) : new Date(),
        paymentDue: data.paymentDue ? new Date(data.paymentDue) : new Date(),
        paymentTerms: mapPaymentTerms(data.paymentTerms),
        description: data.description ?? '',
        status: data.status,
        totalAmount,

        user: {
          connect: { id: defaultUser.id },
        },

        ...(clientData ? { client: clientData } : {}),

      items: {
        create: normalizedItems.map((item) => ({
          description: item.name,
          quantity: item.quantity,
          unitPrice: item.price,
          totalPrice: item.quantity * item.price,
        })),
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
