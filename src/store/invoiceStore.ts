import { create } from 'zustand';
import { InvoiceInput } from '@/types/invoice';

type State = {
  draft: InvoiceInput | null;
  setDraft: (data: InvoiceInput) => void;
  clearDraft: () => void;
};

export const useInvoiceStore = create<State>((set) => ({
  draft: null,
  setDraft: (data) => set({ draft: data }),
  clearDraft: () => set({ draft: null }),
}));
