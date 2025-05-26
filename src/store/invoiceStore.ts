import { create } from 'zustand';
import { Invoice, InvoiceInput } from '@/types/invoice';

type State = {
  invoices: Invoice[];
  draft: InvoiceInput | null;

  setInvoices: (data: Invoice[]) => void;
  addInvoice: (invoice: Invoice) => void;
  removeInvoice: (id: string) => void;

  setDraft: (data: InvoiceInput) => void;
  clearDraft: () => void;
};

export const useInvoiceStore = create<State>((set) => ({
  invoices: [],
  draft: null,

  setInvoices: (data) => set({ invoices: data }),
  addInvoice: (invoice) =>
    set((state) => ({ invoices: [invoice, ...state.invoices] })),
  removeInvoice: (id) =>
    set((state) => ({
      invoices: state.invoices.filter((inv) => inv.id !== id),
    })),

  setDraft: (data) => set({ draft: data }),
  clearDraft: () => set({ draft: null }),
}));
