// app/api/invoices/[invoiceNumber]/route.ts
export const runtime = 'nodejs';

import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { PaymentTerms } from '@generated/prisma';
import { normalizeItems, calculateTotalAmount } from '@/lib/invoiceTotals';
import { formatInvoice } from '@/lib/formatInvoice';

type AddressInput = {
  street?: string;
  city?: string;
  postCode?: string;
  country?: string;
};

type InvoiceUpdateInput = {
  status?: 'draft' | 'pending' | 'paid';
  description?: string;
  invoiceDate?: string;
  paymentDue?: string;
  paymentTerms?: string;
  items?: {
    name?: string;
    quantity?: number;
    price?: number;
  }[];
  clientName?: string;
  clientEmail?: string;
  clientAddress?: AddressInput;
};

const shouldUpdateClient = (data: InvoiceUpdateInput) =>
  Boolean(
    data.clientName ??
      data.clientEmail ??
      data.clientAddress?.street ??
      data.clientAddress?.city ??
      data.clientAddress?.postCode ??
      data.clientAddress?.country,
  );

const buildClientMutation = (data: InvoiceUpdateInput, hasExistingClient: boolean) => {
  if (!shouldUpdateClient(data)) return undefined;

  const update = {
    ...(data.clientName !== undefined ? { name: data.clientName } : {}),
    ...(data.clientEmail !== undefined ? { email: data.clientEmail } : {}),
    ...(data.clientAddress?.street !== undefined ? { street: data.clientAddress.street } : {}),
    ...(data.clientAddress?.city !== undefined ? { city: data.clientAddress.city } : {}),
    ...(data.clientAddress?.postCode !== undefined
      ? { postalCode: data.clientAddress.postCode }
      : {}),
    ...(data.clientAddress?.country !== undefined ? { country: data.clientAddress.country } : {}),
  };

  const createPayload = {
    name: data.clientName || '',
    email: data.clientEmail ?? '',
    street: data.clientAddress?.street || '',
    city: data.clientAddress?.city || '',
    postalCode: data.clientAddress?.postCode || '',
    country: data.clientAddress?.country || '',
  };

  if (!hasExistingClient) {
    if (!createPayload.email) {
      return undefined;
    }

    return {
      upsert: {
        update,
        create: createPayload,
      },
    } as const;
  }

  if (data.clientEmail) {
    return {
      upsert: {
        update,
        create: createPayload,
      },
    } as const;
  }

  return { update } as const;
};

const mapPaymentTerms = (value?: string): PaymentTerms | undefined => {
  if (!value) return undefined;
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
      return undefined;
  }
};

// GET one
export async function GET(_req: NextRequest, { params }: { params: { invoiceNumber: string } }) {
  const inv = await prisma.invoice.findUnique({
    where: { invoiceNumber: params.invoiceNumber },
    include: { client: true, user: true, items: true },
  });
  if (!inv) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(formatInvoice(inv));
}

// DELETE
export async function DELETE(_req: NextRequest, { params }: { params: { invoiceNumber: string } }) {
  const inv = await prisma.invoice.findUnique({ where: { invoiceNumber: params.invoiceNumber } });
  if (!inv) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  await prisma.invoice.delete({ where: { invoiceNumber: params.invoiceNumber } });
  return NextResponse.json({ ok: true });
}

// PATCH (optional)
export async function PATCH(req: NextRequest, { params }: { params: { invoiceNumber: string } }) {
  const data: InvoiceUpdateInput = await req.json();
  const existingInvoice = await prisma.invoice.findUnique({
    where: { invoiceNumber: params.invoiceNumber },
    select: { clientId: true },
  });

  if (!existingInvoice) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const shouldUpdateItems = Array.isArray(data.items);
  const normalizedItems = shouldUpdateItems ? normalizeItems(data.items) : [];
  const recalculatedTotal = shouldUpdateItems ? calculateTotalAmount(normalizedItems) : undefined;
  const clientMutation = buildClientMutation(data, Boolean(existingInvoice.clientId));

  const updated = await prisma.invoice.update({
    where: { invoiceNumber: params.invoiceNumber },
    data: {
      description: data.description ?? undefined,
      status: data.status ?? undefined,
      invoiceDate: data.invoiceDate ? new Date(data.invoiceDate) : undefined,
      paymentDue: data.paymentDue ? new Date(data.paymentDue) : undefined,
      paymentTerms: mapPaymentTerms(data.paymentTerms),
      totalAmount: typeof recalculatedTotal === 'number' ? recalculatedTotal : undefined,
      client: clientMutation,
      items: shouldUpdateItems
        ? {
            deleteMany: {},
            create: normalizedItems.map((item) => ({
              description: item.name,
              quantity: item.quantity,
              unitPrice: item.price,
              totalPrice: item.quantity * item.price,
            })),
          }
        : undefined,
    },
    include: { client: true, user: true, items: true },
  });
  return NextResponse.json(formatInvoice(updated));
}
