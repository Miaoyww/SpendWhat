import type { User } from "$lib/models/user";


export class BillMember {
  name: string;
  id: string;
  user?: User; // 绑定后才有

  constructor(name: string, userOrId: User | string) {
    this.name = name;
    if (typeof userOrId === "string") {
      this.id = userOrId;
    } else {
      this.user = userOrId;
      this.id = userOrId.id;
    }
  }

  // 绑定真正的 User 对象
  bindUser(user: User) {
    this.user = user;
    this.name = user.username;
    this.id = user.id;
  }

  // 是否已绑定
  get isBound(): boolean {
    return !!this.user;
  }
}
