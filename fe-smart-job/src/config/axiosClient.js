import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'http://localhost:8080/smart-job/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Tự động gắn Token vào Header khi gọi API
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Xử lý dữ liệu trả về và bắt lỗi chung
axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      // window.location.href = '/login';
    }
    return Promise.reject(error.response?.data || error.message);
  }
);

export default axiosClient;