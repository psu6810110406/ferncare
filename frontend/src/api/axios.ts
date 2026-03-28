import axios, { type InternalAxiosRequestConfig } from 'axios';

// ตั้งค่า URL หลักของ Backend
const api = axios.create({
  baseURL: 'http://localhost:3000', 
});

// ดักจับ Request เพื่อแนบ Token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    
    // ต้องเช็ค config.headers ด้วยใน TypeScript เพื่อความปลอดภัย
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;