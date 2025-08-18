import { showAlert } from "$lib/stores/alert-dialog-store";
import { currentUser } from "$lib/stores/user-store";

import { NavigateTo } from "$lib/utils/navigating";
import { redirect } from "@sveltejs/kit";
export async function load() {
  if (!currentUser) {
    showAlert("错误", "用户信息获取失败.");
    NavigateTo("/app/user/login");
    return;
  }
  redirect(307, "/app/bill/setup/common");
}
