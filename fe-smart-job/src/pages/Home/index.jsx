import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { enumService, jobService } from '../../services';
import styles from './Home.module.scss';

const DEFAULT_AVATAR = 'https://ui-avatars.com/api/?background=dae2fd&color=004ac6&name=SmartJob';

function Home() {
  const [employmentTypes, setEmploymentTypes] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedEmploymentType, setSelectedEmploymentType] = useState('');
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [jobsError, setJobsError] = useState('');

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

  useEffect(() => {
    const fetchFeaturedJobs = async () => {
      try {
        setJobsLoading(true);
        setJobsError('');
        const response = await jobService.getAllJobs();
        const jobs = response?.data?.data || response?.data || [];
        setFeaturedJobs(Array.isArray(jobs) ? jobs.slice(0, 6) : []);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách công việc:', error);
        setJobsError('Không thể tải danh sách công việc lúc này.');
      } finally {
        setJobsLoading(false);
      }
    };

    fetchFeaturedJobs();
  }, []);

  const formatBudget = (job) => {
    const currency = job.currency || 'USD';
    const minBudget = job.minBudget != null ? Number(job.minBudget).toLocaleString('vi-VN') : null;
    const maxBudget = job.maxBudget != null ? Number(job.maxBudget).toLocaleString('vi-VN') : null;

    if (minBudget && maxBudget) return `${minBudget} - ${maxBudget} ${currency}`;
    if (minBudget) return `Từ ${minBudget} ${currency}`;
    if (maxBudget) return `Đến ${maxBudget} ${currency}`;
    return 'Thỏa thuận';
  };

  const formatPostedDate = (dateValue) => {
    if (!dateValue) return 'Mới đăng';
    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) return 'Mới đăng';
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const getClientName = (client) => {
    if (!client) return 'Nhà tuyển dụng';
    const fullName = `${client.firstName || ''} ${client.lastName || ''}`.trim();
    return fullName || client.username || client.email || 'Nhà tuyển dụng';
  };

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

          {jobsLoading && <div className={styles.jobsState}><i className="bi bi-arrow-repeat"></i><span>Đang tải công việc...</span></div>}
          {!jobsLoading && jobsError && <div className={styles.jobsState}><i className="bi bi-exclamation-circle"></i><span>{jobsError}</span></div>}
          {!jobsLoading && !jobsError && featuredJobs.length === 0 && <div className={styles.jobsState}><i className="bi bi-briefcase"></i><span>Chưa có công việc nổi bật.</span></div>}

          {!jobsLoading && !jobsError && featuredJobs.length > 0 && (
            <div className={styles.gridCards}>
              {featuredJobs.map((job) => {
                const clientName = getClientName(job.client);
                const skills = job.requiredSkills || [];

                return (
                  <Link to={`/job/${job.id}`} className={styles.jobCard} key={job.id}>
                    <div className={styles.cardHeader}>
                      <div className={styles.companyInfo}>
                        <img
                          className={styles.companyLogo}
                          src={job.client?.avatarUrl || DEFAULT_AVATAR}
                          alt={clientName}
                          onError={(event) => { event.currentTarget.src = DEFAULT_AVATAR; }}
                        />
                        <div>
                          <h3 className={styles.jobTitle}>{job.title || 'Công việc mới'}</h3>
                          <p className={styles.companyName}>{job.companyName || clientName}</p>
                        </div>
                      </div>
                      <i className={`bi bi-arrow-up-right ${styles.cardArrow}`}></i>
                    </div>

                    <div className={styles.cardTags}>
                      {skills.slice(0, 3).map((skill) => <span className={styles.skillBadge} key={skill}>{skill}</span>)}
                      {job.employmentType && <span className={styles.typeBadge}>{job.employmentType}</span>}
                    </div>

                    <div className={styles.cardFooter}>
                      <span className={styles.salary}>{formatBudget(job)}</span>
                      <span className={styles.timePosted}>{formatPostedDate(job.createdAt)}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default Home;