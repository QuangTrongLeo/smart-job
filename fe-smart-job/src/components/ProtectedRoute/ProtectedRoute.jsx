import { Navigate } from 'react-router-dom';
import { useAuth } from '~/context/AuthContext'; // Hoặc hook auth của bạn

function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();

  // 1. Chờ khôi phục phiên đăng nhập từ Cookie/Token
  if (loading) {
    return <div>Loading...</div>; 
  }

  // 2. Chưa đăng nhập -> Chuyển về Login hoặc Trang chủ
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 3. Kiểm tra Role
  // Lưu ý: Chuẩn hóa role về chữ hoa để tránh lỗi lệch hoa/thường
  const userRole = user?.role?.toUpperCase(); 
  const hasPermission = allowedRoles.some((role) => role.toUpperCase() === userRole);

  if (!hasPermission) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;