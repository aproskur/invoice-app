'use client';

import type { Invoice as InvoiceType, InvoiceInput } from '@/types/invoice';
import { format } from 'date-fns';
import { useUIStore } from '@/store/uiStore';
import { useInvoiceStore } from '@/store/invoiceStore';
import { useRouter } from 'next/navigation';
import { usePreview } from '@/context/PreviewContext';

type Props = { invoice: InvoiceType };

export default function InvoiceView({ invoice }: Props) {
  const router = useRouter();
  const openForm = useUIStore((s) => s.openForm);
  const setDraft = useInvoiceStore((s) => s.setDraft);
  const removeInvoice = useInvoiceStore((s) => s.removeInvoice);
  const markPaid = useInvoiceStore((s) => s.markInvoicePaid);
  const { previewMode } = usePreview();

  // helpers
  const safeDate = (d?: string) => (d ? format(new Date(d), 'dd MMM yyyy') : '');
  const money = (n?: number) =>
    new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(n ?? 0);

  const formattedInvoiceDate = safeDate(invoice?.invoiceDate);
  const formattedDueDate = safeDate(invoice?.paymentDue);
  const items = invoice.items ?? [];
  const hasItems = items.length > 0;
  const computedTotal = invoice.totalAmount ?? items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const mapInvoiceToDraft = (source: InvoiceType): InvoiceInput => ({
    invoiceNumber: source.invoiceNumber,
    description: source.description ?? '',
    status: source.status,
    invoiceDate: source.invoiceDate,
    paymentDue: source.paymentDue,
    clientName: source.client?.name ?? '',
    clientEmail: source.client?.email ?? '',
    senderAddress: { ...source.senderAddress },
    clientAddress: { ...source.clientAddress },
    items: source.items.map((item) => ({
      name: item.name,
      quantity: item.quantity,
      price: item.price,
    })),
    userId: source.userId,
    clientId: source.clientId ?? undefined,
    totalAmount: source.totalAmount,
  });

  const handleEdit = () => {
    setDraft(mapInvoiceToDraft(invoice));
    openForm();
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/invoices/${invoice.invoiceNumber}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete invoice');
      removeInvoice(invoice.id); // if store removes by invoiceNumber, pass that instead
      router.push('/');
    } catch (err) {
      console.error(err);
      alert('There was a problem deleting the invoice.');
    }
  };

  

  const handleMarkPaid = () => markPaid(invoice.invoiceNumber);

// keep  statusStyles object as-is
const statusStyles = {
  paid:   { bg: 'bg-green-100',  text: 'text-green-700',  dot: 'bg-green-700' },
  pending:{ bg: 'bg-orange-100', text: 'text-orange-700', dot: 'bg-orange-700' },
  draft:  { bg: 'bg-gray-700',   text: 'text-white',      dot: 'bg-white' },
} as const;

// normalize whatever comes from the API to our 3 keys
type StatusKey = keyof typeof statusStyles; // 'paid' | 'pending' | 'draft'

const normalizeStatus = (s: unknown): StatusKey => {
  const k = String(s ?? '').trim().toLowerCase();
  return k === 'paid' || k === 'pending' || k === 'draft' ? k : 'draft';
};

const statusKey = normalizeStatus(invoice.status);
const st = statusStyles[statusKey];

  return (
    <div className="space-y-6">
      {/* Top Actions Bar */}
      {!previewMode && (
        <div className="print:hidden bg-white dark:bg-panel-dark p-6 rounded-md flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex justify-between items-center md:items-center md:gap-4">
            <span className="text-sm text-muted">Status</span>
       <span
  className={`inline-flex items-center gap-2 px-4 py-2 rounded-md font-semibold text-sm ${st.bg} ${st.text}`}
>
  <span className={`w-2 h-2 rounded-full ${st.dot}`} />
  {statusKey.charAt(0).toUpperCase() + statusKey.slice(1)}
</span>

          </div>

          <div className="hidden md:flex mt-4 md:mt-0 gap-2">
            <button onClick={handleEdit} className="bg-muted text-sm px-4 py-2 rounded-md text-foreground hover:opacity-90">
              Edit
            </button>
            <button onClick={handleDelete} className="bg-danger text-white text-sm px-4 py-2 rounded-full hover:opacity-90">
              Delete
            </button>
            <button onClick={handleMarkPaid} className="bg-primary text-white text-sm px-4 py-2 rounded-full hover:opacity-90">
              Mark as Paid
            </button>
          </div>
        </div>
      )}

      {/* Invoice Info */}
      <div className="bg-white dark:bg-panel-dark p-6 rounded-md space-y-8 min-h-[70vh]">
        <div className="flex flex-col md:flex-row md:justify-between gap-4">
          <div>
            <div className="mb-2">
              <img src="/assets/logo_webdev_blue.png" alt="webdev logo" className="h-10 w-60" />
            </div>
            <h2 className="font-bold text-lg text-foreground">#{invoice.invoiceNumber}</h2>
            <p className="text-muted">{invoice.description || 'No description provided'}</p>
          </div>

          {/* Sender Address */}
          <div className="text-muted md:text-right text-sm">
            Anna Pro
            <br />
            {invoice.senderAddress?.street ?? ''}
            <br />
            {invoice.senderAddress?.city ?? ''}
            <br />
            {invoice.senderAddress?.postCode ?? ''}
            <br />
            {invoice.senderAddress?.country ?? ''}
          </div>
        </div>

        {/* Dates + Addresses */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 text-sm">
          <div>
            <p className="text-muted">Invoice Date</p>
            <p className="text-foreground font-bold">{formattedInvoiceDate}</p>

            <p className="mt-4 text-muted">Payment Due</p>
            <p className="text-foreground font-bold">{formattedDueDate || '—'}</p>
          </div>

          <div>
            <p className="text-muted">Bill To</p>
            <p className="text-foreground font-bold">{invoice.client.name || 'No client name yet'}</p>
            <p className="text-muted">
              {invoice.clientAddress?.street || '—'}
              <br />
              {invoice.clientAddress?.city || '—'}
              <br />
              {invoice.clientAddress?.postCode || '—'}
              <br />
              {invoice.clientAddress?.country || '—'}
            </p>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <p className="text-muted">Sent to</p>
            <p className="text-foreground font-bold">{invoice.client?.email || 'No email provided'}</p>
          </div>
        </div>

        {/* Items */}
        <div className="bg-panel-darker rounded-md overflow-hidden">
          {hasItems ? (
            <>
              <div className="dark:bg-panel-darker hidden rounded-md shadow-xl sm:block p-6 print:block">
                <div className="grid grid-cols-4 text-sm text-muted font-medium mb-2">
                  <div>Item Name</div>
                  <div className="text-center">Hours</div>
                  <div className="text-right">Price</div>
                  <div className="text-right">Total</div>
                </div>
                {items.map((item, idx) => (
                  <div key={`${item.name}-${idx}`} className="grid grid-cols-4 text-sm py-2 text-foreground">
                    <div>{item.name}</div>
                    <div className="text-center">{item.quantity}</div>
                    <div className="text-right">{money(item.price)}</div>
                    <div className="text-right">{money(item.price * item.quantity)}</div>
                  </div>
                ))}
              </div>

              {/* Mobile */}
              <div className="sm:hidden p-4 flex flex-col gap-4 print:hidden">
                {items.map((item, idx) => (
                  <div key={`${item.name}-${idx}`} className="flex flex-col">
                    <div className="flex justify-between text-foreground">
                      <span>{item.name}</span>
                      <span className="whitespace-nowrap">{money(item.price * item.quantity)}</span>
                    </div>
                    <div className="text-muted text-sm">
                      {item.quantity} × {money(item.price)}
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="p-6 bg-white dark:bg-panel-dark text-center text-muted border-2 border-dashed border-muted/40 m-4 rounded-lg">
              No line items yet. Add items to calculate totals.
            </div>
          )}

          {/* Total */}
          <div className="dark:bg-background bg-panel-dark px-4 py-4 flex justify-between items-center">
            <span className="text-white text-sm">Grand Total</span>
            <span className="text-white font-bold text-xl">{money(computedTotal)}</span>
          </div>

          {/* Bank Details */}
          <div className="print-safe-text bg-white dark:bg-panel-dark p-6 rounded-md">
            <h3 className="text-sm text-muted font-semibold mb-2">Bank Details</h3>
            <div className="text-sm text-foreground space-y-1">
              <p><strong>Bank:</strong> Bank</p>
              <p><strong>Account Holder Name:</strong> Anna </p>
              <p><strong>Account Number:</strong> 111111</p>
              <p><strong>Sort Code:</strong> 11-11-11</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
