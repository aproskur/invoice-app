"use client";
import Image from "next/image";
import { TopBar } from "@/components/Topbar";
import { Invoice } from "@/types/invoice";
import { useUIStore } from "@/store/uiStore";
import InvoiceForm from "@/components/InvoiceForm";
import { useEffect } from 'react';
import { useInvoiceStore } from '@/store/invoiceStore';
import InvoiceHub from '@/components/InvoiceHub';

export const oneInvoice: Invoice[] = [
  {
    id: "XM9141",
    description: "Graphic Design",
    status: "pending",
    invoiceDate: "2021-08-21T00:00:00Z",
    paymentDue: "2021-09-20T00:00:00Z",
    clientName: "Alex Grim",
    clientEmail: "alexgrim@mail.com",
    senderAddress: {
      street: "19 Union Terrace",
      city: "London",
      postCode: "E1 3EZ",
      country: "United Kingdom",
    },
    clientAddress: {
      street: "84 Church Way",
      city: "Bradford",
      postCode: "BD1 9PB",
      country: "United Kingdom",
    },
    items: [
      {
        name: "Banner Design",
        quantity: 1,
        price: 156.0,
      },
      {
        name: "Email Design",
        quantity: 2,
        price: 200.0,
      },
    ],
    total: 556.0,
  },
];

export default function Home() {
  const showForm = useUIStore((state) => state.showForm);
  const closeForm = useUIStore((state) => state.closeForm);
  const { invoices, setInvoices } = useInvoiceStore();

  useEffect(() => {
    fetch('/api/invoices')
      .then((res) => res.json())
      .then((data) => {
        console.log('Fetched invoices:', data);
        setInvoices(data);
      })
      .catch(console.error);
  }, [setInvoices]);

  return (
    <main className="h-screen pr-1 pl-1 pt-4 md:pr-32 md:pl-32 relative">
      <TopBar totalInvoices={invoices.length} />
      <InvoiceHub invoices={invoices} />
      

      {showForm && (
        <div className="absolute inset-0 z-50 flex">
          {/* Invoice Form Panel */}
          <div className="dark:bg-background w-[600px] h-full bg-white shadow-lg p-6 overflow-auto z-50 animate-slide-in-left">            <InvoiceForm
              mode="create"
              onCancel={closeForm}
              onSubmit={(data) => {
                console.log("Submit:", data);
                closeForm();
              }}
            />
          </div>

          {/* Gray Overlay to the right of the form */}
          <div
            className="flex-1 bg-black/60"
            onClick={closeForm} // optional close on click
          />
        </div>
      )}
    </main>
  );
}
