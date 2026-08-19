import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Import useNavigate
import { freelancerService } from '~/services/freelancerService';
import styles from './Freelancers.module.scss';

const DEFAULT_AVATAR = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';

export function Freelancers() {
  const [freelancers, setFreelancers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate(); // 2. Khởi tạo hook navigate

  useEffect(() => {
    fetchFreelancers();
  }, []);

  const fetchFreelancers = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await freelancerService.getAllProfiles();
      const data = res.data?.data || res.data || [];
      setFreelancers(data);
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

  // 3. Hàm chuyển hướng sang trang chi tiết
  const handleViewProfile = (id) => {
    navigate(`/freelancer/${id}`);
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

                return (
                  <article key={profile.id} className={styles.freelancerCard}>
                    <div className={styles.cardHeader}>
                      <img className={styles.avatar} src={avatar} alt={name} />
                      <div className={styles.info}>
                        <div className={styles.titleRow}>
                          <div>
                            <h3>{name}</h3>
                            <p className={styles.role}>{profile.title || 'Freelancer'}</p>
                          </div>
                          <button className={styles.favBtn} aria-label="Lưu freelancer">
                            <i className="bi bi-heart"></i>
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

                    {/* 4. Thêm sự kiện chuyển hướng onClick */}
                    <div className={styles.cardActions}>
                      <button className={styles.btnContact}>Liên hệ</button>
                      <button 
                        className={styles.btnProfile} 
                        onClick={() => handleViewProfile(profile.id)}
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