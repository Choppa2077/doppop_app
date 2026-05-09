import { create } from 'zustand';

export type ToastVariant = 'default' | 'success' | 'error';

export type ToastEntry = {
  id: number;
  message: string;
  variant: ToastVariant;
};

type ToastStore = {
  toasts: ToastEntry[];
  push: (message: string, variant: ToastVariant) => void;
  dismiss: (id: number) => void;
};

let nextId = 1;

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  push: (message, variant) => {
    const id = nextId++;
    set((s) => ({ toasts: [...s.toasts, { id, message, variant }] }));
  },
  dismiss: (id) => {
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
  },
}));

export const toast = {
  success: (message: string) =>
    useToastStore.getState().push(message, 'success'),
  error: (message: string) => useToastStore.getState().push(message, 'error'),
  show: (message: string) =>
    useToastStore.getState().push(message, 'default'),
};
