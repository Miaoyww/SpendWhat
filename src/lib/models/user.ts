import type { Bill } from "$lib/models/bill/bill";
import api from "$lib/utils/request";

export class User {
  id?: string;
  username: string;
  created_time?: Date;
  created_bills?: Bill[]; // 创建的账单

  constructor(id: string, username: string) {
    this.username = username;
    this.id = id;
  }
}
