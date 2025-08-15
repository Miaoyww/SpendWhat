import { writable } from "svelte/store";

export const searchDialog = writable({
  open: false,
});

export function showSearchDialog() {
  searchDialog.set({ open: true });
}

export function hideSearchDialog() {
  searchDialog.update((state) => ({ ...state, open: false }));
}
