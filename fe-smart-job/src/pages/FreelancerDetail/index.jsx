import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { freelancerService, favoriteService } from '~/services';
import styles from './FreelancerDetail.module.scss';

const DEFAULT_AVATAR = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';

const AVAILABILITY_MAP = {
  AVAILABLE: { text: 'Sẵn sàng nhận việc', colorClass: styles.statusAvailable },
  BUSY: { text: 'Đang bận', colorClass: styles.statusBusy },
  UNAVAILABLE: { text: 'Tạm ngưng nhận việc', colorClass: styles.statusUnavailable },
};

const getFullName = (user) => {
  if (!user) return 'Freelancer';
  const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim();
  return fullName || user.username || user.email || 'Freelancer';
};

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const parsed = new Date(dateStr);
  return Number.isNaN(parsed.getTime())
    ? dateStr
    : parsed.toLocaleDateString('vi-VN', { month: '2-digit', year: 'numeric' });
};

export function FreelancerDetail() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) {
      setError('Mã hồ sơ Freelancer không hợp lệ.');
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');

        // 1. Tải hồ sơ Freelancer
        const profileRes = await freelancerService.getProfileById(id);
        const data = profileRes?.data?.data || profileRes?.data || null;

        if (!data) {
          setError('Không tìm thấy thông tin Freelancer.');
          return;
        }

        setProfile(data);

        // 2. Tải danh sách yêu thích của Client để kiểm tra trạng thái ban đầu
        try {
          const favRes = await favoriteService.getMyFavoriteFreelancers();
          const favList = favRes?.data?.data || favRes?.data || [];

          // So sánh chuẩn theo Freelancer Profile ID hoặc User ID với danh sách đã lưu
          const targetUserId = data.user?.id;
          const targetProfileId = data.id;

          const exists = Array.isArray(favList) && favList.some((item) => {
            const favUserId = item?.freelancer?.user?.id;
            const favProfileId = item?.freelancer?.id;
            return (targetProfileId && favProfileId === targetProfileId) || (targetUserId && favUserId === targetUserId);
          });

          setIsSaved(exists);
        } catch (favErr) {
          // Bỏ qua lỗi nếu user chưa đăng nhập hoặc không có quyền Client
          console.warn('Không thể kiểm tra danh sách yêu thích:', favErr);
        }

      } catch (err) {
        console.error('Lỗi khi tải thông tin Freelancer:', err);
        setError('Không thể tải hồ sơ Freelancer. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Xử lý Toggle Lưu / Bỏ lưu Freelancer
  const handleToggleFavorite = async () => {
    // ƯU TIÊN LẤY FreelancerProfile ID (profile.id) vì Backend gọi profileRepository.existsById
    const targetProfileId = profile?.id || id;
    if (!targetProfileId) return;

    // Optimistic Update: Cập nhật UI ngay lập tức
    const previousState = isSaved;
    setIsSaved(!previousState);

    try {
      const res = await favoriteService.toggleFavoriteFreelancer(targetProfileId);
      const isFavorited = res?.data?.data ?? res?.data;
      
      // Đồng bộ lại chuẩn với trạng thái trả về từ Backend
      if (typeof isFavorited === 'boolean') {
        setIsSaved(isFavorited);
      }
    } catch (err) {
      console.error('Lỗi khi thực hiện toggle favorite:', err);
      // Revert lại trạng thái cũ nếu API gọi lỗi
      setIsSaved(previousState);
    }
  };

  if (loading) {
    return <div className={styles.stateCard}>Đang tải thông tin Freelancer...</div>;
  }

  if (error || !profile) {
    return <div className={`${styles.stateCard} ${styles.errorCard}`}>{error || 'Không tìm thấy hồ sơ'}</div>;
  }

  const {
    user = {},
    isVerified = false,
    title = 'Chưa cập nhật chức danh',
    bio,
    yearsOfExperience = 0,
    availabilityStatus = 'AVAILABLE',
    address,
    hourlyRate,
    availableHours,
    languages = [],
    rating = 0,
    reviewCount = 0,
    completionRate = 0,
    skills = [],
    experiences = [],
    portfolioUrls = [],
    cvUrl,
  } = profile;

  const fullName = getFullName(user);
  const statusInfo = AVAILABILITY_MAP[availabilityStatus] || {
    text: availabilityStatus,
    colorClass: styles.statusAvailable,
  };

  return (
    <div className={styles.pageContainer}>
      {/* Header Profile Section */}
      <section className={styles.headerCard}>
        <div className={styles.mainInfo}>
          <div className={styles.avatarWrapper}>
            <img
              src={user.avatarUrl || DEFAULT_AVATAR}
              alt={fullName}
              className={styles.avatar}
              onError={(e) => { e.currentTarget.src = DEFAULT_AVATAR; }}
            />
            {isVerified && (
              <span className={styles.badgeVerified} title="Đã xác minh tài khoản">
                <i className="bi bi-patch-check-fill"></i>
              </span>
            )}
          </div>

          <div className={styles.userMeta}>
            <div className={styles.nameRow}>
              <h1>{fullName}</h1>
              <span className={`${styles.statusBadge} ${statusInfo.colorClass}`}>
                <span className={styles.dot}></span> {statusInfo.text}
              </span>
            </div>
            
            <p className={styles.jobTitle}>{title}</p>
            
            <div className={styles.quickDetails}>
              {address && (
                <span><i className="bi bi-geo-alt-fill"></i> {address}</span>
              )}
              {user.email && (
                <span><i className="bi bi-envelope-fill"></i> {user.email}</span>
              )}
            </div>
          </div>
        </div>

        {/* Action & Performance Stats */}
        <div className={styles.sideAction}>
          <div className={styles.statsContainer}>
            <div className={styles.statBox}>
              <div className={styles.statValue}>
                <i className={`bi bi-star-fill ${styles.starIcon}`}></i>
                {rating.toFixed(1)}
              </div>
              <div className={styles.statLabel}>{reviewCount} đánh giá</div>
            </div>

            <div className={styles.statDivider}></div>

            <div className={styles.statBox}>
              <div className={styles.statValue}>{completionRate}%</div>
              <div className={styles.statLabel}>Hoàn thành</div>
            </div>

            <div className={styles.statDivider}></div>

            <div className={styles.statBox}>
              <div className={styles.statValue}>{yearsOfExperience} Năm</div>
              <div className={styles.statLabel}>Kinh nghiệm</div>
            </div>
          </div>

          <div className={styles.buttonGroup}>
            <button
              onClick={handleToggleFavorite}
              className={`${styles.btnBookmark} ${isSaved ? styles.active : ''}`}
            >
              <i className={`bi ${isSaved ? 'bi-bookmark-fill' : 'bi-bookmark'}`}></i>
              {isSaved ? 'Đã lưu' : 'Lưu hồ sơ'}
            </button>
            <button
              onClick={() => alert(`Gửi yêu cầu trao đổi tới ${fullName}`)}
              className={styles.btnContact}
            >
              <i className="bi bi-chat-dots-fill"></i> Liên hệ ngay
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <div className={styles.contentLayout}>
        {/* Left Column: Detailed Info */}
        <div className={styles.leftColumn}>
          {/* Bio */}
          <section className={styles.cardSection}>
            <h2>Giới thiệu bản thân</h2>
            <p className={styles.bioText}>
              {bio || 'Freelancer chưa cập nhật đoạn văn giới thiệu bản thân.'}
            </p>
          </section>

          {/* Skills */}
          <section className={styles.cardSection}>
            <h2>Kỹ năng chuyên môn</h2>
            {skills.length > 0 ? (
              <div className={styles.skillsGrid}>
                {skills.map((skill, index) => (
                  <span key={index} className={styles.skillBadge}>{skill}</span>
                ))}
              </div>
            ) : (
              <p className={styles.emptyText}>Chưa có thông tin kỹ năng.</p>
            )}
          </section>

          {/* Work Experiences */}
          <section className={styles.cardSection}>
            <h2>Kinh nghiệm làm việc</h2>
            {experiences.length > 0 ? (
              <div className={styles.timeline}>
                {experiences.map((exp, idx) => (
                  <div key={idx} className={styles.timelineItem}>
                    <div className={styles.timelinePoint}></div>
                    <div className={styles.timelineContent}>
                      <div className={styles.expHeader}>
                        <h3>{exp.title || 'Vị trí công việc'}</h3>
                        <span className={styles.companyName}>@ {exp.company || 'Công ty'}</span>
                      </div>
                      <div className={styles.expTime}>
                        <i className="bi bi-calendar3"></i>
                        {formatDate(exp.startDate)} - {exp.isCurrent ? 'Hiện tại' : formatDate(exp.endDate) || 'Chưa rõ'}
                      </div>
                      {exp.description && (
                        <p className={styles.expDescription}>{exp.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className={styles.emptyText}>Chưa cập nhật lịch sử kinh nghiệm làm việc.</p>
            )}
          </section>

          {/* Portfolio URLs */}
          {portfolioUrls.length > 0 && (
            <section className={styles.cardSection}>
              <h2>Dự án / Portfolio tiêu biểu</h2>
              <div className={styles.portfolioList}>
                {portfolioUrls.map((url, index) => (
                  <a
                    key={index}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.portfolioItem}
                  >
                    <i className="bi bi-link-45deg"></i>
                    <span>{url}</span>
                    <i className={`bi bi-box-arrow-up-right ${styles.externalIcon}`}></i>
                  </a>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Column: Key Details & Actions */}
        <aside className={styles.rightColumn}>
          <div className={styles.cardSection}>
            <h3>Thông tin công việc</h3>
            
            <div className={styles.infoList}>
              <div className={styles.infoRow}>
                <div className={styles.iconBox}><i className="bi bi-currency-dollar"></i></div>
                <div>
                  <span className={styles.label}>Giá dịch vụ</span>
                  <span className={styles.value}>
                    {hourlyRate != null ? `$${hourlyRate} / giờ` : 'Thỏa thuận'}
                  </span>
                </div>
              </div>

              <div className={styles.infoRow}>
                <div className={styles.iconBox}><i className="bi bi-clock-history"></i></div>
                <div>
                  <span className={styles.label}>Thời gian làm việc</span>
                  <span className={styles.value}>{availableHours || 'Chưa cập nhật'}</span>
                </div>
              </div>

              <div className={styles.infoRow}>
                <div className={styles.iconBox}><i className="bi bi-translate"></i></div>
                <div>
                  <span className={styles.label}>Ngôn ngữ</span>
                  <span className={styles.value}>
                    {languages.length > 0 ? languages.join(', ') : 'Chưa cập nhật'}
                  </span>
                </div>
              </div>
            </div>

            {cvUrl && (
              <a
                href={cvUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.btnCvDownload}
              >
                <i className="bi bi-file-earmark-pdf-fill"></i> Xem / Tải CV cá nhân
              </a>
            )}
          </div>

          <div className={`${styles.cardSection} ${styles.hireBox}`}>
            <i className={`bi bi-briefcase-fill ${styles.hireIcon}`}></i>
            <h3>Cần tìm Freelancer dự án?</h3>
            <p>Liên hệ và trao đổi trực tiếp với {fullName} để bắt đầu công việc ngay hôm nay.</p>
            <button 
              onClick={() => alert(`Đã gửi lời mời hợp tác tới ${fullName}`)}
              className={styles.btnHire}
            >
              Gửi lời mời hợp tác
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default FreelancerDetail;