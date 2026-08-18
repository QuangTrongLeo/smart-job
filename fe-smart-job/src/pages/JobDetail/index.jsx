import React, { useState } from 'react';
import styles from './JobDetail.module.scss';

function JobDetail() {
  const [isSaved, setIsSaved] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  const handleApply = () => {
    setHasApplied(true);
    alert('Ứng tuyển thành công!');
  };

  const toggleSave = () => {
    setIsSaved(!isSaved);
  };

  return (
    <div className={styles.jobDetailContainer}>
      {/* Main Content */}
      <main className={styles.mainLayout}>
        
        {/* Left Column: Job Details */}
        <div className={styles.leftColumn}>
          {/* Job Header Card */}
          <div className={styles.card}>
            <div className={styles.jobHeader}>
              <div className={styles.headerTop}>
                <h1 className={styles.jobTitle}>
                  Thiết kế UI/UX cho ứng dụng di động Fintech
                </h1>
                <span className={styles.categoryBadge}>
                  Thiết kế
                </span>
              </div>
              <div className={styles.metaInfo}>
                <span className={styles.metaItem}>
                  <span className="material-symbols-outlined">schedule</span> Đăng 2 giờ trước
                </span>
                <span className={styles.metaItem}>
                  <span className="material-symbols-outlined">location_on</span> Từ xa (Việt Nam)
                </span>
                <span className={styles.metaItem}>
                  <span className="material-symbols-outlined">work</span> Dự án ngắn hạn
                </span>
              </div>
            </div>
          </div>

          {/* Client Info Card */}
          <div className={styles.clientCard}>
            <div className={styles.avatar}>
              <img 
                alt="Logo công ty" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAzHAO0-vGqScjve64bFhXMKUOadq7CWhf4bejRI9FWGxk7DA01s7WEBUJc-sWLOfJOpjwdS_8bHR-jts1ssuqV0WHvX7CtKyG5leaY8CNi3OZ5t1-hVPUSeIp5vJ3PGajhh1SZTgLY6UwLh611UhRICCbSFAFanQvHMHvt0GpcHZtJtKfluRJjPlDidwbT15dMX2sKWOPCgL2VrXoehKi7IXPUbZ-pymLm9zxo9tAgmGFCZcyEN_jS"
              />
            </div>
            <div className={styles.clientDetails}>
              <span className={styles.clientName}>FinTech Innovators JSC</span>
              <div className={styles.clientSub}>
                <span className={styles.verified}>
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span> 
                  4.9 (120 đánh giá)
                </span>
                <span>•</span>
                <span>Đã chi tiêu: $50k+</span>
                <span>•</span>
                <span className={styles.verified}>
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span> 
                  Đã xác minh thanh toán
                </span>
              </div>
            </div>
          </div>

          {/* Job Description */}
          <div className={styles.card}>
            <h2 className={styles.sectionTitle}>
              Mô tả công việc
            </h2>
            <div className={styles.jobDescription}>
              <p>
                Chúng tôi đang tìm kiếm một UI/UX Designer có kinh nghiệm để thiết kế lại ứng dụng di động ví điện tử của chúng tôi. Ứng dụng hiện tại cần được nâng cấp về mặt thẩm mỹ và tối ưu hóa luồng người dùng để tăng tỷ lệ chuyển đổi.
              </p>
              <p><strong>Nhiệm vụ chính:</strong></p>
              <ul>
                <li>Nghiên cứu người dùng và phân tích đối thủ cạnh tranh trong mảng Fintech.</li>
                <li>Thiết kế wireframes, mockups và prototypes tương tác cao trên Figma.</li>
                <li>Cộng tác chặt chẽ với đội ngũ phát triển (Frontend & Backend) để đảm bảo tính khả thi của thiết kế.</li>
                <li>Tạo và duy trì Design System cho sản phẩm.</li>
              </ul>
            </div>
          </div>

          {/* Skills Required */}
          <div className={styles.card}>
            <h2 className={styles.sectionTitle}>
              Kỹ năng cần có
            </h2>
            <div className={styles.skillsList}>
              {['Figma', 'UI/UX Design', 'Fintech Experience', 'Prototyping', 'User Research'].map((skill, index) => (
                <span key={index} className={styles.skillTag}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Sidebar Actions & Info */}
        <div className={styles.rightColumn}>
          {/* Action Card */}
          <div className={styles.actionCard}>
            <div className={styles.priceInfo}>
              <div className={styles.priceRow}>
                <span className={styles.label}>Ngân sách dự kiến</span>
                <span className={`${styles.value} ${styles.priceHighlight}`}>$1,500 - $2,500</span>
              </div>
              <div className={styles.priceRow}>
                <span className={styles.label}>Loại giá</span>
                <span className={styles.value}>Cố định theo dự án</span>
              </div>
              <div className={styles.priceRow}>
                <span className={styles.label}>Thời gian dự kiến</span>
                <span className={styles.value}>1 - 2 tháng</span>
              </div>
            </div>
            
            <div className={styles.buttonGroup}>
              <button 
                onClick={handleApply}
                disabled={hasApplied}
                className={styles.btnPrimary}
              >
                {hasApplied ? 'Đã ứng tuyển' : 'Ứng tuyển ngay'}
              </button>
              
              <button 
                onClick={toggleSave}
                className={`${styles.btnSecondary} ${isSaved ? styles.saved : ''}`}
              >
                <span className="material-symbols-outlined" style={{ fontVariationSettings: isSaved ? "'FILL' 1" : "'FILL' 0" }}>
                  bookmark
                </span> 
                {isSaved ? 'Đã lưu việc' : 'Lưu việc'}
              </button>
            </div>
          </div>

          {/* AI Match Score Component */}
          <div className={styles.aiMatchCard}>
            <div className={styles.watermarkIcon}>
              <span className="material-symbols-outlined">auto_awesome</span>
            </div>
            <div className={styles.aiContent}>
              <div className={styles.aiHeader}>
                <span className="material-symbols-outlined">psychiatry</span>
                <h3>AI Match Score</h3>
              </div>
              <div className={styles.scoreDisplay}>
                <span className={styles.scoreNumber}>92%</span>
                <span className={styles.scoreLabel}>Độ phù hợp</span>
              </div>
              
              {/* Progress Bar */}
              <div className={styles.progressBarTrack}>
                <div className={styles.progressBarFill} style={{ width: '92%' }}></div>
              </div>
              
              <div className={styles.aiDetails}>
                <p className={styles.aiPoint}>
                  <span className={`material-symbols-outlined ${styles.iconCheck}`}>check_circle</span>
                  <span><strong>Kỹ năng khớp cao:</strong> Bạn có 4/5 kỹ năng yêu cầu (Figma, UI/UX, Prototyping).</span>
                </p>
                <p className={styles.aiPoint}>
                  <span className={`material-symbols-outlined ${styles.iconCheck}`}>check_circle</span>
                  <span><strong>Kinh nghiệm:</strong> Dự án "Ví điện tử XYZ" trong hồ sơ của bạn rất tương đồng.</span>
                </p>
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}

export default JobDetail;