'use client';

import Link from 'next/link';
import ArrowLeftIcon from '@/assets/icon-arrow-left.svg';
import { notFound } from 'next/navigation';
import Invoice from '@/components/Invoice';
import { allInvoices } from '@/data/mock';
import { Invoice as InvoiceType } from '@/types/invoice';
import InvoiceForm from '@/components/InvoiceForm';
import { useUIStore } from '@/store/uiStore';
import { useInvoiceStore } from '@/store/invoiceStore';

export default function InvoicePage({ params }: { params: { id: string } }) {
  const showForm = useUIStore((state) => state.showForm);
  const closeForm = useUIStore((state) => state.closeForm);
  const draft = useInvoiceStore((state) => state.draft);

  const invoice = allInvoices.find((inv: InvoiceType) => inv.id === params.id);
  if (!invoice) return notFound();

  const handleSubmit = (updatedInvoice: InvoiceType) => {
    // Here you would update the invoice in your state, database, etc.
    console.log('Updated Invoice:', updatedInvoice);
    closeForm(); // Close the form
  };

  return (
    <main className="relative pt-4 pr-32 pl-32 space-y-6 h-screen">
    <Link
      href="/"
      className="inline-flex items-center gap-3 text-sm text-muted hover:text-foreground font-bold mt-2 mb-6"
    >
      <ArrowLeftIcon />
      Go back
    </Link>
  
    <Invoice invoice={invoice} />
  
    {showForm && (
      <div className="absolute inset-0 z-50 flex">
        {/* Invoice Form */}
        <div className="w-[600px] h-full bg-white shadow-lg p-6 overflow-auto z-50 animate-slide-in-left">          <InvoiceForm
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
