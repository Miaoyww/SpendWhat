import axios from "axios";
import { writable } from "svelte/store";
import { showAlert } from "./alert-dialog-store";

const API_URL = "http://localhost:3000/api/user/";

export let isLoggedIn = false;

export function login(userName: string, password: string): Promise<boolean> {
  const data = {
    username: userName,
    password: password,
  };

  return axios
    .post(API_URL + "login", data)
    .then((response) => {
      isLoggedIn = true;
      let session = response.data.cookie.session;
      // 将session存储到cookie
      document.cookie = `session=${session}; path=/`;
      return true;
    })
    .catch((error) => {
      console.error("登录时出错:", error);
      return false;
    });
}

export function register(userName: string, password: string): Promise<boolean> {
  const data = {
    username: userName,
    password: password,
  };

  return axios
    .post(API_URL + "register", data)
    .then((response) => {
      isLoggedIn = true;
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

export function logout() {
  // 清除cookie后返回true
  document.cookie = "session=; path=/";
  isLoggedIn = false;
  return true;
}
