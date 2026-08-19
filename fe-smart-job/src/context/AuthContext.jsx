import { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { getCookie, setCookie, removeCookie } from '~/utils/cookie';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Định nghĩa hàm Logout
  const logout = () => {
    removeCookie('accessToken');
    removeCookie('refreshToken');
    removeCookie('userInfo');
    setUser(null);
  };

  // 2. Khởi tạo trạng thái đăng nhập từ Cookie khi Refresh trang
  useEffect(() => {
    const token = getCookie('accessToken');
    const userInfoCookie = getCookie('userInfo');

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        let parsedUser = {};
        
        if (userInfoCookie) {
          parsedUser = JSON.parse(userInfoCookie);
        }

        setUser({
          ...parsedUser,
          role: parsedUser.role || decodedToken.role,
        });
      } catch (error) {
        console.error('Lỗi decode token:', error);
        logout();
      }
    }
    setLoading(false);
  }, []);

  // 3. Định nghĩa hàm Login
  const login = (authData) => {
    const { accessToken, refreshToken, user: userInfo } = authData;

    let role = userInfo?.role;
    
    if (!role && accessToken) {
      try {
        const decoded = jwtDecode(accessToken);
        role = decoded.role;
      } catch (err) {
        console.error('Không thể lấy role từ token:', err);
      }
    }

    const fullUserInfo = {
      ...userInfo,
      role: role
    };

    if (accessToken) setCookie('accessToken', accessToken, 7);
    if (refreshToken) setCookie('refreshToken', refreshToken, 7);
    setCookie('userInfo', JSON.stringify(fullUserInfo), 7);

    setUser(fullUserInfo);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);