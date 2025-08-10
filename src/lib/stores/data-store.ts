import { openDB } from "idb";
import { Bill } from "$lib/models/bill/bill";
import { BillItem } from "$lib/models/bill/bill-item";
import { User } from "$lib/models/user";
import { decycle } from "$lib/utils/decycle";

const DB_NAME = "spend-what-db";
const DB_VERSION = 1;
const USER_STORE = "users";
const BILL_STORE = "bills";
const ITEM_STORE = "bill_items";

// 打开数据库
async function getDB() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(USER_STORE)) {
        db.createObjectStore(USER_STORE, { keyPath: "_id" });
      }
      if (!db.objectStoreNames.contains(BILL_STORE)) {
        db.createObjectStore(BILL_STORE, { keyPath: "_id" });
      }
      if (!db.objectStoreNames.contains(ITEM_STORE)) {
        db.createObjectStore(ITEM_STORE, { keyPath: "_id" });
      }
    },
  });
}

/* ---------------- 用户 ---------------- */
export async function saveUserLocal(user: User) {
  const db = await getDB();
  const data = decycle(user);
  await db.put(USER_STORE, data);
  localStorage.setItem(`user:${user._id}`, JSON.stringify(data));
}

export async function getUserLocal(userId: string): Promise<User | undefined> {
  const cache = localStorage.getItem(`user:${userId}`);
  if (cache) return reviveUser(JSON.parse(cache));

  const db = await getDB();
  const data = await db.get(USER_STORE, userId);
  return data ? reviveUser(data) : undefined;
}

export async function getAllUsersLocal(): Promise<User[]> {
  const db = await getDB();
  const all = await db.getAll(USER_STORE);
  return all.map(reviveUser);
}

export async function deleteUserLocal(userId: string) {
  const db = await getDB();
  if (!db) return;
  await db.delete("users", userId);
}

/* ---------------- 账单 ---------------- */
export async function saveBillLocal(bill: Bill) {
  const db = await getDB();
  const data = decycle(bill);
  await db.put(BILL_STORE, data);
  localStorage.setItem(`bill:${bill._id}`, JSON.stringify(data));
}

export async function getBillLocal(billId: string): Promise<Bill | undefined> {
  const cache = localStorage.getItem(`bill:${billId}`);
  if (cache) return reviveBill(JSON.parse(cache));

  const db = await getDB();
  const data = await db.get(BILL_STORE, billId);
  return data ? reviveBill(data) : undefined;
}

export async function getAllBillsLocal(): Promise<Bill[]> {
  const db = await getDB();
  const all = await db.getAll(BILL_STORE);
  return all.map(reviveBill);
}

export async function deleteBillLocal(billId: string) {
  const db = await getDB();
  if (!db) return;
  await db.delete(BILL_STORE, billId);
}

export async function getBillsByUserId(userId: string) {
  const db = await getDB();
  const allBills = await db.getAll(BILL_STORE);
  return allBills
    .filter((b) => b.ownerId === userId)
    .sort(
      (a, b) =>
        new Date(b.created_time).getTime() - new Date(a.created_time).getTime()
    );
}


/* ---------------- 账单项 ---------------- */
export async function saveBillItemLocal(item: BillItem) {
  const db = await getDB();
  await db.put(ITEM_STORE, item);
}

export async function getBillItemLocal(
  id: string
): Promise<BillItem | undefined> {
  const db = await getDB();
  const data = await db.get(ITEM_STORE, id);
  return data ? reviveBillItem(data) : undefined;
}

export async function getAllBillItemsLocal(): Promise<BillItem[]> {
  const db = await getDB();
  const all = await db.getAll(ITEM_STORE);
  return all.map(reviveBillItem);
}


export async function deleteBillItemLocal(billId: string) {
  const db = await getDB();
  if (!db) return;
  await db.delete(ITEM_STORE, billId);
}

/* ---------------- 类实例恢复 ---------------- */
function reviveUser(data: any): User {
  const u = Object.assign(new User(data.username), data);
  if (u.bills) u.bills = u.bills.map(reviveBill);
  if (u.created_bills) u.created_bills = u.created_bills.map(reviveBill);
  return u;
}

function reviveBill(data: any): Bill {
  const b = Object.assign(
    new Bill(
      data.title,
      data.owner,
      data.members || [],
      data.items || [],
      data.created_time,
      data.item_updated_time
    ),
    data
  );
  b.items = b.items.map(reviveBillItem);
  return b;
}

function reviveBillItem(data: any): BillItem {
  return Object.assign(
    new BillItem(
      data._id,
      data.bill,
      data.type,
      data.type_icon,
      data.description,
      data.amount,
      data.currency,
      data.created_time,
      data.occurred_time
    ),
    data
  );
}
