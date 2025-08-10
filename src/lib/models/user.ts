import type { Bill } from "$lib/models/bill/bill";

export class User {
  id?: string;
  username: string;
  created_time?: Date;
  bills?: Bill[]; // 参与的账单，包括创建的账单
  created_bills?: Bill[]; // 创建的账单

  constructor(username: string) {
    this.username = username;
    this.id = '68984924648b08e5243ffccb';
  }

  addNewOwnBill(bill: Bill) {
    if (!this.created_bills) {
      this.created_bills = [];
    }
    //由ID判断，如果已经存在则不再添加
    if (!this.created_bills.some(b => b.id === bill.id)) {
      this.addNewBill(bill);
      this.created_bills.push(bill);
    } 
  }

  addNewBill(bill: Bill) {
    if (!this.bills) {
      this.bills = [];
    }
    //由ID判断，如果已经存在则不再添加
    if (!this.bills.some(b => b.id === bill.id)) {
      this.bills.push(bill);
    }
  }
}
