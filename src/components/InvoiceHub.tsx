'use client';
import React from 'react';
import { useInvoiceStore } from '@/store/invoiceStore';
import { useUIStore } from '@/store/uiStore';
import InvoicePreview from './InvoicePreview';
import { useRouter } from 'next/navigation';

export default function InvoiceHub() {
  const router = useRouter();
  const openForm = useUIStore((s) => s.openForm);
  const {
    invoices = [],
    page,
    totalPages,
    loading,
    fetchInvoices,
  } = useInvoiceStore();

  if (loading) return <p className="text-center mt-10">Loading invoices...</p>;

  if (!invoices || invoices.length === 0) {
    return (
      <div className="min-h-[65vh] w-full max-w-3xl mx-auto bg-white dark:bg-panel-dark rounded-2xl flex flex-col items-center justify-center text-center px-10 md:px-16 py-16 gap-6 shadow-sm">
        <img
          src="/assets/illustration-empty.svg"
          alt="No invoices"
          className="w-64 h-auto"
        />
        <div>
          <p className="text-xl font-semibold text-foreground">There is nothing here</p>
          <p className="text-muted">Create an invoice by clicking the New Invoice button and get started</p>
        </div>
        <button
          className="mt-2 bg-primary text-white px-4 py-2 rounded-md hover:opacity-90"
          onClick={openForm}
        >
          New Invoice
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {invoices.map((invoice) => (
        <InvoicePreview
          key={invoice.id}
          invoice={invoice}
          onClick={() => router.push(`/invoices/${invoice.invoiceNumber}`)}
        />
      ))}
      <div className="flex justify-center gap-4 mt-6">
        <button onClick={() => fetchInvoices(page - 1)} disabled={page <= 1}>
          Prev
        </button>
        <span>Page {page} of {totalPages}</span>
        <button onClick={() => fetchInvoices(page + 1)} disabled={page >= totalPages}>
          Next
        </button>
      </div>
    </div>
  );
}
