import { writable } from "svelte/store";
import { showAlert } from "./alert-dialog-store";
import { User } from "$lib/models/user";
import { billStore, getCurrentUserBillsFromServer } from "./bill-store";
import  Post  from "$lib/utils/request";

export const currentUser = writable<User | null>(null);
export let currentSession = "";

let user: User | null = null;

currentUser.subscribe((value) => {
  user = value;
});

export async function getCurrentUser(): Promise<User | null> {
  return Post("/user/self/get")
    .then(async (response) => {
      let data = await response.json();
      user = new User(data.id, data.username);
      currentUser.set(user);

      if (user && user.id) {
        let bills = await getCurrentUserBillsFromServer();

        billStore.clear();
        billStore.addBillList(bills);
      }
      return user;
    })
    .catch((error) => {
      showAlert("错误", `获取当前用户信息时出错: ${error}`);
      return null;
    });
}

export function loginByCookie(session: string): Promise<User | null> {
  if (!session) {
    return Promise.resolve(null);
  }
  console.log("尝试通过cookie登录");
  currentSession = session;
  return getCurrentUser();
}

export async function loginUser(
  userName: string,
  password: string
): Promise<boolean> {
  const data = {
    username: userName,
    password: password,
  };
  let res = await Post("/user/login", data);
  if (res.status === 200) {
    let session = res.headers
      .get("set-cookie")
      ?.split(";")
      .find((c) => c.trim().startsWith("session="))
      ?.split("=")[1];
    document.cookie = `session=${session}; path=/`;

    let user = await getCurrentUser();
    if (!user) {
      showAlert("错误", "获取用户信息失败，请稍后再试");
      return false;
    }
    currentUser.set(user);
    return true;
  }
  return true;
}

export function registerUser(
  userName: string,
  password: string
): Promise<boolean> {
  const data = {
    username: userName,
    password: password,
  };

  return Post("/user/register", data)
    .then((response) => {
      return true;
    })
    .catch((error) => {
      if (error.response && error.response.status === 400) {
        showAlert("错误", "用户名已存在, 请重新输入");
      } else {
        showAlert("错误", "注册失败，请稍后再试");
      }
      console.error("注册时出错:", error);
      return false;
    });
}

export function logoutUser() {
  // 清除cookie后返回true
  document.cookie = "session=; path=/";
  console.log("用户已登出");
  currentUser.set(null);
  billStore.clear();
  user = null;
  return true;
}
