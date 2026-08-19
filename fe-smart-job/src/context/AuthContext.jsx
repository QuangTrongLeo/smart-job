// src/context/AuthContext.jsx
import React, { createContext, useContext, useState } from 'react';
import { getCookie, setCookie, removeCookie } from '~/utils/cookie';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Đọc cookie ngay khi khởi tạo state
  const [user, setUser] = useState(() => {
    const userInfoCookie = getCookie('userInfo');
    if (userInfoCookie) {
      try {
        return JSON.parse(userInfoCookie);
      } catch (error) {
        console.error('Lỗi parse userInfo cookie:', error);
      }
    }
    return null;
  });

  const login = (authData) => {
    const { accessToken, refreshToken, user } = authData;
    setCookie('accessToken', accessToken, 1);
    setCookie('refreshToken', refreshToken, 7);
    setCookie('userInfo', JSON.stringify(user), 7);
    setUser(user);
  };

  const logout = () => {
    removeCookie('accessToken');
    removeCookie('refreshToken');
    removeCookie('userInfo');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);