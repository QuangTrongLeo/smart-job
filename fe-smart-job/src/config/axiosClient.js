import axios from 'axios';

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

const axiosClient = axios.create({
  baseURL: 'http://localhost:8080/smart-job/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor Request: Tự động gắn Bearer Token
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

// Interceptor Response
axiosClient.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = getCookie('refreshToken');
        if (!refreshToken) throw new Error('Chưa có Refresh Token');

        const res = await axios.post('http://localhost:8080/smart-job/api/auth/refresh-token', {
          refreshToken,
        });

        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = res.data.data;

        setCookie('accessToken', newAccessToken, 1);
        if (newRefreshToken) setCookie('refreshToken', newRefreshToken, 7);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosClient(originalRequest);
      } catch (refreshError) {
        removeCookie('accessToken');
        removeCookie('refreshToken');
        removeCookie('userInfo');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // Giữ nguyên object error để FE kiểm tra status (403, 400, 500)
    return Promise.reject(error);
  }
);

export default axiosClient;