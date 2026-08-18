import { Link } from 'react-router-dom';
import styles from './Home.module.scss';

function Home() {
  return (
    <div className={styles.homeWrapper}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <h1 className={styles.heroTitle}>Tìm đúng người. Đúng việc. Đúng kỹ năng.</h1>
        <p className={styles.heroDesc}>
          Nền tảng kết nối Client và Freelancer thông minh, sử dụng AI để đánh giá và tối ưu mức độ phù hợp, đảm bảo chất lượng và tốc độ cho mọi dự án.
        </p>

        {/* Search Box */}
        <div className={styles.searchBox}>
          <div className={styles.inputGroup}>
            <i className="bi bi-search"></i>
            <input placeholder="Từ khóa công việc, kỹ năng..." type="text" />
          </div>
          <div className={styles.inputGroup}>
            <i className="bi bi-geo-alt"></i>
            <input placeholder="Địa điểm" type="text" />
          </div>
          <div className={styles.inputGroup}>
            <i className="bi bi-briefcase"></i>
            <select defaultValue="">
              <option value="" disabled hidden>Loại công việc</option>
              <option value="freelance">Freelance</option>
              <option value="fulltime">Full-time</option>
              <option value="parttime">Part-time</option>
            </select>
          </div>
          <button className={styles.btnSearch}>
            <i className="bi bi-search"></i>
            Tìm kiếm
          </button>
        </div>

        {/* Tags */}
        <div className={styles.tagsGroup}>
          <span className={styles.tagLabel}>Phổ biến:</span>
          <span className={styles.tagBadge}>React Native</span>
          <span className={styles.tagBadge}>UI/UX Design</span>
          <span className={styles.tagBadge}>Copywriting</span>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className={styles.featuredSection}>
        <div className={styles.sectionContainer}>
          <div className={styles.sectionHeader}>
            <div>
              <h2>Việc làm nổi bật</h2>
              <p>Những cơ hội mới nhất đang chờ bạn</p>
            </div>
            <Link to="/jobs">
              Xem tất cả <i className="bi bi-arrow-right ms-1"></i>
            </Link>
          </div>

          <div className={styles.gridCards}>
            {/* Job Card 1 */}
            <div className={styles.jobCard}>
              <div className={styles.cardHeader}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <div className={styles.companyLogo}>TC</div>
                  <div>
                    <h3 className={styles.jobTitle}>Senior Frontend Developer</h3>
                    <p className={styles.companyName}>TechCorp VN</p>
                  </div>
                </div>
                <button className={styles.btnBookmark}>
                  <i className="bi bi-bookmark"></i>
                </button>
              </div>
              <div className={styles.cardTags}>
                <span className={styles.skillBadge}>ReactJS</span>
                <span className={styles.skillBadge}>TypeScript</span>
                <span className={styles.typeBadge}>Remote</span>
              </div>
              <div className={styles.cardFooter}>
                <span className={styles.salary}>$1500 - $2500 <span>/tháng</span></span>
                <span className={styles.timePosted}>2 ngày trước</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;