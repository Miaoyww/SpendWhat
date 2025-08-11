import axios from "axios";
import { PUBLIC_API_URL, PUBLIC_API_PORT } from '$env/static/public';

const PORT = PUBLIC_API_PORT;
const HOST_URL = PUBLIC_API_URL + (PORT ? `:${PORT}` : ""); // 全局HOST基础路径
const API_URL = `${HOST_URL}/api`; // 全局API基础路径

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000, // 可选：请求超时时间
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    // 其他默认请求头
  },
});

export default api;
export { HOST_URL, API_URL };
