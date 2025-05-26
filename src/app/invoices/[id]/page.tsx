'use client';

import Link from 'next/link';
import ArrowLeftIcon from '@/assets/icon-arrow-left.svg';
import { notFound } from 'next/navigation';
import Invoice from '@/components/Invoice';
import InvoiceForm from '@/components/InvoiceForm';
import { useUIStore } from '@/store/uiStore';
import { useInvoiceStore } from '@/store/invoiceStore';
import { MobileActionBar } from '@/components/MobileActionBar';
import { useEffect, useState } from 'react';
import type { Invoice as InvoiceType } from '@/types/invoice';

export default function InvoicePage({ params }: { params: { id: string } }) {
  const showForm = useUIStore((state) => state.showForm);
  const closeForm = useUIStore((state) => state.closeForm);
  const draft = useInvoiceStore((state) => state.draft);
  const invoices = useInvoiceStore((state) => state.invoices);

  const [invoice, setInvoice] = useState<InvoiceType | null>(null);

  useEffect(() => {
    const found = invoices.find((inv) => inv.id === params.id);
    if (found) setInvoice(found);
  }, [invoices, params.id]);

  if (!invoice) {
    return (
      <main className="pr-1 pl-1 pt-4 md:pr-32 md:pl-32">
        <p className="text-center text-muted mt-20">Loading invoice...</p>
      </main>
    );
  }

  const handleSubmit = (updatedInvoice: InvoiceType) => {
    // Here you would update the invoice in your state, database, etc.
    console.log('Updated Invoice:', updatedInvoice);
    closeForm(); // Close the form
  };

  const handleEdit = () => {
    useInvoiceStore.getState().setDraft(invoice);
    useUIStore.getState().openForm();
  };
  
  const handleDelete = () => {
    console.log("Delete invoice:", invoice.id);
    // Add your actual delete logic here
  };
  
  const handleMarkAsPaid = () => {
    console.log("Mark as paid:", invoice.id);
    // Add your actual mark-as-paid logic here
  };
  

  return (
<main className="pr-1 pl-1 relative pt-4 pb-24 md:pr-32 md:pl-32 space-y-6 min-h-screen">    <Link
      href="/"
      className="inline-flex items-center gap-3 text-sm text-muted hover:text-foreground font-bold mt-2 mb-6"
    >
      <ArrowLeftIcon />
      Go back
    </Link>
  
    <Invoice invoice={invoice} />
    <MobileActionBar
  onEdit={handleEdit}
  onDelete={handleDelete}
  onMarkAsPaid={handleMarkAsPaid}
/>
    {showForm && (
      <div className="absolute inset-0 z-50 flex">
        {/* Invoice Form */}
        <div className="dark:bg-background w-[600px] h-full bg-white shadow-lg p-6 overflow-auto z-50 animate-slide-in-left">          <InvoiceForm
            invoice={draft}
            mode="edit"
            onCancel={closeForm}
            onSubmit={handleSubmit}
          />
        </div>
  
        {/* Overlay to the right of the form */}
        <div
          className="flex-1 bg-black/60"
          onClick={closeForm}
        />
      </div>
    )}
  </main>
  
  );
}
