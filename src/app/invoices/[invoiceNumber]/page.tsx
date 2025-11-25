'use client';

import Link from 'next/link';
import ArrowLeftIcon from '@/assets/icon-arrow-left.svg';
import Invoice from '@/components/Invoice';
import InvoiceForm from '@/components/InvoiceForm';
import { useUIStore } from '@/store/uiStore';
import { useInvoiceStore } from '@/store/invoiceStore';
import { MobileActionBar } from '@/components/MobileActionBar';
import { useEffect, useState } from 'react';
import type { Invoice as InvoiceType } from '@/types/invoice';
import { usePreview } from '@/context/PreviewContext';
import { useParams } from 'next/navigation';

export default function InvoicePage() {
  const { invoiceNumber } = useParams<{ invoiceNumber: string }>(); // ✅ useParams instead of props

  const showForm = useUIStore((s) => s.showForm);
  const closeForm = useUIStore((s) => s.closeForm);
  const draft = useInvoiceStore((s) => s.draft);

  const [invoice, setInvoice] = useState<InvoiceType | null>(null);
  const { previewMode, setPreviewMode } = usePreview();

  useEffect(() => {
    if (!invoiceNumber || typeof invoiceNumber !== 'string') return;

    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/invoices/${invoiceNumber}`, { cache: 'no-store' });
        if (!res.ok) throw new Error('Invoice not found');
        const data: InvoiceType = await res.json();
        if (!cancelled) setInvoice(data);
      } catch (err) {
        console.error('Failed to fetch invoice:', err);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [invoiceNumber]); // ✅ depends on the unwrapped value

  if (!invoice) {
    return (
      <main className="pr-1 pl-1 pt-4 md:pr-32 md:pl-32">
        <p className="text-center text-muted mt-20">Loading invoice...</p>
      </main>
    );
  }

  const handleSubmit = (updatedInvoice: InvoiceType) => {
    console.log('Updated Invoice:', updatedInvoice);
    closeForm();
  };

  const handleEdit = () => {
    // if setDraft expects InvoiceInput and TS complains, map before setting
    useInvoiceStore.getState().setDraft(invoice as any);
    useUIStore.getState().openForm();
  };

  const handleDelete = () => {
    console.log('Delete invoice:', invoice.id);
  };

  const handleMarkAsPaid = () => {
    console.log('Mark as paid:', invoice.id);
  };

  return (
    <main className="relative flex flex-col items-center pt-6 pb-24 px-4 md:px-10 lg:px-20 min-h-screen">
      <div className="w-full max-w-4xl space-y-6">
        {!previewMode && (
          <div className="print:hidden flex items-center justify-between mt-2 mb-6">
            <Link href="/" className="inline-flex items-center gap-3 text-sm text-muted hover:text-foreground font-bold">
              <ArrowLeftIcon />
              Go back
            </Link>
            <div className="flex gap-2">
              <button onClick={() => window.print()} className="text-sm font-bold text-muted hover:text-foreground border border-muted px-4 py-2 rounded-md">
                Print
              </button>
              <button onClick={() => setPreviewMode(true)} className="text-sm font-bold text-muted hover:text-foreground border border-muted px-4 py-2 rounded-md">
                Preview
              </button>
            </div>
          </div>
        )}

        {previewMode && (
          <div className="print:hidden flex justify-end mb-6">
            <button onClick={() => setPreviewMode(false)} className="text-sm font-bold text-muted hover:text-foreground border border-muted px-4 py-2 rounded-md">
              Exit Preview
            </button>
          </div>
        )}

        <Invoice invoice={invoice} />

        <MobileActionBar
          onEdit={handleEdit}
          onDelete={handleDelete}
          onMarkAsPaid={handleMarkAsPaid}
        />
      </div>

      {showForm && (
        <div className="absolute inset-0 z-50 flex">
          <div className="dark:bg-background w-[600px] h-full bg-white shadow-lg p-6 overflow-auto z-50 animate-slide-in-left">
            <InvoiceForm
              invoice={draft}
              mode="edit"
              onCancel={closeForm}
              onSubmit={handleSubmit}
            />
          </div>
          <div className="flex-1 bg-black/60" onClick={closeForm} />
        </div>
      )}
    </main>
  );
}
