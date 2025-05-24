import { Invoice } from '@/types/invoice';

export const allInvoices: Invoice[] = [
  {
    id: 'XM9141',
    description: 'Brand identity design for new product line',
    status: 'pending',
    invoiceDate: '2021-08-21T00:00:00Z',
    paymentDue: '2021-09-20T00:00:00Z',
    clientName: 'Alex Grim',
    clientEmail: 'alexgrim@mail.com',
    senderAddress: {
      street: '19 Union Terrace',
      city: 'London',
      postCode: 'E1 3EZ',
      country: 'United Kingdom',
    },
    clientAddress: {
      street: '84 Church Way',
      city: 'Bradford',
      postCode: 'BD1 9PB',
      country: 'United Kingdom',
    },
    items: [
      {
        name: 'Logo Design',
        quantity: 1,
        price: 200,
      },
      {
        name: 'Brand Guidelines',
        quantity: 1,
        price: 150,
      },
    ],
    total: 350,
  },
  {
    id: 'RT3080',
    description: 'Website design and development',
    status: 'paid',
    invoiceDate: '2021-08-12T00:00:00Z',
    paymentDue: '2021-08-19T00:00:00Z',
    clientName: 'Jensen Huang',
    clientEmail: 'jensen@nvidia.com',
    senderAddress: {
      street: '19 Tech Park',
      city: 'San Francisco',
      postCode: '94107',
      country: 'USA',
    },
    clientAddress: {
      street: '100 Innovation Dr',
      city: 'Palo Alto',
      postCode: '94301',
      country: 'USA',
    },
    items: [
      {
        name: 'UX Wireframes',
        quantity: 2,
        price: 300,
      },
      {
        name: 'UI Design',
        quantity: 1,
        price: 500,
      },
      {
        name: 'Development',
        quantity: 1,
        price: 1200,
      },
    ],
    total: 2300,
  },
  {
    id: 'RG0314',
    description: 'Maintenance contract',
    status: 'draft',
    invoiceDate: '2021-09-01T00:00:00Z',
    paymentDue: '2021-10-01T00:00:00Z',
    clientName: 'Sara Conway',
    clientEmail: 'sara.conway@greenbank.org',
    senderAddress: {
      street: '56 High Street',
      city: 'Cambridge',
      postCode: 'CB2 3BJ',
      country: 'United Kingdom',
    },
    clientAddress: {
      street: '9 Banking Ln',
      city: 'Leeds',
      postCode: 'LS1 4AP',
      country: 'United Kingdom',
    },
    items: [
      {
        name: 'Server Maintenance',
        quantity: 1,
        price: 600,
      },
    ],
    total: 600,
  },
];
