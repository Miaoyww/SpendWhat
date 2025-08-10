import axios from 'axios';
const API_URL = 'http://localhost:3000/api'; // 全局API基础路径

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,                     // 可选：请求超时时间
  headers: {
    'Content-Type': 'application/json',
    // 其他默认请求头
  }
});

export default api;