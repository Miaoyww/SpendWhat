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

  constructor(name: string, bill: Bill) {
    this.name = name;
    this.bill = bill;
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

    api
      .post("/bill/member/add", data)
      .then((res) => {
        this.id = res.data._id;
      })
      .catch((error) => {
        showAlert("错误", error.message || "网络错误");
      });
  }

  // 是否已绑定
  get isBound(): boolean {
    return !!this.user;
  }
}
