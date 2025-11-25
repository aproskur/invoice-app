import { create } from 'zustand';
import { Invoice, InvoiceInput } from '@/types/invoice';

type State = {
  invoices: Invoice[];
  draft: InvoiceInput | null;

  page: number;
  totalPages: number;
  totalInvoices: number;
  loading: boolean;
  error: string | null;

  setInvoices: (data: Invoice[]) => void;
  addInvoice: (invoice: Invoice) => void;
  removeInvoice: (id: string) => void;

  setDraft: (data: InvoiceInput) => void;
  clearDraft: () => void;

  fetchInvoices: (page: number, limit?: number) => Promise<void>;
};

export const useInvoiceStore = create<State>((set) => ({
  invoices: [],
  draft: null,
  page: 1,
  totalPages: 1,
  loading: false,
  totalInvoices : 0,
  error: null,

  setInvoices: (data) => set({ invoices: data }),
  addInvoice: (invoice) =>
    set((state) => {
      const existingIndex = state.invoices.findIndex(
        (inv) => inv.id === invoice.id || inv.invoiceNumber === invoice.invoiceNumber
      );

      if (existingIndex !== -1) {
        const updated = [...state.invoices];
        updated[existingIndex] = invoice;
        return { invoices: updated };
      }

      return { invoices: [invoice, ...state.invoices] };
    }),
  removeInvoice: (id) =>
    set((state) => ({
      invoices: state.invoices.filter((inv) => inv.id !== id),
    })),

  setDraft: (data) => set({ draft: data }),
  clearDraft: () => set({ draft: null }),

 fetchInvoices: async (page: number, limit = 8) => {
  const { totalPages } = useInvoiceStore.getState();
  const clampedPage = Math.min(Math.max(page, 1), Math.max(totalPages, 1));

  set({ loading: true, error: null });

  try {
    const res = await fetch(`/api/invoices/paginated?page=${clampedPage}&limit=${limit}`);

    if (!res.ok) {
      throw new Error(`Request failed with status ${res.status}`);
    }

    const data = await res.json();

    set({
      invoices: Array.isArray(data.invoices) ? data.invoices : [],
      page: typeof data.page === 'number' ? data.page : clampedPage,
      totalPages: typeof data.totalPages === 'number' ? data.totalPages : 1,
      totalInvoices: typeof data.totalInvoices === 'number' ? data.totalInvoices : 0,
      loading: false,
      error: null,
    });
  } catch (error) {
    console.error('Failed to fetch invoices:', error);
    set({ loading: false, error: error instanceof Error ? error.message : 'Unknown error' });
  }
}

}));
