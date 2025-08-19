import axios from "axios";
import {settings} from "$lib/modules/settings/settings";
import { get } from "svelte/store";

const api = axios.create({
  baseURL: `${get(settings).remoteUrl}/api`,
  timeout: 10000, // 可选：请求超时时间
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    // 其他默认请求头
  },
});

export default api;
