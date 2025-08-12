import { writable } from "svelte/store";
import { billStore, currentBill } from "$lib/stores/bill-store";
import { page, navigating, updated } from "$app/state";
import { goto, onNavigate } from "$app/navigation";
export let isBillPage = writable<boolean>(false);

export function NavigateTo(url: string) {
  goto(url);
  isBillPageNow(url);
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
  } else {
    let id = page.url.searchParams.get("id");
    if (id) {
      let bill = billStore.getBillById(id);
      if (bill) {
        if (bill.items.length === 0) {
          //尝试从服务器获取items
          bill.getItemFromServer();
        }
      }
      currentBill.set(bill);
    }
  }
  return isBillDetailOrSettings;
}
