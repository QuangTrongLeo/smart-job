import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { freelancerService } from '~/services/freelancerService';
import { favoriteService } from '~/services/favoriteService'; // Import thêm favoriteService
import styles from './Freelancers.module.scss';

const DEFAULT_AVATAR = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';

export function Freelancers() {
  const [freelancers, setFreelancers] = useState([]);
  const [favoriteProfileIds, setFavoriteProfileIds] = useState(new Set()); // Lưu danh sách Freelancer Profile ID đã yêu thích
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchFreelancers();
  }, []);

  const fetchFreelancers = async () => {
    try {
      setLoading(true);
      setError(null);

      // 1. Tải danh sách tất cả Freelancers
      const res = await freelancerService.getAllProfiles();
      const data = res.data?.data || res.data || [];
      setFreelancers(data);

      // 2. Tải danh sách yêu thích của Client để kiểm tra trạng thái ban đầu
      try {
        const favRes = await favoriteService.getMyFavoriteFreelancers();
        const favList = favRes?.data?.data || favRes?.data || [];
        if (Array.isArray(favList)) {
          const favIds = new Set(favList.map((item) => item.freelancer?.id).filter(Boolean));
          setFavoriteProfileIds(favIds);
        }
      } catch (favErr) {
        console.warn('Không thể tải danh sách yêu thích (người dùng chưa đăng nhập hoặc không có quyền Client):', favErr);
      }
    } catch (err) {
      console.error('Lỗi khi tải danh sách freelancer:', err);
      setError('Không thể kết nối đến máy chủ. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const getFullName = (user) => {
    if (!user) return 'Chưa cập nhật';
    const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim();
    return fullName || user.username || user.email;
  };

  // Chuyển hướng sang trang chi tiết Freelancer
  const handleViewProfile = (id) => {
    if (id) {
      navigate(`/freelancer/${id}`);
    }
  };

  // Xử lý Toggle Lưu / Bỏ lưu Freelancer theo profile.id
  const handleToggleFavorite = async (e, profileId) => {
    e.stopPropagation(); // Ngăn chặn sự kiện click làm chuyển trang
    if (!profileId) return;

    const isCurrentlySaved = favoriteProfileIds.has(profileId);

    // Optimistic Update: Cập nhật giao diện ngay lập tức
    setFavoriteProfileIds((prev) => {
      const next = new Set(prev);
      if (isCurrentlySaved) {
        next.delete(profileId);
      } else {
        next.add(profileId);
      }
      return next;
    });

    try {
      await favoriteService.toggleFavoriteFreelancer(profileId);
    } catch (err) {
      console.error('Lỗi khi thực hiện toggle favorite:', err);
      // Revert lại trạng thái cũ nếu API gặp lỗi
      setFavoriteProfileIds((prev) => {
        const next = new Set(prev);
        if (isCurrentlySaved) {
          next.add(profileId);
        } else {
          next.delete(profileId);
        }
        return next;
      });
    }
  };

  return (
    <div className={styles.freelancersContainer}>
      <div className={styles.headerSection}>
        <h1>Tìm kiếm Freelancer</h1>
        <p>Khám phá và kết nối với hàng ngàn chuyên gia tự do tài năng để hoàn thành dự án của bạn một cách xuất sắc nhất.</p>
      </div>

      <div className={styles.contentGrid}>
        {/* Sidebar Filters */}
        <aside className={styles.sidebar}>
          <div className={styles.filterCard}>
            <div className={styles.filterHeader}>
              <h2>Bộ lọc</h2>
              <button>Xóa bộ lọc</button>
            </div>
            <div className={styles.filterGroup}>
              <h3>Kỹ năng</h3>
              <div className={styles.optionsList}>
                <label><input type="checkbox" /> Lập trình</label>
                <label><input type="checkbox" defaultChecked /> Thiết kế</label>
                <label><input type="checkbox" /> Marketing</label>
                <label><input type="checkbox" /> Viết lách &amp; Dịch thuật</label>
              </div>
            </div>
          </div>
        </aside>

        {/* Results Section */}
        <section className={styles.resultsSection}>
          <div className={styles.toolbar}>
            <span>
              Hiển thị <strong>{freelancers.length}</strong> Freelancer phù hợp
            </span>
          </div>

          {loading && <div className={styles.loadingState}>Đang tải dữ liệu...</div>}

          {error && !loading && (
            <div className={styles.errorState}>
              <p>{error}</p>
              <button onClick={fetchFreelancers}>Thử lại</button>
            </div>
          )}

          {!loading && !error && (
            <div className={styles.bentoGrid}>
              {freelancers.map((profile) => {
                const user = profile.user || {};
                const name = getFullName(user);
                const avatar = user.avatarUrl || DEFAULT_AVATAR;
                const isSaved = favoriteProfileIds.has(profile.id);

                return (
                  <article 
                    key={profile.id} 
                    className={styles.freelancerCard}
                    onClick={() => handleViewProfile(profile.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className={styles.cardHeader}>
                      <img className={styles.avatar} src={avatar} alt={name} />
                      <div className={styles.info}>
                        <div className={styles.titleRow}>
                          <div>
                            <h3>{name}</h3>
                            <p className={styles.role}>{profile.title || 'Freelancer'}</p>
                          </div>
                          
                          {/* Nút Toggle Yêu thích */}
                          <button 
                            className={`${styles.favBtn} ${isSaved ? styles.favActive : ''}`} 
                            aria-label="Lưu freelancer"
                            onClick={(e) => handleToggleFavorite(e, profile.id)}
                            title={isSaved ? 'Bỏ lưu Freelancer' : 'Lưu Freelancer'}
                          >
                            <i className={`bi ${isSaved ? 'bi-heart-fill' : 'bi-heart'}`}></i>
                          </button>
                        </div>
                        <div className={styles.ratingRow}>
                          <i className={`bi bi-star-fill ${styles.starIcon}`}></i>
                          <span>{profile.rating ? profile.rating.toFixed(1) : '5.0'}</span>
                          <span>•</span>
                          <span>{profile.address || 'Chưa cập nhật vị trí'}</span>
                        </div>
                      </div>
                    </div>

                    <p className={styles.bio}>{profile.bio || 'Chưa có mô tả bản thân.'}</p>

                    <div className={styles.skills}>
                      {profile.skills?.map((skill, index) => (
                        <span key={index} className={styles.skillTag}>{skill}</span>
                      ))}
                    </div>

                    <div className={styles.metrics}>
                      <div className={styles.price}>
                        <span>Giá tham khảo</span>
                        <span>{profile.hourlyRate ? `$${profile.hourlyRate}/giờ` : 'Thỏa thuận'}</span>
                      </div>
                      <div className={styles.stats}>
                        <div>
                          <span>Đánh giá</span>
                          <span>{profile.reviewCount ?? 0}</span>
                        </div>
                        <div>
                          <span>Thành công</span>
                          <span className={styles.successRate}>{profile.completionRate ? `${profile.completionRate}%` : '100%'}</span>
                        </div>
                      </div>
                    </div>

                    <div className={styles.cardActions}>
                      <button 
                        className={styles.btnContact}
                        onClick={(e) => {
                          e.stopPropagation();
                          alert(`Liên hệ với ${name}`);
                        }}
                      >
                        Liên hệ
                      </button>
                      <button 
                        className={styles.btnProfile} 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewProfile(profile.id);
                        }}
                      >
                        Xem hồ sơ
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default Freelancers;