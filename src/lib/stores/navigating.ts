import { writable } from "svelte/store";
import { goto } from "$app/navigation";
import { navigating, page } from "$app/state";
import {  currentBill } from "$lib/stores/bill-store";
export let isBillPage = writable<boolean>(false);

export function NavigateTo(url: string) {
  //如果是/bill/detail或settings页面
  let isBillDetailOrSettings = url.includes("/bill/");
  isBillPage.set(isBillDetailOrSettings);
  if (!isBillDetailOrSettings) {
    currentBill.set(undefined);
  }
  goto(url);
}
