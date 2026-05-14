import { writable } from 'svelte/store';

export type ToastType = 'success' | 'error';

export type Toast = {
  id: number;
  type: ToastType;
  message: string;
};

const state = writable<Toast | null>(null);

let nextId = 1;
let timer: ReturnType<typeof setTimeout> | null = null;

export const toast = {
  subscribe: state.subscribe,
  show: (input: { type: ToastType; message: string; durationMs?: number }) => {
    const durationMs = input.durationMs ?? 3000;
    const t: Toast = { id: nextId++, type: input.type, message: input.message };
    state.set(t);
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      state.set(null);
      timer = null;
    }, durationMs);
  },
  clear: () => {
    if (timer) clearTimeout(timer);
    timer = null;
    state.set(null);
  }
};
