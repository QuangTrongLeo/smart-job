import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { favoriteService } from '~/services';
import styles from './FavoriteFreelancers.module.scss';

function FavoriteFreelancers() {
  const [favoriteFreelancers, setFavoriteFreelancers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFavoriteFreelancers();
  }, []);

  const fetchFavoriteFreelancers = async () => {
    try {
      setLoading(true);
      const res = await favoriteService.getMyFavoriteFreelancers();
      const data = res?.data || res;
      setFavoriteFreelancers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Lỗi khi tải danh sách Freelancer yêu thích:', err);
      setError('Không thể tải danh sách Freelancer đã lưu. Vui lòng thử lại sau!');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async (freelancerUserId) => {
    try {
      await favoriteService.toggleFavoriteFreelancer(freelancerUserId);
      setFavoriteFreelancers((prev) =>
        prev.filter((item) => item.freelancer?.userId !== freelancerUserId)
      );
    } catch (err) {
      console.error('Lỗi khi xóa Freelancer khỏi danh sách yêu thích:', err);
      alert('Có lỗi xảy ra khi thực hiện thao tác!');
    }
  };

  if (loading) {
    return (
      <div className={styles.container} style={{ textAlign: 'center', paddingTop: '48px' }}>
        <div className="spinner-border text-primary" role="status" />
        <p style={{ marginTop: '12px', color: '#64748b', fontSize: '0.875rem' }}>
          Đang tải danh sách Freelancer đã lưu...
        </p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.headerSection}>
        <div>
          <h3 className={styles.title}>
            <i className="bi bi-bookmark-star-fill"></i>
            Freelancer đã lưu
          </h3>
          <p className={styles.subtitle}>
            Danh sách các ứng viên nổi bật bạn đã lưu để liên hệ làm việc.
          </p>
        </div>
        <span className={styles.countBadge}>{favoriteFreelancers.length} Freelancers</span>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && favoriteFreelancers.length === 0 ? (
        <div className={styles.emptyCard}>
          <div className={styles.emptyIcon}>
            <i className="bi bi-people"></i>
          </div>
          <h5>Chưa có Freelancer nào trong danh sách đã lưu</h5>
          <p>Hãy tìm kiếm freelancer phù hợp với dự án của bạn và bấm lưu lại.</p>
          <Link to="/freelancers" className={styles.btnExplore}>
            Tìm Freelancer
          </Link>
        </div>
      ) : (
        <div className={styles.freelancerGrid}>
          {favoriteFreelancers.map((item) => {
            const profile = item.freelancer || {};
            return (
              <div key={item.id || profile.id} className={styles.freelancerCard}>
                <div>
                  <div className={styles.cardTop}>
                    {profile.avatarUrl ? (
                      <img
                        src={profile.avatarUrl}
                        alt={profile.fullName}
                        className={styles.avatarImg}
                      />
                    ) : (
                      <div className={styles.avatarFallback}>
                        {profile.fullName ? profile.fullName.charAt(0).toUpperCase() : 'F'}
                      </div>
                    )}

                    <div className={styles.infoMeta}>
                      <div className={styles.nameRow}>
                        <Link to={`/freelancer/${profile.id}`}>
                          {profile.fullName || 'Chưa cập nhật tên'}
                        </Link>
                        {profile.isVerified && (
                          <i
                            className={`bi bi-patch-check-fill ${styles.verifiedIcon}`}
                            title="Tài khoản đã xác minh"
                          />
                        )}
                      </div>
                      <p className={styles.title}>{profile.title || 'Chưa có chức danh'}</p>
                      {profile.address && (
                        <span className={styles.address}>
                          <i className="bi bi-geo-alt me-1" />
                          {profile.address}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => handleToggleFavorite(profile.userId)}
                      className={styles.btnClose}
                      title="Bỏ lưu Freelancer này"
                    >
                      <i className="bi bi-x-lg" />
                    </button>
                  </div>

                  {profile.bio && <p className={styles.bio}>{profile.bio}</p>}

                  <div className={styles.skillList}>
                    {profile.skills?.slice(0, 5).map((skill, idx) => (
                      <span key={idx} className={styles.skillBadge}>
                        {skill}
                      </span>
                    ))}
                    {profile.skills?.length > 5 && (
                      <span className={styles.skillBadge}>
                        +{profile.skills.length - 5}
                      </span>
                    )}
                  </div>
                </div>

                <div className={styles.cardBottom}>
                  <span className={styles.ratingText}>
                    Đánh giá:{' '}
                    <strong>
                      <i className="bi bi-star-fill me-1" />
                      {profile.rating ? profile.rating.toFixed(1) : '5.0'}
                    </strong>
                    {profile.reviewCount ? ` (${profile.reviewCount})` : ''}
                  </span>
                  <span className={styles.rateText}>
                    {profile.hourlyRate
                      ? `${profile.hourlyRate.toLocaleString()} VNĐ/giờ`
                      : 'Thỏa thuận'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default FavoriteFreelancers;