export type Invoice = {
  id: string;
  invoiceNumber: string,
  description: string;
  status: 'paid' | 'pending' | 'draft';
  invoiceDate: string;
  paymentDue: string;
  senderAddress: Address;
  clientAddress: Address;
  userId: string;
clientId: string;

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
    userId: string;
clientId: string;

  };
  


export type InvoiceInput = {
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
};

  
  
  
  