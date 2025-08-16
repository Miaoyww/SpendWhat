import { writable } from "svelte/store";
import { currentBill } from "$lib/stores/bill-store";
import { page } from "$app/state";
import { goto } from "$app/navigation";
export let isBillPage = writable<boolean>(false);

export function NavigateTo(url: string) {
  isBillPageNow(url);
  goto(url);
}

export function isBillPageNow(url: string = ""): boolean {
  let isBillDetailOrSettings;
  if (url) {
    isBillDetailOrSettings = url.includes("/bill/");
  } else {
    isBillDetailOrSettings = page.url.pathname.includes("/bill/");
  }

  isBillPage.set(isBillDetailOrSettings);
  if (!isBillDetailOrSettings) {
    currentBill.set(undefined);
  }
  return isBillDetailOrSettings;
}
