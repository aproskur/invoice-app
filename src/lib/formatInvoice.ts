import type { Invoice, Client, User, InvoiceItem } from '@prisma/client';

type InvoiceWithRelations = Invoice & {
  client?: Partial<Client> | null;
  user?: Partial<User> | null;
  items?: Partial<InvoiceItem>[] | null;
};

export const formatInvoice = (inv: InvoiceWithRelations) => ({
  id: inv.id,
  invoiceNumber: inv.invoiceNumber,
  clientId: inv.clientId,
  userId: inv.userId,
  invoiceDate: inv.invoiceDate?.toISOString?.() ?? new Date(inv.invoiceDate).toISOString(),
  paymentDue: inv.paymentDue?.toISOString?.() ?? new Date(inv.paymentDue).toISOString(),
  description: inv.description ?? '',
  status: String(inv.status ?? 'draft').toLowerCase(),
  totalAmount: inv.totalAmount,
  client: {
    name: inv.client?.name ?? '',
    email: inv.client?.email ?? '',
    street: inv.client?.street ?? '',
    city: inv.client?.city ?? '',
    postCode: inv.client?.postalCode ?? '',
    country: inv.client?.country ?? '',
  },
  senderAddress: {
    street: inv.user?.street ?? '',
    city: inv.user?.city ?? '',
    postCode: inv.user?.postalCode ?? '',
    country: inv.user?.country ?? '',
  },
  clientAddress: {
    street: inv.client?.street ?? '',
    city: inv.client?.city ?? '',
    postCode: inv.client?.postalCode ?? '',
    country: inv.client?.country ?? '',
  },
  items: (inv.items ?? []).map((item) => ({
    name: item.description,
    quantity: item.quantity,
    price: item.unitPrice,
  })),
});
