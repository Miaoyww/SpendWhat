import type { User } from "$lib/models/user";
import { showAlert } from "$lib/stores/alert-dialog-store";
import api from "$lib/utils/request";
import { Bill } from "./bill";
import type { BillMember } from "./bill-member";

export class BillItem {
  id?: string;
  uiId: string;
  bill: Bill;
  type: string;
  type_icon: string;
  description: string;
  amount: number;
  currency: string;
  created_time: Date;
  occurred_time: Date;
  created_by: BillMember;

  constructor(
    bill: Bill,
    type: string,
    type_icon: string,
    description: string,
    amount: number,
    currency: string,
    created_by: BillMember,
    created_time: Date,
    occurred_time: Date
  ) {
    this.created_by = created_by;
    this.bill = bill;
    this.type = type;
    this.type_icon = type_icon;
    this.description = description;
    this.amount = amount;
    this.currency = currency;
    this.created_time = new Date(created_time);
    this.occurred_time = new Date(occurred_time);
    this.uiId = crypto.randomUUID();
  }

  async createToServer() {
    try {
      let data = {
        bill_id: this.bill.id,
        type: this.type,
        type_icon: this.type_icon,
        description: this.description,
        amount: String(this.amount),
        currency: this.currency,
        occurred_time: this.occurred_time.toISOString(),
        paid_by: this.created_by.id,
      };

      const response = await api.post("/bill/item/create", data);
      this.id = response.data.bill_item_id;
    } catch (error) {
      showAlert("错误", `账单创建失败. ${error}`);
      console.error("账单创建失败:", error);
    }
  }

  async updateToServer() {
    let data = {
      bill_id: this.bill.id,
      item_id: this.id,
      type: this.type,
      type_icon: this.type_icon,
      description: this.description,
      amount: String(this.amount),
      currency: this.currency,
      occurred_time: this.occurred_time.toLocaleString("sv-SE"),
      paid_by: this.created_by.id,
    };
    console.log("更新账单项数据:", data);
    await api.post("/bill/item/update", data).catch((error) => {
      showAlert("错误", "账单项更新失败.");
      console.error("账单项更新失败:", error);
    });
  }


  // 不要从Bill.removeItem外调用
  async remove() {
    let data = {
      bill_id: this.bill.id,
      item_id: this.id,
    };

    await api.post("/bill/item/delete", data).then((response) => {
      if (response.status !== 200) {
        showAlert("错误", `账单项未能正确删除. ${response.status}`);
        return false;
      }
    return true;
    }).catch((error) => {
      showAlert("错误", `账单项未能正确删除. ${error}`);
      return false;
    });
  }
}
