import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { favoriteService } from '~/services';
import styles from './FavoriteJobs.module.scss';

function FavoriteJobs() {
  const [favoriteJobs, setFavoriteJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFavoriteJobs();
  }, []);

  const fetchFavoriteJobs = async () => {
    try {
      setLoading(true);
      const res = await favoriteService.getMyFavoriteJobs();
      const data = res?.data || res;
      setFavoriteJobs(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Lỗi khi tải danh sách công việc yêu thích:', err);
      setError('Không thể tải danh sách công việc yêu thích. Vui lòng thử lại sau!');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async (jobId) => {
    try {
      await favoriteService.toggleFavoriteJob(jobId);
      setFavoriteJobs((prev) => prev.filter((item) => item.job?.id !== jobId));
    } catch (err) {
      console.error('Lỗi khi xóa công việc khỏi danh sách yêu thích:', err);
      alert('Có lỗi xảy ra khi thực hiện thao tác!');
    }
  };

  const formatBudget = (min, max, currency) => {
    const curr = currency || 'VND';
    if (!min && !max) return 'Thỏa thuận';
    if (min && max) return `${min.toLocaleString()} - ${max.toLocaleString()} ${curr}`;
    if (min) return `Từ ${min.toLocaleString()} ${curr}`;
    return `Đến ${max.toLocaleString()} ${curr}`;
  };

  if (loading) {
    return (
      <div className={styles.container} style={{ textAlign: 'center', paddingTop: '48px' }}>
        <div className="spinner-border text-primary" role="status" />
        <p style={{ marginTop: '12px', color: '#64748b', fontSize: '0.875rem' }}>
          Đang tải danh sách công việc đã lưu...
        </p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.headerSection}>
        <div>
          <h3 className={styles.title}>
            <i className="bi bi-heart-fill"></i>
            Công việc đã lưu
          </h3>
          <p className={styles.subtitle}>
            Danh sách các dự án bạn quan tâm và đã đánh dấu lưu.
          </p>
        </div>
        <span className={styles.countBadge}>{favoriteJobs.length} công việc</span>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && favoriteJobs.length === 0 ? (
        <div className={styles.emptyCard}>
          <div className={styles.emptyIcon}>
            <i className="bi bi-bookmark-heart"></i>
          </div>
          <h5>Chưa có công việc nào trong danh sách yêu thích</h5>
          <p>Hãy khám phá danh sách việc làm và bấm lưu công việc bạn quan tâm.</p>
          <Link to="/jobs" className={styles.btnExplore}>
            Khám phá việc làm
          </Link>
        </div>
      ) : (
        <div className={styles.jobList}>
          {favoriteJobs.map((item) => {
            const job = item.job || {};
            return (
              <div key={item.id || job.id} className={styles.jobCard}>
                <div className={styles.cardTop}>
                  <div style={{ flex: 1 }}>
                    <h5 className={styles.jobTitle}>
                      <Link to={`/job/${job.id}`}>
                        {job.title || 'Chưa cập nhật tiêu đề'}
                      </Link>
                    </h5>
                    <div className={styles.companyMeta}>
                      <i className="bi bi-building"></i>
                      <span>{job.companyName || 'Công ty chưa cập nhật'}</span>
                      {job.companyAddress && <span>• {job.companyAddress}</span>}
                    </div>

                    <div className={styles.skillList}>
                      {job.requiredSkills?.map((skill, idx) => (
                        <span key={idx} className={styles.skillBadge}>
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => handleToggleFavorite(job.id)}
                    className={styles.btnRemove}
                    title="Bỏ lưu công việc này"
                  >
                    <i className="bi bi-heart-fill me-1"></i> Bỏ lưu
                  </button>
                </div>

                <div className={styles.divider} />

                <div className={styles.cardBottom}>
                  <div className={styles.infoGroup}>
                    <span>
                      <i className="bi bi-cash-stack me-1 text-success"></i>
                      Ngân sách:{' '}
                      <strong className={styles.budgetText}>
                        {formatBudget(job.minBudget, job.maxBudget, job.currency)}
                      </strong>
                    </span>
                    {job.employmentType && (
                      <span>
                        <i className="bi bi-briefcase me-1"></i> Hình thức:{' '}
                        <strong>{job.employmentType}</strong>
                      </span>
                    )}
                    {job.experienceLevel && (
                      <span>
                        <i className="bi bi-bar-chart me-1"></i> Kinh nghiệm:{' '}
                        <strong>{job.experienceLevel}</strong>
                      </span>
                    )}
                  </div>
                  {item.createdAt && (
                    <span className={styles.saveDate}>
                      Lưu ngày: {new Date(item.createdAt).toLocaleDateString('vi-VN')}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default FavoriteJobs;