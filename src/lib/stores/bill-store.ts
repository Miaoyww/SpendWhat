// stores/billStore.ts
import { writable } from "svelte/store";
import { Bill } from "$lib/models/bill/bill";
import { BillItem } from "$lib/models/bill/bill-item";
import { deleteBillLocal, saveBillLocal } from "$lib/stores/data-store";

// 定义 billStore 来存储所有账单
const billsStore = writable<Bill[]>([]);
const currentBill = writable<Bill | undefined>();

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
  billsStore.update((bills) => bills.filter((bill) => bill.id !== id));
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
  currentBill,
  getBillById,
  addBill,
  addBillList,
  removeBill,
  updateBill,
  addBillItem,
  removeBillItem,
  clear,
};
