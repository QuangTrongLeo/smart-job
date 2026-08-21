import { NavLink } from 'react-router-dom';
import { useAuth } from '~/context/AuthContext';

function Sidebar() {
  const { user } = useAuth();
  const userRole = (user?.roleType || user?.role || '').toUpperCase();

  return (
    <div className="d-flex flex-column p-3 bg-white h-100">
      <span className="fs-5 fw-semibold mb-3 text-secondary border-bottom pb-2">
        <i className="bi bi-compass me-2"></i>Điều hướng
      </span>
      <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item mb-1">
          <NavLink to="/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : 'text-dark'}`}>
            <i className="bi bi-speedometer2 me-2"></i>Dashboard
          </NavLink>
        </li>
        <li className="nav-item mb-1">
          <NavLink to="/freelancer/my-jobs" className={({ isActive }) => `nav-link ${isActive ? 'active' : 'text-dark'}`}>
            <i className="bi bi-journal-check me-2"></i>Đã ứng tuyển
          </NavLink>
        </li>
        {userRole === 'FREELANCER' && (
          <li className="nav-item mb-1">
            <NavLink to="/freelancer/roadmaps" className={({ isActive }) => `nav-link ${isActive ? 'active' : 'text-dark'}`}>
              <i className="bi bi-map me-2"></i>Lộ trình phát triển
            </NavLink>
          </li>
        )}
        <li className="nav-item mb-1">
          <NavLink to="/client/post-job" className={({ isActive }) => `nav-link ${isActive ? 'active' : 'text-dark'}`}>
            <i className="bi bi-plus-circle me-2"></i>Đăng bài tuyển dụng
          </NavLink>
        </li>
        <li className="nav-item mb-1">
          <NavLink to="/admin/users" className={({ isActive }) => `nav-link ${isActive ? 'active' : 'text-dark'}`}>
            <i className="bi bi-people me-2"></i>Quản lý người dùng
          </NavLink>
        </li>
        <li className="nav-item mb-1">
          <NavLink to="/profile" className={({ isActive }) => `nav-link ${isActive ? 'active' : 'text-dark'}`}>
            <i className="bi bi-person-circle me-2"></i>Hồ sơ cá nhân
          </NavLink>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;