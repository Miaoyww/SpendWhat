import type { User } from "$lib/models/user";
import { BillRole } from "$lib/enum/roles";
import type { Bill } from "./bill";
import api from "$lib/utils/request";
import { showAlert } from "$lib/stores/alert-dialog-store";

export class BillMember {
  name: string;
  bill: Bill;
  id?: string;
  user?: User; // 绑定后才有
  role?: BillRole;

  constructor(name: string, bill: Bill, id?: string) {
    this.name = name;
    this.bill = bill;
    this.id = id;
  }

  // 绑定真正的 User 对象
  bindUser(user: User) {
    this.user = user;
  }

  setRole(role: BillRole) {
    this.role = role;
  }

  async createToServer() {
    let data = {
      bill_id: this.bill.id,
      name: this.name,
    };

    await api
      .post("/bill/member/add", data)
      .then((res) => {
        this.id = res.data._id;
      })
      .catch((error) => {
        showAlert("错误", error.message || "网络错误");
      });
  }
  async bindUserToServer(){
    if (!this.user) {
      showAlert("错误", "用户未绑定.");
      return;
    }

    let data = {
      bill_id: this.bill.id,
      bill_member_id: this.id,
      user_id: this.user.id,
    };

    await api
      .post("/bill/member/bind", data)
      .catch((error) => {
        showAlert("错误", error.message || "网络错误");
      });
  }
  // 是否已绑定
  get isBound(): boolean {
    return !!this.user;
  }
}
