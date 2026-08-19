import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { enumService } from '../../services';
import styles from './Home.module.scss';

function Home() {
  const [employmentTypes, setEmploymentTypes] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedEmploymentType, setSelectedEmploymentType] = useState('');

  // Danh sách địa điểm mock
  const locations = [
    { value: '', label: 'Tất cả tỉnh thành' },
    { value: 'HCM', label: 'Tp.Hồ Chí Minh' },
    { value: 'HN', label: 'Hà Nội' },
    { value: 'DN', label: 'Đà Nẵng' },
  ];

  // Lấy danh sách Employment Types từ Backend
  useEffect(() => {
    const fetchEmploymentTypes = async () => {
      try {
        const response = await enumService.getEmploymentTypes();
        if (response && response.data) {
          setEmploymentTypes(response.data);
        }
      } catch (error) {
        console.error('Lỗi khi lấy danh sách loại hình làm việc:', error);
      }
    };

    fetchEmploymentTypes();
  }, []);

  const handleSearch = () => {
    // Xử lý tìm kiếm với các state: searchKeyword, selectedLocation, selectedEmploymentType
    console.log({
      keyword: searchKeyword,
      location: selectedLocation,
      employmentType: selectedEmploymentType,
    });
  };

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
            <input
              placeholder="Từ khóa công việc, kỹ năng..."
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
          </div>

          {/* Chọn địa điểm */}
          <div className={styles.inputGroup}>
            <i className="bi bi-geo-alt"></i>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
            >
              {locations.map((loc) => (
                <option key={loc.value} value={loc.value}>
                  {loc.label}
                </option>
              ))}
            </select>
          </div>

          {/* Chọn loại hình làm việc (Dynamic từ API) */}
          <div className={styles.inputGroup}>
            <i className="bi bi-briefcase"></i>
            <select
              value={selectedEmploymentType}
              onChange={(e) => setSelectedEmploymentType(e.target.value)}
            >
              <option value="">Loại hình làm việc (Tất cả)</option>
              {employmentTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <button className={styles.btnSearch} onClick={handleSearch}>
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
                <span className={styles.salary}>
                  $1500 - $2500 <span>/tháng</span>
                </span>
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