import React from 'react';
import styles from './Profile.module.scss';

function Profile() {
  return (
    <div className={styles.profileContainer}>
      {/* Top Bar */}
      <nav className={styles.navbar}>
        <div className={styles.navLeft}>
          <a href="#" className={styles.logo}>
            SMART JOB
          </a>
          <div className={styles.navLinks}>
            <a href="#">Việc làm</a>
            <a href="#" className={styles.active}>
              Tìm Freelancer
            </a>
            <a href="#">Khám phá</a>
            <a href="#">Về Smart Job</a>
          </div>
        </div>
        <div className={styles.navRight}>
          <button className={styles.loginBtn}>Đăng nhập</button>
          <button className={styles.registerBtn}>Đăng ký</button>
        </div>
      </nav>

      {/* Main Content */}
      <main className={styles.mainContent}>
        {/* Profile Header */}
        <section className={styles.headerCard}>
          <div className={styles.bgDecoration}></div>
          <div className={styles.headerInner}>
            <div className={styles.avatarWrapper}>
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA-ZngYIepQ4p-qdjmLWvZRUi6H4almlg1WXtR4M8ALzSjk9YWDZi4u_P_s1yZ18rLm4n2_w1K2rU0cowlmjj7mjD4tiHq3_TPFzI0EoDt6gV_iz6U3uSaiQl3G5DxRWdWeeFarxJsgxyvD8im1sgFH7TP7lE17dh4nhjCy--K8Rut6Hc-GY2MyLz8G4FYEP_mWgjncXa5jIR5xTtUnrBWByYL1C8EIa4qW_-ZdquJr536GgPLGP9Fw9g"
                alt="Nguyễn Văn An Avatar"
              />
              <div className={styles.statusDot} title="Đang nhận dự án"></div>
            </div>

            <div className={styles.infoWrapper}>
              <div className={styles.nameRow}>
                <h1 className={styles.name}>Nguyễn Văn An</h1>
                <span className={styles.badge}>
                  <span className={`material-symbols-outlined ${styles.icon}`}>
                    check_circle
                  </span>
                  Đang nhận dự án
                </span>
              </div>
              <p className={styles.jobTitle}>Lập trình viên Full Stack</p>
              <p className={styles.bio}>
                Chuyên gia xây dựng các ứng dụng web mở rộng, hiệu suất cao với React, Node.js và kiến trúc Cloud. Hơn 5 năm kinh nghiệm làm việc với các startup công nghệ và doanh nghiệp.
              </p>
              <div className={styles.actionGroup}>
                <button className={styles.primaryBtn}>
                  <span className="material-symbols-outlined">send</span> Mời làm việc
                </button>
                <button className={styles.secondaryBtn}>
                  <span className="material-symbols-outlined">bookmark_add</span> Lưu hồ sơ
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 2 Column Layout */}
        <div className={styles.layoutGrid}>
          {/* Left Column */}
          <div className={styles.leftColumn}>
            {/* Giới thiệu */}
            <section className={styles.card}>
              <h2 className={styles.cardTitle}>
                <span className={`material-symbols-outlined ${styles.icon}`}>person</span>
                Giới thiệu bản thân
              </h2>
              <p className={styles.aboutText}>
                {`Tôi là một Kỹ sư phần mềm đam mê tạo ra các giải pháp công nghệ mang lại giá trị thực tế. Với nền tảng vững chắc về cả Frontend và Backend, tôi thích giải quyết các vấn đề phức tạp và tối ưu hóa hệ thống để đạt hiệu năng tốt nhất.\n\nPhong cách làm việc của tôi đề cao sự minh bạch trong giao tiếp, cam kết đúng tiến độ và luôn đặt chất lượng code lên hàng đầu. Tôi thường xuyên cập nhật các công nghệ mới nhất để áp dụng vào dự án một cách hiệu quả.`}
              </p>
            </section>

            {/* Kỹ năng */}
            <section className={styles.card}>
              <h2 className={styles.cardTitle}>
                <span className={`material-symbols-outlined ${styles.icon}`}>psychology</span>
                Kỹ năng chuyên môn
              </h2>
              <div className={styles.skillsWrapper}>
                <span className={styles.skillPrimary}>React.js</span>
                <span className={styles.skillPrimary}>Node.js</span>
                <span className={styles.skillPrimary}>TypeScript</span>
                <span className={styles.skillPrimary}>Next.js</span>
                <span className={styles.skillPrimary}>PostgreSQL</span>
                <span className={styles.skillPrimary}>AWS</span>
                <span className={styles.skillPrimary}>Docker</span>
                <span className={styles.skillSecondary}>GraphQL</span>
                <span className={styles.skillSecondary}>Tailwind CSS</span>
                <span className={styles.skillSecondary}>Figma</span>
              </div>
            </section>

            {/* Kinh nghiệm */}
            <section className={styles.card}>
              <h2 className={styles.cardTitle}>
                <span className={`material-symbols-outlined ${styles.icon}`}>work</span>
                Kinh nghiệm làm việc
              </h2>
              <div className={styles.expList}>
                <div className={styles.expItem}>
                  <div className={styles.timeline}>
                    <div className={styles.dotActive}></div>
                    <div className={styles.line}></div>
                  </div>
                  <div className={styles.expContent}>
                    <h3 className={styles.expRole}>Senior Full Stack Developer</h3>
                    <p className={styles.expCompany}>TechNova Solutions • Freelance</p>
                    <p className={styles.expTime}>03/2021 - Hiện tại</p>
                    <p className={styles.expDesc}>
                      Dẫn dắt đội ngũ 3 người phát triển nền tảng quản lý nhân sự SaaS. Thiết kế kiến trúc microservices với Node.js và xây dựng giao diện người dùng tương tác cao bằng React.
                    </p>
                  </div>
                </div>

                <div className={styles.expItem}>
                  <div className={styles.timeline}>
                    <div className={styles.dot}></div>
                  </div>
                  <div className={styles.expContent}>
                    <h3 className={styles.expRole}>Frontend Developer</h3>
                    <p className={styles.expCompany}>Creative Web Agency • Toàn thời gian</p>
                    <p className={styles.expTime}>06/2018 - 02/2021</p>
                    <p className={styles.expDesc}>
                      Phát triển hơn 20 trang web thương mại điện tử và landing page tối ưu hóa tỷ lệ chuyển đổi. Tăng 40% hiệu suất tải trang bằng cách áp dụng các kỹ thuật lazy loading và tối ưu hóa asset.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Portfolio */}
            <section className={styles.card}>
              <h2 className={styles.cardTitle}>
                <span className={`material-symbols-outlined ${styles.icon}`}>dashboard</span>
                Portfolio Dự án
              </h2>
              <div className={styles.portfolioGrid}>
                {/* Project 1 */}
                <div className={`${styles.portfolioCard} ${styles.large}`}>
                  <div className={styles.aspectRatio}>
                    <img
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuAbGf6N__bmq3cOyZL9ZzWiUkkkI1Jza9krzoTAueEvemNG0KcHhuGE8SL0iHZXrU_t86KICF0mfW_dbR09beGf9bYUXpNExganj07GK_5IrMvFtUpLzLBpu6GeZpBYxQ-6cgDS4CdhXGj82kUIZEBsZcZaQ56yWz-xK0F_79Zi-ZiuXA6P66t7kFw6ZScTLQBHuVGzvBF2imTREDncJmJht14Qh8SqkaATa3ZscgUxj9qevpMcZQL1qQ"
                      alt="Dự án FinDash"
                    />
                  </div>
                  <div className={styles.overlay}>
                    <h3 className={styles.projectTitle}>FinDash - Nền tảng phân tích tài chính</h3>
                    <p className={styles.projectTech}>React, D3.js, Node.js</p>
                  </div>
                </div>

                {/* Project 2 */}
                <div className={styles.portfolioCard}>
                  <div className={styles.aspectRatio}>
                    <img
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCxSDyCKcfGcV3TbomlaSsFAUpGp8uI0y97NvIxRMOvIFFEhc6ghjzsEuL2BPFcCKifrr2SOik82WheMWOQZkQ9EV1Dsp-GF343Icb2jDmEZP59pay6VNtt1MqgiSUpsRgLQWdEIZbWoJS6QbB5aTht7PtTAfTccgy9-XL4a9b4gOWyuCpKELXo71T-_dLvqSS-7LYUhgLzwO0Uo_fSKs8vJcnq6u9tp_jNB1uBZj7_Kh3Xx8sfgO5N3Q"
                      alt="Dự án EcoShop"
                    />
                  </div>
                  <div className={styles.overlay}>
                    <h3 className={styles.projectTitle}>EcoShop App</h3>
                    <p className={styles.projectTech}>React Native, Firebase</p>
                  </div>
                </div>

                {/* Project 3 */}
                <div className={styles.portfolioCard}>
                  <div className={styles.aspectRatio}>
                    <img
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuAxvtGnxM2NQrdGj9-gjFnyPRsrej3jFJZPwcFEpVow4J4Lno0P8GkVtz24LHYTfRMcMX-YPYmzz4EV0aXvCzDYClGg7ZeJBfrRGZDIQR_dvvWLbFOKkD49LuuyY4qC3veG4Bwjm_VaL26hBbrokeP38kMnMneRtTrzGJTqh7G4qAnC3S2C7DbIiRvdv-JPi3mbHfOTLGjVHu9t0wak_lsyCK3tiQb_kj6G-z8gy3SYKYmKzWtY264ntQ"
                      alt="Dự án SmartHome IoT"
                    />
                  </div>
                  <div className={styles.overlay}>
                    <h3 className={styles.projectTitle}>SmartHome Dashboard</h3>
                    <p className={styles.projectTech}>Vue.js, MQTT, Go</p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column (Sidebar) */}
          <div className={styles.rightColumn}>
            {/* Quick Info Card */}
            <div className={`${styles.card} ${styles.stickyCard}`}>
              <div className={styles.priceRow}>
                <span className={styles.priceLabel}>Mức giá đề xuất</span>
                <span className={styles.priceVal}>
                  $35 <span>/ giờ</span>
                </span>
              </div>
              <div className={styles.infoList}>
                <div className={styles.infoItem}>
                  <span className={`material-symbols-outlined ${styles.icon}`}>
                    location_on
                  </span>
                  <div>
                    <p className={styles.title}>Hồ Chí Minh, Việt Nam</p>
                    <p className={styles.sub}>Giờ làm việc: GMT+7</p>
                  </div>
                </div>

                <div className={styles.infoItem}>
                  <span className={`material-symbols-outlined ${styles.icon}`}>
                    language
                  </span>
                  <div>
                    <p className={styles.title}>Ngôn ngữ</p>
                    <p className={styles.desc}>
                      Tiếng Việt (Bản xứ), Tiếng Anh (Lưu loát - IELTS 7.5)
                    </p>
                  </div>
                </div>

                <div className={styles.infoItem}>
                  <span className={`material-symbols-outlined ${styles.icon}`}>
                    schedule
                  </span>
                  <div>
                    <p className={styles.title}>Thời gian phản hồi</p>
                    <p className={styles.desc}>Dưới 2 giờ</p>
                  </div>
                </div>
              </div>
              <button className={styles.contactBtn}>Liên hệ ngay</button>
            </div>

            {/* Stats Card */}
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Thống kê hoạt động</h3>
              <div className={styles.statsGrid}>
                <div className={styles.statBox}>
                  <span className={styles.num}>42</span>
                  <span className={styles.label}>Dự án hoàn thành</span>
                </div>
                <div className={styles.statBox}>
                  <span className={styles.num}>5.0</span>
                  <span className={styles.label}>Đánh giá sao</span>
                  <div className={styles.stars}>
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={`material-symbols-outlined ${styles.starIcon}`}>
                        star
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Học vấn */}
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>
                <span className={`material-symbols-outlined ${styles.icon}`}>school</span>
                Học vấn
              </h3>
              <div>
                <p style={{ fontSize: '14px', fontWeight: 500, margin: 0 }}>
                  Cử nhân Công nghệ Thông tin
                </p>
                <p style={{ fontSize: '14px', color: '#434655', margin: '4px 0 0 0' }}>
                  Đại học Bách Khoa TP.HCM
                </p>
                <p style={{ fontSize: '12px', color: '#5c5f61', margin: '4px 0 0 0' }}>
                  2014 - 2018
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerGrid}>
          <div className={styles.footerBrand}>
            <div className={styles.brandTitle}>SMART JOB</div>
            <p>© 2024 SMART JOB. All rights reserved.</p>
          </div>
          <div className={styles.footerCol}>
            <a href="#">Về chúng tôi</a>
            <a href="#">Việc làm</a>
            <a href="#">Tìm Freelancer</a>
          </div>
          <div className={styles.footerCol}>
            <a href="#">Hỗ trợ</a>
            <a href="#">Điều khoản</a>
            <a href="#">Chính sách bảo mật</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Profile;