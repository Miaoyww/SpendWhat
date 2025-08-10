import { BillItem } from "$lib/models/bill/bill-item";
import { User } from "$lib/models/user";
import api from "$lib/utils/request";
import { showAlert } from "$lib/stores/alert-dialog-store";
import axios from "axios";

export class Bill {
  id?: string;
  title: string;
  owner: User;
  members: User[];
  items: BillItem[]; // 可以换成 Member[] 如果成员有更多信息
  created_time: Date;
  item_updated_time: Date;

  constructor(
    title: string,
    owner: User,
    members: User[],
    items: BillItem[],
    created_time: string,
    item_updated_time: string
  ) {
    this.title = title;
    this.owner = owner;
    this.members = members;
    this.items = items;
    this.created_time = new Date(created_time);
    this.item_updated_time = new Date(item_updated_time);
  }

  async uploadToServer() {
    try {
      let data = {
        title: this.title,
      };

      const response = await api.post("/bill/create", data);
      console.log("上传账单成功:", response.data);
      this.id = response.data.bill_id;
    } catch (error) {
      showAlert("错误", "上传账单失败.");
      console.error("上传账单失败:", error);
    }
  }

  addItem(newItem: BillItem) {
    this.items.push(newItem);
    this.updateItemTime();
  }

  // 删除账单项
  removeItem(itemId: string) {
    this.items = this.items.filter((item) => item.id !== itemId);
    this.updateItemTime();
  }

  // 更新账单项
  updateItem(updatedItem: BillItem) {
    const index = this.items.findIndex((item) => item.id === updatedItem.id);
    if (index !== -1) {
      this.items[index] = updatedItem;
      this.updateItemTime();
    }
  }

  // 根据ID获取账单项
  getItemById(itemId: string): BillItem | undefined {
    return this.items.find((item) => item.id === itemId);
  }

  // 添加新成员
  addNewMember(user: User) {
    this.members.push(user);
  }

  // 更新账单项更新时间
  private updateItemTime() {
    this.item_updated_time = new Date();
  }
}

export interface BillResponseItem {
  _id: string;
  title: string;
  members: any[]; // 后端原始数据中是空数组，假设这里是 User 的简化数据
  created_time: string;
  item_updated_time: string;
}

export function mapResponseToBills(
  responseData: BillResponseItem[],
  currentUser: User
): Bill[] {
  return responseData.map((item) => {
    // 这里假设成员为空或者可以进一步处理 members 数据
    const members: User[] = item.members.map((m) => new User(m.name)); // 你需要根据实际成员数据结构改

    // items 默认为空数组，因为后端没给
    const items: BillItem[] = [];

    const bill = new Bill(
      item.title,
      currentUser, // 假设当前用户为 owner，或者后端有owner字段时用它
      members,
      items,
      item.created_time,
      item.item_updated_time
    );
    bill.id = item._id; // 赋值数据库id
    return bill;
  });
}
