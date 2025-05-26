export type Invoice = {
  id: string;
  description: string;
  status: 'paid' | 'pending' | 'draft';
  invoiceDate: string;
  paymentDue: string;
  senderAddress: Address;
  clientAddress: Address;
  client: {
    name: string;
    email: string;
  };
  totalAmount: number;
  items: InvoiceItem[];
};


  
  export type Address = {
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

  export type InvoiceFormProps = {
    invoice?: Invoice; 
    mode: 'edit' | 'create';
    onCancel: () => void;
    onSubmit: (data: InvoiceInput) => void;
  };

  export type InvoiceItemInput = {
    name: string;
    quantity: number;
    price: number;
  };
  
  export type InvoiceInput = {
    description: string;
    status: 'paid' | 'pending' | 'draft';
    invoiceDate: string;
    paymentDue: string;
    clientName: string;
    clientEmail: string;
    senderAddress: Address;
    clientAddress: Address;
    items: InvoiceItemInput[]; 
  };
  
  
  
  