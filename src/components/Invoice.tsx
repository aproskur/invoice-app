'use client';

import { Invoice } from '@/types/invoice';
import { format } from 'date-fns';
import { useUIStore } from "@/store/uiStore"; 
import { useInvoiceStore } from "@/store/invoiceStore"; // to set the draft

type Props = {
  invoice: Invoice;
};

export default function Invoice({ invoice }: Props) {
  const formattedInvoiceDate = format(new Date(invoice.invoiceDate), 'dd MMM yyyy');
  const formattedDueDate = format(new Date(invoice.paymentDue), 'dd MMM yyyy');
  const openForm = useUIStore((state) => state.openForm);
  const setDraft = useInvoiceStore((state) => state.setDraft);

  const handleEdit = () => {
    setDraft(invoice);       // Pre-fill form with this invoice
    openForm();              // Show the form in edit mode
  };


  const statusStyles = {
    paid: {
      bg: 'bg-green-100',
      text: 'text-green-700',
      dot: 'bg-green-700',
    },
    pending: {
      bg: 'bg-orange-100',
      text: 'text-orange-700',
      dot: 'bg-orange-700',
    },
    draft: {
      bg: 'bg-gray-700',
      text: 'text-white',
      dot: 'bg-white',
    },
  };

  return (
    <div className="space-y-6">
{/* Top Actions Bar */}
<div className="bg-white dark:bg-panel-dark p-6 rounded-md flex flex-col md:flex-row md:items-center md:justify-between">
  {/* Status Section */}
  <div className="flex justify-between items-center md:items-center md:gap-4">
    <span className="text-sm text-muted">Status</span>
    <span
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-md font-semibold text-sm ${statusStyles[invoice.status].bg} ${statusStyles[invoice.status].text}`}
    >
      <span className={`w-2 h-2 rounded-full ${statusStyles[invoice.status].dot}`} />
      {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
    </span>
  </div>

  {/* Buttons - hidden on mobile */}
  <div className="hidden md:flex mt-4 md:mt-0 gap-2">
    <button
      onClick={handleEdit}
      className="bg-muted text-sm px-4 py-2 rounded-md text-foreground hover:opacity-90"
    >
      Edit
    </button>
    <button className="bg-danger text-white text-sm px-4 py-2 rounded-full hover:opacity-90">
      Delete
    </button>
    <button className="bg-primary text-white text-sm px-4 py-2 rounded-full hover:opacity-90">
      Mark as Paid
    </button>
  </div>
</div>

      {/* Invoice Info Section */}
      <div className="bg-white dark:bg-panel-dark p-6 rounded-md space-y-8">
        <div className="flex flex-col md:flex-row md:justify-between gap-4">
          {/* ID + Description */}
          <div>
            <h2 className="font-bold text-lg text-foreground">#{invoice.id}</h2>
            <p className="text-muted">{invoice.description}</p>
          </div>

          {/* Sender Address */}
          <div className="text-muted md:text-right text-sm text-muted">
            {invoice.senderAddress.street}
            <br />
            {invoice.senderAddress.city}
            <br />
            {invoice.senderAddress.postCode}
            <br />
            {invoice.senderAddress.country}
          </div>
        </div>

        {/* Dates + Addresses */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 text-sm">
  {/* Column 1: Invoice Date + Payment Due */}
  <div>
    <p className="text-muted">Invoice Date</p>
    <p className="text-foreground font-bold">{formattedInvoiceDate}</p>

    <p className="mt-4 text-muted">Payment Due</p>
    <p className="text-foreground font-bold">{formattedDueDate}</p>
  </div>

  {/* Column 2: Bill To */}
  <div>
    <p className="text-muted">Bill To</p>
    <p className="text-foreground font-bold">{invoice.clientName}</p>
    <p className="text-muted">
      {invoice.clientAddress.street}
      <br />
      {invoice.clientAddress.city}
      <br />
      {invoice.clientAddress.postCode}
      <br />
      {invoice.clientAddress.country}
    </p>
  </div>

  {/* Column 3: Sent to (desktop only, hidden on small screens) */}
  <div className="col-span-2 sm:col-span-1">
    <p className="text-muted">Sent to</p>
    <p className="text-foreground font-bold">{invoice.clientEmail}</p>
  </div>
</div>


  {/* Items Table */}
<div className="bg-panel-darker rounded-md overflow-hidden">

{/* Desktop Table */}
<div className="dark:bg-panel-darker hidden rounded-md shadow-xl sm:block p-6">
  <div className="grid grid-cols-4 text-sm text-muted font-medium mb-2">
    <div>Item Name</div>
    <div className="text-center">QTY.</div>
    <div className="text-right">Price</div>
    <div className="text-right">Total</div>
  </div>
  {invoice.items.map((item) => (
    <div
      key={item.name}
      className="grid grid-cols-4 text-sm py-2 text-foreground font-semibold"
    >
      <div>{item.name}</div>
      <div className="text-center">{item.quantity}</div>
      <div className="text-right">£ {item.price.toFixed(2)}</div>
      <div className="text-right">£ {(item.price * item.quantity).toFixed(2)}</div>
    </div>
  ))}
</div>

{/* Mobile Version */}
<div className="sm:hidden p-4 flex flex-col gap-6">
  {invoice.items.map((item) => (
    <div key={item.name} className="flex flex-col">
      <div className="flex justify-between text-foreground font-bold">
        <span>{item.name}</span>
        <span>£ {(item.price * item.quantity).toFixed(2)}</span>
      </div>
      <div className="text-muted text-sm">
        {item.quantity} x £ {item.price.toFixed(2)}
      </div>
    </div>
  ))}
</div>

{/* Total Footer (Shared) */}
<div className="dark:bg-background bg-panel-dark px-4 py-4 flex justify-between items-center">
  <span className="text-white text-sm">Grand Total</span>
  <span className="text-white font-bold text-xl">
    £ {invoice.totalAmount.toFixed(2)}
  </span>
</div>
</div>

      </div>
    </div>
  );
}
