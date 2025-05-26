"use client";
import ArrowDownIcon from "@/assets/icon-arrow-down.svg";
import PlusIcon from "@/assets/icon-plus.svg";
import { useUIStore } from "@/store/uiStore";

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
    <div className="flex flex-row justify-between items-center md:items-start py-6 px-4 md:px-0">
      {/* Title + Count */}
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Invoices
        </h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-white">
  {totalInvoices === 0 ? (
    <>
      <span className="block md:hidden">No invoices</span>
      <span className="hidden md:block">No invoices</span>
    </>
  ) : (
    <>
      <span className="block md:hidden">
        {totalInvoices} {totalInvoices === 1 ? "invoice" : "invoices"}
      </span>
      <span className="hidden md:block">
        There are <span className="font-semibold">{totalInvoices}</span> total invoices
      </span>
    </>
  )}
</p>


      </div>

      {/* Buttons */}
      <div className="flex items-center space-x-3 mt-0 md:mt-4">
        <button
          onClick={onFilterClick}
          className="flex items-center text-sm font-medium text-gray-700 dark:text-white hover:text-gray-900 dark:hover:text-white"
        >
          <span className="block md:hidden">Filter</span>
          <span className="hidden md:block">Filter by status</span>
          <ArrowDownIcon className="mt-2 ml-2" />
        </button>
        <button
          onClick={openForm}
          className="flex items-center bg-primary hover:bg-purple-600 text-white text-sm font-medium px-4 py-2 rounded-full"
        >
          <span className="inline-flex items-center justify-center w-6 h-6 bg-white rounded-full mr-2">
            <PlusIcon className="w-2 h-2 text-purple-600" />
          </span>
          <span className="block md:hidden">New</span>
          <span className="hidden md:block">New Invoice</span>
        </button>
      </div>
    </div>
  );
};
