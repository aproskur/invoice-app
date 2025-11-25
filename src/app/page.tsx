"use client";
import Image from "next/image";
import { TopBar } from "@/components/Topbar";
import { Invoice } from "@/types/invoice";
import { useUIStore } from "@/store/uiStore";
import InvoiceForm from "@/components/InvoiceForm";
import { useEffect } from 'react';
import { useInvoiceStore } from '@/store/invoiceStore';
import InvoiceHub from '@/components/InvoiceHub';
import { usePreview } from '@/context/PreviewContext';

export const oneInvoice: Invoice[] = [
  {
    id: "XM9141",
    invoiceNumber: "XM9141",
    description: "Graphic Design",
    status: "pending",
    invoiceDate: "2021-08-21T00:00:00Z",
    paymentDue: "2021-09-20T00:00:00Z",
    userId: "demo-user",
    clientId: "client-xm9141",
    client: {
      name: "Alex Grim",
      email: "alexgrim@mail.com",
      street: "84 Church Way",
      city: "Bradford",
      postCode: "BD1 9PB",
      country: "United Kingdom",
    },
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
    totalAmount: 556.0,
  },
];

export default function Home() {
  const showForm = useUIStore((state) => state.showForm);
  const closeForm = useUIStore((state) => state.closeForm);
  const fetchInvoices = useInvoiceStore((state) => state.fetchInvoices);
  const page = useInvoiceStore((state) => state.page);
  const totalInvoices = useInvoiceStore((state) => state.totalInvoices);
  const { previewMode } = usePreview();

  useEffect(() => {
    fetchInvoices(page);
  }, [fetchInvoices, page]);

  console.log("CONTEXT", previewMode);

  return (
    <main className="min-h-screen flex flex-col items-center px-6 md:px-12 lg:px-20 pt-6 pb-16 relative">
      <div className="w-full max-w-5xl space-y-8">
        {!previewMode && <TopBar totalInvoices={totalInvoices} />}
        <InvoiceHub />
      </div>

      {showForm && (
        <div className="absolute inset-0 z-50 flex">
          {/* Invoice Form Panel */}
          <div className="dark:bg-background w-[600px] h-full bg-white shadow-lg p-6 overflow-auto z-50 animate-slide-in-left">
            <InvoiceForm mode="create" onCancel={closeForm} />
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
