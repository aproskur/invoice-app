import { Invoice } from '@/types/invoice';
import { format } from 'date-fns';
import { cn } from '@/utils/cn'; 

interface InvoicePreviewProps {
  invoice: Invoice;
  onClick?: () => void;
}

export default function InvoicePreview({ invoice, onClick }: InvoicePreviewProps) {
  const formattedDate = format(new Date(invoice.invoiceDate), 'dd MMM yyyy');
  const formattedTotal = `£ ${invoice.totalAmount.toFixed(2)}`;



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
      className="flex flex-col sm:flex-row sm:items-center justify-between bg-white dark:bg-gray-800 px-6 py-4 rounded-md shadow-sm cursor-pointer hover:ring-2 hover:ring-primary transition"
    >
      {/* Mobile layout */}
      <div className="sm:hidden">
        <div className="flex justify-between">
          <span className="text-sm font-bold text-gray-800 dark:text-white">
            #{invoice.invoiceNumber}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-300">
            {invoice.client?.name}
          </span>
        </div>

        <div className="flex justify-between items-start mt-2">
          <div className="flex flex-col">
            <span className="text-sm text-gray-500 dark:text-gray-300">
              Due {formattedDate}
            </span>
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              {formattedTotal}
            </span>
          </div>

          <div>
          <span
  className={cn(
    'flex items-center justify-center w-[130px] px-4 py-2 rounded-md text-sm font-semibold',
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
  <span className="ml-2">{invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}</span>
</span>





          </div>
        </div>
      </div>

  {/* Desktop layout */}
<div className="hidden sm:grid w-full grid-cols-[120px_160px_1fr_150px_150px_30px] items-center gap-4">
  <span className="text-sm font-bold text-gray-800 dark:text-white">
    #{invoice.invoiceNumber}
  </span>
  <span className="text-sm text-gray-500 dark:text-gray-300">
    Due {formattedDate}
  </span>
  <span className="text-sm text-gray-500 dark:text-gray-300 truncate">
    {invoice.client?.name}
  </span>
  <span className="text-lg font-bold text-gray-900 dark:text-white">
    {formattedTotal}
  </span>
  <span
  className={cn(
    'inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-md justify-center  w-[140px]',
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

  <span className="text-purple-600 justify-self-end">{'>'}</span>
</div>

    </div>
  );
}
