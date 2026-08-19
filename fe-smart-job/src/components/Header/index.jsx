import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import config from '~/config';
import { useAuth } from '~/context/AuthContext'; // 1. Import useAuth
import styles from './Header.module.scss';

function Header() {
  const navigate = useNavigate();
  const { user, logout } = useAuth(); // 2. Lấy state user và hàm logout từ AuthContext
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Bắt sự kiện click ra bên ngoài để đóng Dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Xử lý đăng xuất
  const handleLogout = () => {
    logout(); // 3. Gọi logout từ Context
    setShowDropdown(false);
    navigate(config.routes?.login || '/login');
  };

  // Xác định đường dẫn Dashboard tương ứng với Role
  const getDashboardLink = () => {
    const role = (user?.roleType || user?.role || '').toUpperCase();
    if (role === 'FREELANCER') return config.routes?.freelancer_dashboard || '/freelancer/dashboard';
    if (role === 'CLIENT') return config.routes?.client_dashboard || '/client/dashboard';
    if (role === 'ADMIN') return config.routes?.admin_dashboard || '/admin/dashboard';
    return '/';
  };

  // Xác định nhãn hiển thị trong Dropdown tương ứng với Role
  const getDashboardLabel = () => {
    const role = (user?.roleType || user?.role || '').toUpperCase();
    if (role === 'FREELANCER') return 'Cập nhật thông tin & Dashboard';
    if (role === 'CLIENT') return 'Tạo công việc & Dashboard';
    if (role === 'ADMIN') return 'Trang quản trị (Admin)';
    return 'Trang cá nhân';
  };

  return (
    <nav className={styles.header}>
      {/* Left Section */}
      <div className={styles.leftSection}>
        <Link to={config.routes.home} className={styles.brand}>
          SMART JOB
        </Link>
        <div className={styles.navigation}>
          <Link to={config.routes.jobs} className={styles.navLink}>Việc làm</Link>
          <Link to={config.routes.freelancers} className={styles.navLink}>Tìm Freelancer</Link>
          <Link to={config.routes.explore} className={styles.navLink}>Khám phá</Link>
          <Link to={config.routes.about} className={styles.navLink}>Về Smart Job</Link>
        </div>
      </div>

      {/* Right Section */}
      <div className={styles.rightSection}>
        {user ? (
          <div className={styles.userActions}>
            {/* Icon Thông báo */}
            <button className={styles.iconBtn} title="Thông báo">
              <i className="bi bi-bell"></i>
            </button>

            {/* Icon Tin nhắn/Chat */}
            <button className={styles.iconBtn} title="Tin nhắn">
              <i className="bi bi-chat-dots"></i>
            </button>

            {/* Avatar & Dropdown Menu */}
            <div className={styles.avatarWrapper} ref={dropdownRef}>
              <button 
                className={styles.avatarBtn} 
                onClick={() => setShowDropdown((prev) => !prev)}
              >
                {user.avatar ? (
                  <img src={user.avatar} alt="Avatar" className={styles.avatarImg} />
                ) : (
                  <div className={styles.defaultAvatar}>
                    <i className="bi bi-person-fill"></i>
                  </div>
                )}
              </button>

              {/* Menu xổ xuống */}
              {showDropdown && (
                <div className={styles.dropdownMenu}>
                  <div className={styles.userInfoHeader}>
                    <p className={styles.userName}>
                      {user.firstName && user.lastName 
                        ? `${user.firstName} ${user.lastName}` 
                        : user.username || user.email}
                    </p>
                    <span className={styles.userRoleTag}>
                      {user.roleType || user.role}
                    </span>
                  </div>

                  <div className={styles.divider} />

                  <Link 
                    to={getDashboardLink()} 
                    className={styles.dropdownItem}
                    onClick={() => setShowDropdown(false)}
                  >
                    <i className="bi bi-speedometer2 me-2"></i>
                    {getDashboardLabel()}
                  </Link>

                  <button 
                    className={`${styles.dropdownItem} ${styles.logoutBtn}`}
                    onClick={handleLogout}
                  >
                    <i className="bi bi-box-arrow-right me-2"></i>
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <>
            <Link to={config.routes.login}>
              <button className={styles.btnLogin}>Đăng nhập</button>
            </Link>
            <Link to={config.routes.register}>
              <button className={styles.btnRegister}>Đăng ký</button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Header;