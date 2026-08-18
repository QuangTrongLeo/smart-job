import React, { useState } from 'react';
import styles from './FreelancerDetail.module.scss';

function FreelancerDetail() {
  const [isSaved, setIsSaved] = useState(false);

  const toggleSave = () => {
    setIsSaved(!isSaved);
  };

  const handleContact = () => {
    alert('Đã gửi yêu cầu liên hệ tới freelancer!');
  };

  return (
    <div className={styles.freelancerContainer}>
      {/* Profile Header Section */}
      <section className={styles.headerSection}>
        <div className={styles.headerContent}>
          <div className={styles.userInfo}>
            <img
              alt="Avatar Freelancer"
              className={styles.avatar}
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCBM9jM1gXvXY5VUQh5JYZ3CUEsro-vcVxGiUHEyg1mhD48voznNU13QQhVIoOF6zTcc2kq8xTAZ5QC-xp_9jLPdLkkAvOn9YX3iBZZPUJvQqH9pbZCq3NR3gAduxRdmG2WLoyi5Bl1eP6iSMuhIpgKQXVQNAx4AJLKmhcqT14J3i0otH169T3Krz4s08PfcKC6rXC1Nmjaifcm7UkizOgyoLfAbTt8Tn7HOyjTBHT07EYzB6-h60-U"
            />
            <div className={styles.userDetails}>
              <div className={styles.nameRow}>
                <h1>Nguyễn Văn An</h1>
                <span className={`material-symbols-outlined ${styles.verifiedIcon}`} style={{ fontVariationSettings: "'FILL' 1" }}>
                  verified
                </span>
              </div>
              <p className={styles.jobTitle}>Senior Fullstack Developer</p>
              <div>
                <span className={styles.statusBadge}>
                  <span className={styles.statusDot}></span> Đang nhận dự án
                </span>
              </div>
            </div>
          </div>

          <div className={styles.actionArea}>
            <div className={styles.statsRow}>
              <div className={styles.statItem}>
                <div className={styles.rating}>
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                    star
                  </span> 
                  4.9
                </div>
                <p className={styles.statLabel}>(65 đánh giá)</p>
              </div>
              <div className={styles.divider}></div>
              <div className={styles.statItem}>
                <div className={styles.statValue}>98%</div>
                <p className={styles.statLabel}>Hoàn thành</p>
              </div>
              <div className={styles.divider}></div>
              <div className={styles.statItem}>
                <div className={styles.statValue}>5 năm</div>
                <p className={styles.statLabel}>Kinh nghiệm</p>
              </div>
            </div>

            <div className={styles.headerButtons}>
              <button 
                onClick={toggleSave} 
                className={`${styles.btnOutline} ${isSaved ? styles.saved : ''}`}
              >
                <span className="material-symbols-outlined" style={{ fontVariationSettings: isSaved ? "'FILL' 1" : "'FILL' 0" }}>
                  bookmark
                </span> 
                {isSaved ? 'Đã lưu' : 'Lưu hồ sơ'}
              </button>
              <button onClick={handleContact} className={styles.btnPrimary}>
                <span className="material-symbols-outlined">mail</span> 
                Liên hệ ngay
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <main className={styles.mainLayout}>
        {/* Left Column (8 columns) */}
        <div className={styles.leftColumn}>
          {/* Giới thiệu */}
          <section className={styles.card}>
            <h2 className={styles.sectionTitle}>Giới thiệu</h2>
            <div className={styles.bioText}>
              <p>
                Xin chào, tôi là An. Với hơn 5 năm kinh nghiệm trong lĩnh vực phát triển phần mềm, tôi chuyên xây dựng các ứng dụng web phức tạp, mở rộng và hiệu suất cao. Tôi có đam mê mãnh liệt với việc giải quyết các bài toán kỹ thuật khó và tối ưu hóa trải nghiệm người dùng.
              </p>
              <p>
                Tôi luôn tuân thủ nguyên tắc Clean Code, viết test cẩn thận và liên tục cập nhật công nghệ mới để mang lại giải pháp tốt nhất cho khách hàng. Phong cách làm việc của tôi đề cao sự minh bạch, giao tiếp hiệu quả và cam kết đúng tiến độ.
              </p>
            </div>
          </section>

          {/* Kỹ năng */}
          <section className={styles.card}>
            <h2 className={styles.sectionTitle}>Kỹ năng chuyên môn</h2>
            <div className={styles.skillsList}>
              {['ReactJS', 'Node.js', 'TypeScript', 'PostgreSQL', 'MongoDB', 'Docker', 'AWS', 'GraphQL'].map((skill, index) => (
                <span key={index} className={styles.skillTag}>
                  {skill}
                </span>
              ))}
            </div>
          </section>

          {/* Kinh nghiệm làm việc */}
          <section className={styles.card}>
            <h2 className={styles.sectionTitle}>Kinh nghiệm làm việc</h2>
            <div className={styles.experienceTimeline}>
              <div className={styles.timelineItem}>
                <div className={styles.dot}></div>
                <h3 className={styles.roleTitle}>
                  Senior Software Engineer <span className={styles.company}>tại TechNova Solutions</span>
                </h3>
                <p className={styles.timeRange}>Tháng 6, 2021 - Hiện tại</p>
                <ul className={styles.responsibilities}>
                  <li>Thiết kế kiến trúc và phát triển hệ thống ERP dựa trên microservices phục vụ hơn 10,000 người dùng hàng ngày.</li>
                  <li>Tối ưu hóa hiệu suất database, giảm thời gian query xuống 40%.</li>
                  <li>Dẫn dắt đội ngũ 4 frontend developers.</li>
                </ul>
              </div>

              <div className={styles.timelineItem}>
                <div className={`${styles.dot} ${styles.dotMuted}`}></div>
                <h3 className={styles.roleTitle}>
                  Fullstack Developer <span className={styles.company}>tại Creative Digital</span>
                </h3>
                <p className={styles.timeRange}>Tháng 3, 2019 - Tháng 5, 2021</p>
                <ul className={styles.responsibilities}>
                  <li>Xây dựng nền tảng E-learning bằng MERN stack (MongoDB, Express, React, Node.js).</li>
                  <li>Tích hợp các cổng thanh toán Stripe và PayPal.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Học vấn */}
          <section className={styles.card}>
            <h2 className={styles.sectionTitle}>Học vấn</h2>
            <div className={styles.educationBlock}>
              <div className={styles.eduIcon}>
                <span className="material-symbols-outlined">school</span>
              </div>
              <div>
                <h3 className={styles.degree}>Cử nhân Kỹ thuật Phần mềm</h3>
                <p className={styles.school}>Đại học Khoa học Tự nhiên TP.HCM</p>
                <p className={styles.eduTime}>2015 - 2019 • Tốt nghiệp loại Giỏi</p>
              </div>
            </div>
          </section>

          {/* Dự án tiêu biểu */}
          <section className={styles.card}>
            <h2 className={styles.sectionTitle}>Dự án tiêu biểu</h2>
            <div className={styles.portfolioGrid}>
              <div className={styles.portfolioCard}>
                <img 
                  alt="Dự án E-commerce" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuC7m2jLhehB4i5yUV-3kQOymNCp-KYRZM1nyuKseDS6ELGm1pXntUsLAIT6BuG0-bO5SKywOCV5ELujiOnDmgJ6eBBN4XvEbpzaxxCj9GryXIfpJxR7kaZfHzamks6Llh3IxbmUyw__WA54VsuCQvFz0uJ48MGd0z9oOAlFkpFvHx4iAUDEQVa9q5Cg_A6Ke5mhtDN7FijV8WaGmtDrFYMvhWLW-ZmKPRtzAkGZs99cRVMDr9uT89U7"
                />
                <div className={styles.portfolioBody}>
                  <h3 className={styles.projectTitle}>Nền tảng Quản lý Bán hàng E-commerce</h3>
                  <p className={styles.projectDesc}>
                    Hệ thống quản lý kho, đơn hàng đa kênh với biểu đồ thống kê thời gian thực xây dựng bằng React và GraphQL.
                  </p>
                  <a href="#details" className={styles.projectLink}>Xem chi tiết</a>
                </div>
              </div>

              <div className={styles.portfolioCard}>
                <img 
                  alt="Dự án Đặt lịch khám" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCjZeD4F00Hgj1r3kwBSeLI-8wpN3Crg91k57zFuHdTl000tH8tgX2JE7piiBtmFD-QTX8C-e29GOcIVa5mxzWaFC2TIn7XB66yTflHzHXsoxHtBdl4T7A9G2uos_VnpTLrun6Oum3usbQC_5oq5GOqp3vtdL3Lu-DEbAfyqykxzVtddQW7qFVvHSt49GW4zwi4mc5A5ibfFhLXXP9vxTn6KYPg367g5GdtFo09tYBeG5S1HZMB3S4b"
                />
                <div className={styles.portfolioBody}>
                  <h3 className={styles.projectTitle}>Ứng dụng Đặt lịch Khám Bệnh</h3>
                  <p className={styles.projectDesc}>
                    App React Native kết nối bệnh nhân và bác sĩ, tích hợp video call WebRTC và hệ thống nhắc nhở tự động.
                  </p>
                  <a href="#details" className={styles.projectLink}>Xem chi tiết</a>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column (4 columns) */}
        <div className={styles.rightColumn}>
          {/* Thông tin bổ sung */}
          <div className={styles.card}>
            <h3 className={styles.sectionTitle}>Thông tin bổ sung</h3>
            <ul className={styles.infoList}>
              <li className={styles.infoItem}>
                <span className={`material-symbols-outlined ${styles.infoIcon}`}>payments</span>
                <div>
                  <div className={styles.infoLabel}>Giá tham khảo</div>
                  <div className={styles.infoValue}>$30 / giờ</div>
                </div>
              </li>
              <li className={styles.infoItem}>
                <span className={`material-symbols-outlined ${styles.infoIcon}`}>location_on</span>
                <div>
                  <div className={styles.infoLabel}>Địa điểm</div>
                  <div className={styles.infoValue}>TP. Hồ Chí Minh (Sẵn sàng Remote)</div>
                </div>
              </li>
              <li className={styles.infoItem}>
                <span className={`material-symbols-outlined ${styles.infoIcon}`}>language</span>
                <div>
                  <div className={styles.infoLabel}>Ngôn ngữ</div>
                  <div className={styles.infoValue}>Tiếng Việt (Bản xứ), Tiếng Anh (C1)</div>
                </div>
              </li>
              <li className={styles.infoItem}>
                <span className={`material-symbols-outlined ${styles.infoIcon}`}>schedule</span>
                <div>
                  <div className={styles.infoLabel}>Thời gian khả dụng</div>
                  <div className={styles.infoValue}>30-40 giờ / tuần</div>
                </div>
              </li>
            </ul>
          </div>

          {/* AI Match Card */}
          <div className={styles.aiMatchBox}>
            <div className={styles.aiGlow}></div>
            <div className={styles.aiTitleRow}>
              <span className="material-symbols-outlined">auto_awesome</span>
              <h3>AI Match</h3>
            </div>
            <div className={styles.scoreRow}>
              <span className={styles.scoreValue}>95%</span>
              <span className={styles.scoreText}>Phù hợp</span>
            </div>
            <p className={styles.aiDesc}>
              Freelancer này rất phù hợp với dự án "Xây dựng CRM hệ thống" của bạn dựa trên kỹ năng ReactJS và Node.js.
            </p>
            <button className={styles.btnInvite}>Mời tham gia dự án</button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default FreelancerDetail;