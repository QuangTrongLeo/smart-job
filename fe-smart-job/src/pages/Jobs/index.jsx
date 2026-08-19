import React, { useState, useEffect } from 'react';
import {
  jobService,
  categoryService,
  enumService,
  favoriteService,
} from '../../services';
import styles from './Jobs.module.scss';

const MOCK_JOBS_FALLBACK = [
  {
    id: '1',
    title: 'Senior Frontend Developer (React, TypeScript)',
    company: 'TechNova Solutions',
    location: 'Hà Nội',
    type: 'Toàn thời gian',
    experience: '3-5 năm',
    salary: '$1500 - $2500',
    description:
      'Chúng tôi đang tìm kiếm một Senior Frontend Developer có kinh nghiệm sâu rộng với React và TypeScript...',
    logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCNyjBugPY_mJcbjx8Iu7MjwoeRz9J1-qk-FZSJmJ61t3W73mUygue0SxBQ2CO1I74ma2WK-mTlPB8lqeme9YNS42yclUdj01Vz9Kgn_xR7XQLTC78hM-axjf19nSNQxVWtFtEEzelrCKYTW2OYOSGtr17rOYKv4OjILK5JUB0i5IGVxUlNcK8VsTqBnHGFiaiD5YoVO0-2wySotqXRGBo4HNBQ7dCpA3OS4rArJSMnY0TsrzPt-KXu',
  },
  {
    id: '2',
    title: 'UI/UX Designer (Figma, Design System)',
    company: 'Creative Minds Agency',
    location: 'TP. Hồ Chí Minh',
    type: 'Freelance',
    experience: 'Từ xa',
    salary: 'Thỏa thuận',
    description:
      'Dự án thiết kế lại toàn bộ hệ thống ứng dụng di động cho một startup FinTech...',
    logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuByangvM_DgNLXORUb9JZg2ReJH_DR9cIHaOJaFUwBcaOZDx3efsh4rj9gvmuK-6qwZwyy88HcuVdAYtCpJcuW93cEtdQ58tn-dkVGTq_e3NzGNTozHmGoA6ECORRpehsunzj1VggoRWzCOgCDVJ6UF8cW3sVaD5fZKDJYYZW1ccULFfncSoX2SBGZP9pz8-SE7OTfRaU6W92rWwPpzD1ckTVqc1Mh7sVM1tjZZbZnUa-O2cbtn8gEs',
  },
];

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [experienceLevels, setExperienceLevels] = useState([]);
  const [employmentTypes, setEmploymentTypes] = useState([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('Tất cả địa điểm');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedExperiences, setSelectedExperiences] = useState([]);
  const [selectedType, setSelectedType] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load danh sách filter & công việc từ Backend
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [
          jobsRes,
          categoriesRes,
          expRes,
          empTypesRes,
          favsRes,
        ] = await Promise.allSettled([
          jobService.getAllJobs(),
          categoryService.getAllCategories(),
          enumService.getExperienceLevels(),
          enumService.getEmploymentTypes(),
          favoriteService.getMyFavoriteJobs(),
        ]);

        if (jobsRes.status === 'fulfilled' && jobsRes.value?.data?.length > 0) {
          setJobs(jobsRes.value.data);
        } else {
          setJobs(MOCK_JOBS_FALLBACK);
        }

        if (categoriesRes.status === 'fulfilled' && categoriesRes.value?.data) {
          setCategories(categoriesRes.value.data);
        }

        if (expRes.status === 'fulfilled' && expRes.value?.data) {
          setExperienceLevels(expRes.value.data);
        }

        if (empTypesRes.status === 'fulfilled' && empTypesRes.value?.data) {
          setEmploymentTypes(empTypesRes.value.data);
        }

        if (favsRes.status === 'fulfilled' && favsRes.value?.data) {
          const favIds = favsRes.value.data.map((item) => item.jobId || item.id);
          setFavorites(favIds);
        }
      } catch (error) {
        console.error('Lỗi kết nối dữ liệu:', error);
        setJobs(MOCK_JOBS_FALLBACK);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Bật/tắt trạng thái yêu thích công việc
  const toggleFavorite = async (e, jobId) => {
    e.stopPropagation();
    try {
      const response = await favoriteService.toggleFavoriteJob(jobId);
      const isFavorited = response?.data;

      setFavorites((prev) =>
        isFavorited
          ? [...prev, jobId]
          : prev.filter((id) => id !== jobId)
      );
    } catch (error) {
      console.error('Lỗi khi lưu/bỏ lưu công việc:', error);
      // Fallback toggle state ở local nếu không có auth hoặc lỗi API
      setFavorites((prev) =>
        prev.includes(jobId) ? prev.filter((id) => id !== jobId) : [...prev, jobId]
      );
    }
  };

  const handleCategoryChange = (catId) => {
    setSelectedCategories((prev) =>
      prev.includes(catId) ? prev.filter((id) => id !== catId) : [...prev, catId]
    );
  };

  const handleExperienceChange = (exp) => {
    setSelectedExperiences((prev) =>
      prev.includes(exp) ? prev.filter((item) => item !== exp) : [...prev, exp]
    );
  };

  const clearFilters = () => {
    setSearchTerm('');
    setLocation('Tất cả địa điểm');
    setSelectedCategories([]);
    setSelectedExperiences([]);
    setSelectedType('');
  };

  return (
    <div className={styles.jobsPage}>
      <div className={styles.mainLayout}>
        {/* Sidebar Filter */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarInner}>
            <div className={styles.sidebarHeader}>
              <h2>Bộ lọc</h2>
              <button className={styles.clearBtn} onClick={clearFilters}>
                Xóa lọc
              </button>
            </div>

            {/* Category Filter */}
            <div className={styles.filterGroup}>
              <h3>Danh mục</h3>
              <div className={styles.checkboxList}>
                {categories.length > 0 ? (
                  categories.map((cat) => (
                    <label key={cat.id} className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(cat.id)}
                        onChange={() => handleCategoryChange(cat.id)}
                      />
                      <span>{cat.name}</span>
                    </label>
                  ))
                ) : (
                  <>
                    <label className={styles.checkboxLabel}>
                      <input type="checkbox" />
                      <span>IT / Phần mềm</span>
                    </label>
                    <label className={styles.checkboxLabel}>
                      <input type="checkbox" />
                      <span>Marketing / PR</span>
                    </label>
                  </>
                )}
              </div>
            </div>

            {/* Experience Filter */}
            <div className={styles.filterGroup}>
              <h3>Kinh nghiệm</h3>
              <div className={styles.checkboxList}>
                {experienceLevels.length > 0 ? (
                  experienceLevels.map((exp) => (
                    <label key={exp} className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={selectedExperiences.includes(exp)}
                        onChange={() => handleExperienceChange(exp)}
                      />
                      <span>{exp}</span>
                    </label>
                  ))
                ) : (
                  <label className={styles.checkboxLabel}>
                    <input type="checkbox" />
                    <span>1 - 3 năm</span>
                  </label>
                )}
              </div>
            </div>

            {/* Job Type Filter */}
            <div className={styles.filterGroup}>
              <h3>Hình thức</h3>
              <div className={styles.tagList}>
                <span
                  className={`${styles.tag} ${selectedType === '' ? styles.active : ''}`}
                  onClick={() => setSelectedType('')}
                >
                  Tất cả
                </span>
                {employmentTypes.map((type) => (
                  <span
                    key={type}
                    className={`${styles.tag} ${
                      selectedType === type ? styles.active : ''
                    }`}
                    onClick={() => setSelectedType(type)}
                  >
                    {type}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className={styles.mainContent}>
          {/* Search Bar */}
          <div className={styles.searchBar}>
            <div className={styles.searchGrid}>
              <div className={styles.inputField}>
                <i className="bi bi-search"></i>
                <input
                  type="text"
                  placeholder="Tìm kiếm công việc, kỹ năng, công ty..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className={`${styles.inputField} ${styles.locationField}`}>
                <i className="bi bi-geo-alt"></i>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                >
                  <option>Tất cả địa điểm</option>
                  <option>Hà Nội</option>
                  <option>TP. Hồ Chí Minh</option>
                  <option>Đà Nẵng</option>
                </select>
                <i className={`bi bi-chevron-down ${styles.arrowIcon}`}></i>
              </div>
              <button className={styles.searchBtn}>
                <i className="bi bi-search"></i>
                Tìm việc
              </button>
            </div>
          </div>

          {/* Sorting Bar */}
          <div className={styles.sortBar}>
            <p className={styles.resultText}>
              Tìm thấy <strong>{jobs.length}</strong> việc làm phù hợp
            </p>
            <div className={styles.sortSelectGroup}>
              <span>Sắp xếp theo:</span>
              <select>
                <option>Phù hợp nhất</option>
                <option>Mới nhất</option>
                <option>Lương cao nhất</option>
              </select>
            </div>
          </div>

          {/* Job List */}
          <div className={styles.jobList}>
            {loading ? (
              <p>Đang tải danh sách công việc...</p>
            ) : (
              jobs.map((job) => {
                const isFav = favorites.includes(job.id);
                return (
                  <div key={job.id} className={styles.jobCard}>
                    <div className={styles.cardIndicator} />
                    <div className={styles.companyLogo}>
                      <img
                        src={
                          job.logo ||
                          'https://via.placeholder.com/60?text=Job'
                        }
                        alt={job.company || 'Company'}
                      />
                    </div>
                    <div className={styles.jobDetails}>
                      <div className={styles.jobCardHeader}>
                        <h3 className={styles.jobTitle}>{job.title}</h3>
                        <button
                          className={styles.favoriteBtn}
                          onClick={(e) => toggleFavorite(e, job.id)}
                        >
                          <i
                            className={
                              isFav
                                ? 'bi bi-heart-fill text-danger'
                                : 'bi bi-heart'
                            }
                          ></i>
                        </button>
                      </div>
                      <p className={styles.companyInfo}>
                        {job.company || 'N/A'} • {job.location || 'Toàn quốc'}
                      </p>
                      <div className={styles.badgeGroup}>
                        {job.type && <span className={styles.badge}>{job.type}</span>}
                        {job.experience && (
                          <span className={styles.badge}>{job.experience}</span>
                        )}
                        <span className={`${styles.badge} ${styles.salaryBadge}`}>
                          <i className="bi bi-cash-stack"></i>{' '}
                          {job.salary || 'Thỏa thuận'}
                        </span>
                      </div>
                      <p className={styles.jobDescription}>{job.description}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Pagination */}
          <div className={styles.pagination}>
            <button className={styles.pageBtn} disabled>
              <i className="bi bi-chevron-left"></i>
            </button>
            <button className={`${styles.pageBtn} ${styles.active}`}>1</button>
            <button className={styles.pageBtn}>2</button>
            <button className={styles.pageBtn}>3</button>
            <span className={styles.ellipsis}>...</span>
            <button className={styles.pageBtn}>
              <i className="bi bi-chevron-right"></i>
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Jobs;