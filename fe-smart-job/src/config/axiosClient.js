import axios from 'axios';

// Utility làm việc với Cookie
export const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return decodeURIComponent(parts.pop().split(';').shift());
  return null;
};

export const setCookie = (name, value, days = 7) => {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${date.toUTCString()}; path=/; SameSite=Lax`;
};

export const removeCookie = (name) => {
  document.cookie = `${name}=; Max-Age=-99999999; path=/;`;
};

// Khởi tạo Axios Instance
const axiosClient = axios.create({
  baseURL: 'http://localhost:8080/smart-job/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor Request: Tự động lấy accessToken từ Cookie gắn vào Header
axiosClient.interceptors.request.use(
  (config) => {
    const token = getCookie('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor Response: Trả về response.data & Tự động gọi Refresh Token khi dính 401
axiosClient.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;

    // Nếu gặp lỗi 401 Unauthorized và request này chưa từng retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = getCookie('refreshToken');
        if (!refreshToken) {
          throw new Error('Chưa có Refresh Token');
        }

        // Gọi trực tiếp axios instance mới để tránh lặp vô tận interceptor
        const res = await axios.post('http://localhost:8080/smart-job/api/auth/refresh-token', {
          refreshToken,
        });

        // Backend trả về dạng ApiResponse<AuthResponse> => res.data.data
        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = res.data.data;

        // Cập nhật Token mới vào Cookie
        setCookie('accessToken', newAccessToken, 1);
        if (newRefreshToken) {
          setCookie('refreshToken', newRefreshToken, 7);
        }

        // Gắn token mới vào request bị hỏng và gọi lại
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosClient(originalRequest);
      } catch (refreshError) {
        // Refresh token không hợp lệ/hết hạn -> Xóa hết Cookie và chuyển hướng tới /login
        removeCookie('accessToken');
        removeCookie('refreshToken');
        removeCookie('userInfo');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error.response?.data || error.message);
  }
);

export default axiosClient;