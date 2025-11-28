'use client';

import Link from 'next/link';
import ArrowLeftIcon from '@/assets/icon-arrow-left.svg';
import Invoice from '@/components/Invoice';
import InvoiceForm from '@/components/InvoiceForm';
import { useUIStore } from '@/store/uiStore';
import { useInvoiceStore } from '@/store/invoiceStore';
import { MobileActionBar } from '@/components/MobileActionBar';
import { useEffect, useState } from 'react';
import { usePreview } from '@/context/PreviewContext';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';

export default function InvoicePage() {
  const { invoiceNumber } = useParams<{ invoiceNumber: string }>(); // useParams instead of props
  const router = useRouter();

  const showForm = useUIStore((s) => s.showForm);
  const closeForm = useUIStore((s) => s.closeForm);
  const draft = useInvoiceStore((s) => s.draft);
  const addInvoice = useInvoiceStore((s) => s.addInvoice);
  const markPaid = useInvoiceStore((s) => s.markInvoicePaid);
  const removeInvoice = useInvoiceStore((s) => s.removeInvoice);
  const invoice = useInvoiceStore((s) =>
    s.invoices.find((inv) => inv.invoiceNumber === invoiceNumber)
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { previewMode, setPreviewMode } = usePreview();


  useEffect(() => {
    if (!invoiceNumber || typeof invoiceNumber !== 'string') return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    (async () => {
      try {
        const res = await fetch(`/api/invoices/${invoiceNumber}`, { cache: 'no-store' });
        if (!res.ok) throw new Error('Invoice not found');
        const data = await res.json();
        if (!cancelled) addInvoice(data);
      } catch (err) {
        console.error('Failed to fetch invoice:', err);
        if (!cancelled) setError('Failed to load invoice');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [invoiceNumber, addInvoice]); // fetch once per invoiceNumber

  if (loading || !invoice) {
    return (
      <main className="pr-1 pl-1 pt-4 md:pr-32 md:pl-32">
        <p className="text-center text-muted mt-20">
          {error || 'Loading invoice...'}
        </p>
      </main>
    );
  }

  const handleSubmit = (updatedInvoice: any) => {
    console.log('Updated Invoice:', updatedInvoice);
    closeForm();
  };

  const handleEdit = () => {
    // if setDraft expects InvoiceInput and TS complains, map before setting
    useInvoiceStore.getState().setDraft(invoice as any);
    useUIStore.getState().openForm();
  };

  const handleDelete = () => {
    (async () => {
      try {
        const res = await fetch(`/api/invoices/${invoiceNumber}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Failed to delete invoice');
        removeInvoice(invoice.id);
        router.push('/');
      } catch (err) {
        console.error('Failed to delete invoice:', err);
        alert('There was a problem deleting the invoice.');
      }
    })();
  };

  const handleMarkAsPaid = async () => {
    await markPaid(invoice.invoiceNumber);
  };

  const handleAfterSave = (updated: any) => {
    // ensure store has freshest data after edits
    addInvoice(updated);
  };

  return (
    <main className="pr-1 pl-1 relative pt-4 pb-24 md:pr-32 md:pl-32 space-y-6 min-h-screen">
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

      {showForm && (
        <div className="absolute inset-0 z-50 flex">
          <div className="dark:bg-background w-[600px] h-full bg-white shadow-lg p-6 overflow-auto z-50 animate-slide-in-left">
            <InvoiceForm
              invoice={draft}
              mode="edit"
              invoiceNumberOverride={invoice.invoiceNumber}
              onCancel={closeForm}
              onSubmit={(inv) => {
                handleAfterSave(inv);
                handleSubmit(inv);
              }}
            />
          </div>
          <div className="flex-1 bg-black/60" onClick={closeForm} />
        </div>
      )}
    </main>
  );
}
