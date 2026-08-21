import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import config from '~/config';
import { useAuth } from '~/context/AuthContext';
import { chatService } from '~/services';
import styles from './Header.module.scss';

function Header() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [unreadMessageCount, setUnreadMessageCount] = useState(0);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (!user) {
      setUnreadMessageCount(0);
      return undefined;
    }

    let cancelled = false;

    const loadUnreadMessages = async () => {
      try {
        const response = await chatService.getMyConversations();
        const conversations = response?.data?.data || response?.data || [];
        const totalUnread = Array.isArray(conversations)
          ? conversations.reduce((total, conversation) => total + (Number(conversation.unreadCount) || 0), 0)
          : 0;

        if (!cancelled) setUnreadMessageCount(totalUnread);
      } catch (error) {
        if (!cancelled) console.warn('Không thể tải số tin nhắn chưa đọc:', error);
      }
    };

    loadUnreadMessages();
    const intervalId = window.setInterval(loadUnreadMessages, 3000);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, [user]);

  // Đóng Dropdown khi click ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    navigate(config.routes?.login || '/login');
  };

  const userRole = (user?.roleType || user?.role || '').toUpperCase();

  const getDashboardLink = () => {
    if (userRole === 'FREELANCER') return config.routes?.manage_freelancer || '/manage-freelancers';
    if (userRole === 'CLIENT') return config.routes?.manage_jobs || '/manage-jobs';
    if (userRole === 'ADMIN') return '/admin/dashboard';
    return '/';
  };

  const getDashboardLabel = () => {
    if (userRole === 'FREELANCER') return 'Quản lý hồ sơ';
    if (userRole === 'CLIENT') return 'Quản lý công việc';
    if (userRole === 'ADMIN') return 'Trang quản trị (Admin)';
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
            <button className={styles.iconBtn} title="Thông báo">
              <i className="bi bi-bell"></i>
            </button>

            <button
              className={styles.iconBtn}
              title="Tin nhắn"
              onClick={() => navigate(config.routes.messages)}
            >
              <i className="bi bi-chat-dots"></i>
              {unreadMessageCount > 0 && (
                <span className={styles.unreadMessageBadge} aria-label={`${unreadMessageCount} tin nhắn chưa đọc`}>
                  {unreadMessageCount > 99 ? '99+' : unreadMessageCount}
                </span>
              )}
            </button>

            {/* Avatar & Dropdown */}
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

              {showDropdown && (
                <div className={styles.dropdownMenu}>
                  <div className={styles.userInfoHeader}>
                    <p className={styles.userName}>
                      {user.firstName && user.lastName 
                        ? `${user.firstName} ${user.lastName}` 
                        : user.username || user.email}
                    </p>
                    <span className={styles.userRoleTag}>
                      {userRole}
                    </span>
                  </div>

                  <div className={styles.divider} />

                  {/* Dashboard link */}
                  <Link 
                    to={getDashboardLink()} 
                    className={styles.dropdownItem}
                    onClick={() => setShowDropdown(false)}
                  >
                    <i className="bi bi-speedometer2 me-2"></i>
                    {getDashboardLabel()}
                  </Link>

                  {/* Hiển thị link yêu thích tương ứng với Role */}
                  {userRole === 'FREELANCER' && (
                    <>
                      <Link
                        to={config.routes.favorite_jobs}
                        className={styles.dropdownItem}
                        onClick={() => setShowDropdown(false)}
                      >
                        <i className="bi bi-heart me-2 text-danger"></i>
                        Công việc đã lưu
                      </Link>
                      <Link
                        to={config.routes.freelancer_roadmaps}
                        className={styles.dropdownItem}
                        onClick={() => setShowDropdown(false)}
                      >
                        <i className="bi bi-map me-2 text-primary"></i>
                        Lộ trình học tập
                      </Link>
                      <Link
                        to={config.routes.freelancer_invitations}
                        className={styles.dropdownItem}
                        onClick={() => setShowDropdown(false)}
                      >
                        <i className="bi bi-envelope-paper me-2 text-success"></i>
                        Lời mời hợp tác
                      </Link>
                    </>
                  )}

                  {userRole === 'CLIENT' && (
                    <>
                      <Link
                        to={config.routes.favorite_freelancers}
                        className={styles.dropdownItem}
                        onClick={() => setShowDropdown(false)}
                      >
                        <i className="bi bi-bookmark-star me-2 text-warning"></i>
                        Freelancer đã lưu
                      </Link>
                      <Link
                        to={config.routes.client_invitations}
                        className={styles.dropdownItem}
                        onClick={() => setShowDropdown(false)}
                      >
                        <i className="bi bi-send-check me-2 text-success"></i>
                        Lời mời đã gửi
                      </Link>
                    </>
                  )}

                  <div className={styles.divider} />

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