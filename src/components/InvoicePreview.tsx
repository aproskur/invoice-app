import { Invoice } from '@/types/invoice';
import { format } from 'date-fns';
import { cn } from '@/utils/cn'; 

interface InvoicePreviewProps {
  invoice: Invoice;
  onClick?: () => void;
}

export default function InvoicePreview({ invoice, onClick }: InvoicePreviewProps) {
    const formattedDate = format(new Date(invoice.invoiceDate), 'dd MMM yyyy');

  const formattedTotal = `£ ${invoice.total.toFixed(2)}`;

  const statusStyles: Record<
  Invoice['status'],
  { bg: string; text: string; dot: string }
> = {
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
    <div
      onClick={onClick}
      className="flex items-center justify-between bg-white dark:bg-gray-800 px-6 py-4 rounded-md shadow-sm cursor-pointer hover:ring-2 hover:ring-primary transition"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6">
        <span className="text-sm font-bold text-gray-800 dark:text-white">
          #{invoice.id}
        </span>
        <span className="text-sm text-gray-500 dark:text-gray-300">
          Due {formattedDate}
        </span>
        <span className="hidden sm:inline text-sm text-gray-500 dark:text-gray-300">
          {invoice.clientName}
        </span>
      </div>

      <div className="flex items-center space-x-4">
        <span className="text-lg font-bold text-gray-900 dark:text-white">
          {formattedTotal}
        </span>
        <span
  className={cn(
    'inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-md',
    statusStyles[invoice.status].bg,
    statusStyles[invoice.status].text
  )}
>
  <span
    className={cn(
      'w-2 h-2 rounded-full',
      statusStyles[invoice.status].dot
    )}
  />
  {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
</span>

        <span className="text-purple-600">{'>'}</span>
      </div>
    </div>
  );
}
