import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '~/context/AuthContext';

function ProtectedRoute({ allowedRoles, children }) {
  const { user } = useAuth();
  const location = useLocation();

  // 1. Chưa đăng nhập -> Chuyển hướng về Login (lưu lại trang đang muốn vào qua state)
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Chuẩn hóa Role của User (Hỗ trợ đọc từ user.role, user.roleId hoặc user.roleName)
  const currentRole = (user.role || user.roleId || user.roleName || '').toUpperCase();

  // 3. Kiểm tra xem Role của user có nằm trong danh sách cho phép không
  const hasPermission = allowedRoles.some((role) => {
    const upperRole = role.toUpperCase();
    return currentRole === upperRole || currentRole === `ROLE_${upperRole}`;
  });

  // 4. Đã đăng nhập nhưng không đúng Role -> Về trang chủ
  if (!hasPermission) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;