// stores/billStore.ts
import { writable } from "svelte/store";
import {
  Bill,
  type BillResponseItem,
  mapResponseToBills,
} from "$lib/models/bill/bill";
import { BillItem } from "$lib/models/bill/bill-item";
import { deleteBillLocal, saveBillLocal } from "$lib/stores/data-store";
import { currentUser } from "$lib/stores/user-store";
import api from "$lib/utils/request";
import type { User } from "$lib/models/user";
import { showAlert } from "./alert-dialog-store";
import { NavigateTo } from "$lib/stores/navigating";

// 定义 billStore 来存储所有账单
const billsStore = writable<Bill[]>([]);
export const currentBill = writable<Bill | undefined>();

let _currentBill: Bill | undefined;
currentBill.subscribe((value) => {
  _currentBill = value;
});

// 获取单个账单
function getBillById(id: string): Bill | undefined {
  let bills: Bill[] = [];
  billsStore.subscribe(($bills) => (bills = $bills));
  return bills.find((bill) => bill.id === id);
}

// 添加新账单
function addBill(newBill: Bill) {
  billsStore.update((bills) => [...bills, newBill]);
  saveBillLocal(newBill);
}

function addBillList(newBill: Bill[]) {
  //通过调用addBill添加
  newBill.forEach(addBill);
}

// 删除账单
function removeBill(id: string) {
  let data = {
    id_list: [id],
  };
  api.post("/bill/multi/delete", data).then((response) => {
    if (response.status !== 200) {
      showAlert("错误", `账单未能正确删除. ${response.status}`);
    }
  });
  billsStore.update((bills) => {
    return bills.filter((bill) => bill.id !== id);
  });
  if (_currentBill?.id === id) {
    currentBill.set(undefined);
    NavigateTo("/");
  }
  console.log("删除账单:", id);
  deleteBillLocal(id);
}

// 清除账单
function clear() {
  billsStore.update((bills) => {
    bills.length = 0;
    return [...bills];
  });
  billsStore.set([]);
}

// 更新账单
function updateBill(updatedBill: Bill) {
  billsStore.update((bills) => {
    const index = bills.findIndex((bill) => bill.id === updatedBill.id);
    if (index !== -1) {
      bills[index] = updatedBill;
    }

    saveBillLocal(updatedBill);
    updateBillToServer(updatedBill);
    return [...bills];
  });
}

// 添加账单项
function addBillItem(billId: string, newItem: BillItem) {
  billsStore.update((bills) => {
    const bill = bills.find((b) => b.id === billId);
    if (bill) {
      bill.addItem(newItem);
    }
    return [...bills];
  });
}

// 移除账单项
function removeBillItem(billId: string, itemId: string) {
  billsStore.update((bills) => {
    const bill = bills.find((b) => b.id === billId);
    if (bill) {
      bill.items = bill.items.filter((item) => item.id !== itemId);
    }

    return [...bills];
  });
}

export const billStore = {
  subscribe: billsStore.subscribe,
  getBillById,
  addBill,
  addBillList,
  removeBill,
  updateBill,
  addBillItem,
  removeBillItem,
  clear,
};

export function getCurrentUserBillsFromServer(): Bill[] {
  let data = {
    skip: 0,
    limit: 30,
  };

  api.post("/bill/list", data).then((response) => {
    let billsRaw = response.data as BillResponseItem[];
    let user: User | null = null;
    currentUser.subscribe((value) => {
      user = value;
    });
    if (user) {
      const bills = mapResponseToBills(billsRaw, user);
      billsStore.set(bills);
      return bills.sort(
        (a, b) =>
          new Date(b.created_time).getTime() -
          new Date(a.created_time).getTime()
      );
    }
  });
  return [];
}

export function updateBillToServer(bill: Bill) {
  let data = {
    id: bill.id,
    title: bill.title,
  };
  api.post(`/bill/update`, data).then((response) => {
    if (response.status !== 200) {
      showAlert("错误", `账单未能正确更新. ${response.status}`);
    }
  });
}
