import { BillItem } from "$lib/models/bill/bill-item";
import { User } from "$lib/models/user";
import api from "$lib/request/api";
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

  //上传到服务器
  // async uploadToServer() {
  //   try {
  //     let data = {
  //       title: this.title,
  //       owner: this.owner,
  //       members: this.members,
  //       items: this.items,
  //       created_time: this.created_time,
  //       item_updated_time: this.item_updated_time
  //     }
  //     const response = await api.post("/api/bills", data);
  //     this._id = response.data._id;
  //   } catch (error) {
  //     showAlert("错误", "上传账单失败.");
  //     console.error("上传账单失败:", error);
  //   }
  // }
  //本地测试用uploadToServer()
  async uploadToServer() {
    try {
      let data = {
        title: this.title,
        owner: this.owner,
        members: this.members,
        items: this.items,
        created_time: this.created_time,
        item_updated_time: this.item_updated_time
      }
      //随机生成uuid
      this.id = crypto.randomUUID();
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
  addNewMember(user: User){
    this.members.push(user);
  }

  // 更新账单项更新时间
  private updateItemTime() {
    this.item_updated_time = new Date();
  }
}
