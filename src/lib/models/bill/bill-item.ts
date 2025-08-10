import { Bill } from './bill';


export class BillItem {
  id: string;
  bill: Bill;
  type: string;
  type_icon: string;
  description: string;
  amount: number;
  currency: string;
  created_time: Date;
  occurred_time: Date;

  constructor(
    id: string,
    bill: Bill,
    type: string,
    type_icon: string,
    description: string,
    amount: number,
    currency: string,
    created_time: string,
    occurred_time: string
  ) {
    this.id = id;
    this.bill = bill;
    this.type = type;
    this.type_icon = type_icon;
    this.description = description;
    this.amount = amount;
    this.currency = currency;
    this.created_time = new Date(created_time);
    this.occurred_time = new Date(occurred_time);
  }
}