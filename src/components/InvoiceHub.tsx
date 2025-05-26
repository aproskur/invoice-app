"use client"
import React from 'react';
import type { Invoice } from '@/types/invoice';
import InvoicePreview from './InvoicePreview';
import { useRouter } from 'next/navigation';



export default function InvoiceHub({ invoices = [] }: { invoices?: Invoice[] }) {

  const router = useRouter();

  if (!Array.isArray(invoices) || invoices.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <img
          src="/assets/illustration-empty.svg"
          alt="No invoices"
          className="w-64 h-auto mb-4 mt-20"
        />
        <p className="text-gray-500">No invoices yet. Create one to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {invoices.map((invoice) => (
    <InvoicePreview
    key={invoice.id}
    invoice={invoice} 
    onClick={() => router.push(`/invoices/${invoice.id}`)}
  />
  
      ))}
    </div>
  );
}
