"use client"
import ArrowDownIcon from "@/assets/icon-arrow-down.svg";
import PlusIcon from "@/assets/icon-plus.svg";
import { useUIStore } from '@/store/uiStore';

export interface TopBarProps {
  totalInvoices: number;
  onFilterClick?: () => void;
}

export const TopBar = ({
  totalInvoices,
  onFilterClick,
}: TopBarProps) => {

  const openForm = useUIStore((state) => state.openForm);
  
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center py-6 px-4 md:px-0">
      {/* Left side: Title + Count */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Invoices
        </h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-white">
          There are <span className="font-semibold">{totalInvoices}</span> total
          invoices
        </p>
      </div>

      {/* Right side: Filter + New Invoice */}
      <div className="mt-4 md:mt-0 flex items-center space-x-3 gap-4">
        <button
          onClick={onFilterClick}
          className="flex items-center text-sm font-medium text-gray-700 dark:text-white hover:text-gray-900 dark:hover:text-white"
        >
          Filter by status
          <ArrowDownIcon className="ml-4" />
        </button>
        <button
          onClick={openForm}
          className="flex items-center bg-primary hover:bg-purple-600 text-white text-sm font-medium px-4 py-2 rounded-full"
        >
          <span className="inline-flex items-center justify-center w-6 h-6 bg-white rounded-full mr-2">
            <PlusIcon className="w-2 h-2 text-purple-600" />
          </span>
          New Invoice
        </button>
      </div>
    </div>
  );
};
