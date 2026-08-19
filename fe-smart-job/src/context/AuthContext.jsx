// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCookie, setCookie, removeCookie } from '~/utils/cookie';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Đọc thông tin user từ Cookie khi mới vào ứng dụng
  useEffect(() => {
    const userInfoCookie = getCookie('userInfo');
    if (userInfoCookie) {
      try {
        setUser(JSON.parse(userInfoCookie));
      } catch (error) {
        console.error('Lỗi parse userInfo cookie:', error);
      }
    }
  }, []);

  // Hàm Đăng nhập: Cập nhật Cookie + Cập nhật State user ngay lập tức
  const login = (authData) => {
    const { accessToken, refreshToken, user } = authData;
    setCookie('accessToken', accessToken, 1);
    setCookie('refreshToken', refreshToken, 7);
    setCookie('userInfo', JSON.stringify(user), 7);
    setUser(user); // Kích hoạt re-render trên toàn hệ thống
  };

  // Hàm Đăng xuất: Xóa Cookie + Reset State user
  const logout = () => {
    removeCookie('accessToken');
    removeCookie('refreshToken');
    removeCookie('userInfo');
    setUser(null); // Kích hoạt re-render trên toàn hệ thống
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);