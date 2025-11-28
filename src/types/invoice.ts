export type Address = {
  street: string;
  city: string;
  postCode: string;
  country: string;
};

export type InvoiceClient = {
  name: string;
  email: string;
  street: string;
  city: string;
  postCode: string;
  country: string;
};

export type InvoiceItem = {
  name: string;
  quantity: number;
  price: number;
};

export type Invoice = {
  id: string;
  invoiceNumber: string;
  description: string;
  status: 'paid' | 'pending' | 'draft';
  invoiceDate: string;
  paymentDue: string;
  senderAddress: Address;
  clientAddress: Address;
  userId: string;
  clientId: string | null;
  client: InvoiceClient;
  totalAmount: number;
  items: InvoiceItem[];
};

export type InvoiceFormProps = {
  invoice?: Invoice;
  mode: 'edit' | 'create';
  onCancel: () => void;
  onSubmit?: (data: Invoice) => void;
  invoiceNumberOverride?: string;
};

export type InvoiceItemInput = {
  name: string;
  quantity: number;
  price: number;
  id?: string;
  invoiceId?: string;
};

export type InvoiceInput = {
  invoiceNumber?: string;
  mode?: 'draft' | 'send';
  description?: string;
  status: 'paid' | 'pending' | 'draft';
  invoiceDate: string;
  paymentDue: string;
  clientName?: string;
  clientEmail?: string;
  senderAddress?: Address;
  clientAddress?: Address;
  items: InvoiceItemInput[];
  userId?: string;
  clientId?: string;
  totalAmount?: number;
  paymentTerms?: 'Net 7' | 'Net 14' | 'Net 30';
};
