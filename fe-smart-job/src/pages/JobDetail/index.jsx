import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jobService, favoriteService, chatService } from '../../services';
import { useAuth } from '../../context/AuthContext';
import AiMatchWidget from '../../components/AiMatchWidget/AiMatchWidget';
import styles from './JobDetail.module.scss';

const DEFAULT_AVATAR =
  'https://ui-avatars.com/api/?background=2563eb&color=fff&name=User';

function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [messaging, setMessaging] = useState(false);
  const [messageError, setMessageError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // 1. Lấy thông tin chi tiết công việc
        const jobResponse = await jobService.getJobById(id);
        if (jobResponse && jobResponse.data) {
          setJob(jobResponse.data);
        }

        // 2. Kiểm tra xem công việc này đã được yêu thích trước đó chưa
        try {
          const favResponse = await favoriteService.getMyFavoriteJobs();
          if (favResponse && favResponse.data && Array.isArray(favResponse.data)) {
            const isFavorited = favResponse.data.some(
              (item) => item.job?.id === id || item.jobId === id
            );
            setIsSaved(isFavorited);
          }
        } catch (favError) {
          // Bỏ qua lỗi nếu người dùng chưa đăng nhập hoặc không có quyền Freelancer
          console.warn('Không thể kiểm tra trạng thái yêu thích:', favError);
        }

      } catch (error) {
        console.error('Lỗi khi tải thông tin công việc:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const formatSalary = (min, max, currency) => {
    if (!min && !max) return 'Thỏa thuận';
    const curr = currency || 'USD';
    if (min && max) return `${min.toLocaleString()} - ${max.toLocaleString()} ${curr}`;
    if (min) return `Từ ${min.toLocaleString()} ${curr}`;
    return `Đến ${max.toLocaleString()} ${curr}`;
  };

  const formatDate = (instantString) => {
    if (!instantString) return 'Mới đăng';
    const date = new Date(instantString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const handleApply = () => {
    setHasApplied(true);
    alert('Ứng tuyển thành công!');
  };

  const handleMessage = async () => {
    const partnerId = job?.client?.id;
    if (!partnerId || messaging) {
      setMessageError('Không tìm thấy thông tin người tuyển dụng.');
      return;
    }

    setMessaging(true);
    setMessageError('');
    try {
      const response = await chatService.getOrCreateConversation({
        partnerId,
        jobId: job.id,
      });
      const conversation = response?.data?.data || response?.data;
      if (!conversation?.id) throw new Error('Missing conversation id');
      navigate(`/messages?conversationId=${conversation.id}`, { state: { conversation } });
    } catch (error) {
      console.error('Lỗi khi khởi tạo cuộc trò chuyện:', error);
      setMessageError(error.response?.data?.message || 'Không thể mở cuộc trò chuyện. Vui lòng thử lại.');
    } finally {
      setMessaging(false);
    }
  };

  // Hàm Toggle công việc yêu thích
  const toggleSave = async () => {
    if (!job?.id) return;

    const previousSavedState = isSaved;
    // Cập nhật giao diện trước (Optimistic UI)
    setIsSaved(!previousSavedState);

    try {
      const response = await favoriteService.toggleFavoriteJob(job.id);
      // Kết quả trả về từ API (true = đã thêm, false = đã xóa)
      if (response && typeof response.data === 'boolean') {
        setIsSaved(response.data);
      }
    } catch (error) {
      console.error('Lỗi khi lưu/bỏ yêu thích:', error);
      // Hoàn tác về trạng thái cũ nếu gọi API thất bại
      setIsSaved(previousSavedState);
      
      const errorMessage = error.response?.data?.message || 'Thao tác thất bại. Vui lòng thử lại!';
      alert(errorMessage);
    }
  };

  if (loading) {
    return (
      <div className={styles.jobDetailContainer}>
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <p>Đang tải chi tiết công việc...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className={styles.jobDetailContainer}>
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <h2>Không tìm thấy công việc!</h2>
          <button 
            className={styles.btnPrimary} 
            style={{ width: 'auto', margin: '1rem auto' }} 
            onClick={() => navigate('/jobs')}
          >
            Quay lại danh sách việc làm
          </button>
        </div>
      </div>
    );
  }

  // Thông tin client & fallback
  const clientInfo = job.client || {};
  const clientAvatar = clientInfo.avatarUrl || DEFAULT_AVATAR;
  const clientName = `${clientInfo.firstName || ''} ${clientInfo.lastName || ''}`.trim() || clientInfo.username || 'Người tuyển dụng';
  const companyName = job.companyName || clientInfo.companyName || clientName;

  return (
    <div className={styles.jobDetailContainer}>
      <main className={styles.mainLayout}>
        {/* Cột trái: Chi tiết việc làm & Mô tả công ty */}
        <div className={styles.leftColumn}>
          {/* Header Card */}
          <div className={styles.card}>
            <div className={styles.jobHeader}>
              <div className={styles.headerTop}>
                <h1 className={styles.jobTitle}>{job.title}</h1>
                <div className={styles.categoryBadgeGroup}>
                  {job.categories?.map((cat) => (
                    <span key={cat.id} className={styles.categoryBadge}>
                      {cat.name}
                    </span>
                  ))}
                </div>
              </div>

              <div className={styles.metaInfo}>
                <span className={styles.metaItem}>
                  <i className="bi bi-clock-history"></i> Đăng ngày {formatDate(job.createdAt)}
                </span>
                <span className={styles.metaItem}>
                  <i className="bi bi-geo-alt"></i> {job.companyAddress || clientInfo.address || 'Toàn quốc'}
                </span>
                <span className={styles.metaItem}>
                  <i className="bi bi-briefcase"></i> {job.employmentType || 'Dự án'}
                </span>
                <span className={styles.metaItem}>
                  <i className="bi bi-award"></i> {job.experienceLevel}{' '}
                  {job.requiredExperienceYears ? `(${job.requiredExperienceYears} năm kinh nghiệm)` : ''}
                </span>
              </div>
            </div>
          </div>

          {/* Job Description Card */}
          <div className={styles.card}>
            <h2 className={styles.sectionTitle}>Mô tả công việc</h2>
            <div className={styles.jobDescription}>
              <p>{job.description}</p>
            </div>
          </div>

          {/* Skills Required Card */}
          {job.requiredSkills?.length > 0 && (
            <div className={styles.card}>
              <h2 className={styles.sectionTitle}>Kỹ năng cần có</h2>
              <div className={styles.skillsList}>
                {job.requiredSkills.map((skill, index) => (
                  <span key={index} className={styles.skillTag}>
                    #{skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Giới thiệu chi tiết về Nhà tuyển dụng */}
          <div className={styles.card}>
            <h2 className={styles.sectionTitle}>Về nhà tuyển dụng</h2>
            <div className={styles.employerIntro}>
              <p>
                {clientInfo.bio ||
                  clientInfo.companyDescription ||
                  `${companyName} là đơn vị hoạt động chuyên nghiệp, cam kết cung cấp môi trường làm việc minh bạch và hợp tác lâu dài với các Chuyên viên/Freelancer.`}
              </p>
            </div>
          </div>
        </div>

        {/* Cột phải: Khối hành động, Thông tin nhà tuyển dụng & AI Match */}
        <div className={styles.rightColumn}>
          {/* Action Card */}
          <div className={styles.actionCard}>
            <div className={styles.priceInfo}>
              <div className={styles.priceRow}>
                <span className={styles.label}>Ngân sách dự kiến</span>
                <span className={`${styles.value} ${styles.priceHighlight}`}>
                  {formatSalary(job.minBudget, job.maxBudget, job.currency)}
                </span>
              </div>
              <div className={styles.priceRow}>
                <span className={styles.label}>Hình thức</span>
                <span className={styles.value}>{job.employmentType || 'Thỏa thuận'}</span>
              </div>
              <div className={styles.priceRow}>
                <span className={styles.label}>Trạng thái</span>
                <span className={styles.value}>{job.status || 'Đang mở'}</span>
              </div>
            </div>

            <div className={styles.buttonGroup}>
              <button
                onClick={handleApply}
                disabled={hasApplied}
                className={styles.btnPrimary}
              >
                <i className="bi bi-send-fill"></i>
                {hasApplied ? 'Đã ứng tuyển' : 'Ứng tuyển ngay'}
              </button>

              <button onClick={handleMessage} className={styles.btnMessage} disabled={messaging}>
                <i className={messaging ? 'bi bi-hourglass-split' : 'bi bi-chat-dots-fill'}></i>
                {messaging ? 'Đang mở cuộc trò chuyện...' : 'Nhắn tin với người tuyển dụng'}
              </button>
              {messageError && <p role="alert">{messageError}</p>}

              <button
                onClick={toggleSave}
                className={`${styles.btnSecondary} ${isSaved ? styles.saved : ''}`}
              >
                <i
                  className={
                    isSaved ? 'bi bi-heart-fill text-danger' : 'bi bi-heart'
                  }
                ></i>
                {isSaved ? 'Đã yêu thích' : 'Yêu thích'}
              </button>
            </div>
          </div>

          {/* Thẻ chi tiết Thông tin nhà tuyển dụng */}
          <div className={styles.clientDetailCard}>
            <div className={styles.clientHeader}>
              <img
                src={clientAvatar}
                alt={companyName}
                className={styles.clientAvatar}
                onError={(e) => {
                  e.target.src = DEFAULT_AVATAR;
                }}
              />
              <div className={styles.clientTitleGroup}>
                <h3 className={styles.clientTitle}>{companyName}</h3>
                <p className={styles.clientOwner}>Người đại diện: {clientName}</p>
                <div className={styles.ratingBadge}>
                  <i className="bi bi-star-fill text-warning"></i>
                  <span>{clientInfo.rating || '4.9'}</span>
                  <small>({clientInfo.totalReviews || '12'} đánh giá)</small>
                </div>
              </div>
            </div>

            <div className={styles.clientStatsGrid}>
              <div className={styles.statBox}>
                <i className="bi bi-patch-check-fill text-success"></i>
                <div>
                  <span className={styles.statLabel}>Thanh toán</span>
                  <strong className={styles.statValue}>Đã xác minh</strong>
                </div>
              </div>

              <div className={styles.statBox}>
                <i className="bi bi-briefcase-fill"></i>
                <div>
                  <span className={styles.statLabel}>Việc đã đăng</span>
                  <strong className={styles.statValue}>{clientInfo.postedJobsCount || '18'} việc</strong>
                </div>
              </div>

              <div className={styles.statBox}>
                <i className="bi bi-person-check-fill"></i>
                <div>
                  <span className={styles.statLabel}>Tỷ lệ thuê</span>
                  <strong className={styles.statValue}>{clientInfo.hireRate || '85%'}</strong>
                </div>
              </div>

              <div className={styles.statBox}>
                <i className="bi bi-calendar-check"></i>
                <div>
                  <span className={styles.statLabel}>Tham gia</span>
                  <strong className={styles.statValue}>{formatDate(clientInfo.createdAt || '2023-01-01')}</strong>
                </div>
              </div>
            </div>

            <div className={styles.clientMetaList}>
              <div className={styles.metaRow}>
                <i className="bi bi-geo-alt-fill"></i>
                <span>{clientInfo.location || job.companyAddress || 'TP. Hồ Chí Minh, Việt Nam'}</span>
              </div>
              {clientInfo.website && (
                <div className={styles.metaRow}>
                  <i className="bi bi-globe"></i>
                  <a href={clientInfo.website} target="_blank" rel="noopener noreferrer">
                    {clientInfo.website}
                  </a>
                </div>
              )}
              <div className={styles.metaRow}>
                <i className="bi bi-building"></i>
                <span>Quy mô: {clientInfo.companySize || '10-50 nhân sự'}</span>
              </div>
            </div>
          </div>

          <AiMatchWidget jobId={id || job.id} />
        </div>
      </main>
    </div>
  );
}

export default JobDetail;