import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  jobService,
  categoryService,
  enumService,
  favoriteService,
} from '../../services';
import styles from './Jobs.module.scss';

// Avatar mặc định khi Client chưa thiết lập avatarUrl
const DEFAULT_AVATAR =
  'https://ui-avatars.com/api/?background=2563eb&color=fff&name=User';

// Mock Fallback tuân thủ DTO JobResponse mới
const MOCK_JOBS_FALLBACK = [
  {
    id: '1345',
    title: 'Senior Frontend Developer (React, TypeScript)',
    description:
      'Chúng tôi đang tìm kiếm một Senior Frontend Developer có kinh nghiệm sâu rộng với React và TypeScript...',
    companyName: 'TechNova Solutions',
    companyAddress: 'Hà Nội',
    experienceLevel: 'SENIOR',
    requiredExperienceYears: 3,
    employmentType: 'FULL_TIME',
    requiredSkills: ['React', 'TypeScript', 'SCSS'],
    minBudget: 1500,
    maxBudget: 2500,
    currency: 'USD',
    status: 'OPEN',
    createdAt: '2026-02-15T10:00:00Z',
    categories: [{ id: 'cat-1', name: 'IT / Phần mềm' }],
    client: {
      id: 'user-1',
      username: 'technova_hr',
      email: 'hr@technova.com',
      firstName: 'TechNova',
      lastName: 'HR',
      avatarUrl: '',
    },
  },
  {
    id: '2',
    title: 'UI/UX Designer (Figma, Design System)',
    description:
      'Dự án thiết kế lại toàn bộ hệ thống ứng dụng di động cho một startup FinTech...',
    companyName: 'Creative Minds Agency',
    companyAddress: 'TP. Hồ Chí Minh',
    experienceLevel: 'MID_LEVEL',
    requiredExperienceYears: 2,
    employmentType: 'FREELANCE',
    requiredSkills: ['Figma', 'UI/UX', 'Design System'],
    minBudget: 1000,
    maxBudget: 1800,
    currency: 'USD',
    status: 'OPEN',
    createdAt: '2026-02-18T08:30:00Z',
    categories: [{ id: 'cat-2', name: 'Thiết kế / Đồ họa' }],
    client: {
      id: 'user-2',
      username: 'creative_minds',
      email: 'contact@creativeminds.com',
      firstName: 'Creative',
      lastName: 'Agency',
      avatarUrl: 'https://i.pravatar.cc/150?img=33',
    },
  },
];

const ITEMS_PER_PAGE = 5;

function Jobs() {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [experienceLevels, setExperienceLevels] = useState([]);
  const [employmentTypes, setEmploymentTypes] = useState([]);

  // State bộ lọc
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('Tất cả địa điểm');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedExperiences, setSelectedExperiences] = useState([]);
  const [selectedType, setSelectedType] = useState('');
  const [sortBy, setSortBy] = useState('Phù hợp nhất');

  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch dữ liệu từ API Backend
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

  // Xử lý Lọc & Sắp xếp dữ liệu FE
  const filteredJobs = useMemo(() => {
    return jobs
      .filter((job) => {
        // 1. Tìm kiếm từ khóa
        if (searchTerm.trim() !== '') {
          const query = searchTerm.toLowerCase();
          const matchTitle = job.title?.toLowerCase().includes(query);
          const matchDesc = job.description?.toLowerCase().includes(query);
          const matchCompany = job.companyName?.toLowerCase().includes(query);
          const matchSkills = job.requiredSkills?.some((skill) =>
            skill.toLowerCase().includes(query)
          );
          if (!matchTitle && !matchDesc && !matchCompany && !matchSkills) {
            return false;
          }
        }

        // 2. Lọc Địa điểm
        if (location !== 'Tất cả địa điểm') {
          const address = job.companyAddress || '';
          if (!address.toLowerCase().includes(location.toLowerCase())) {
            return false;
          }
        }

        // 3. Lọc Danh mục
        if (selectedCategories.length > 0) {
          const hasCategory = job.categories?.some((cat) =>
            selectedCategories.includes(cat.id)
          );
          if (!hasCategory) return false;
        }

        // 4. Lọc Trình độ / Kinh nghiệm
        if (selectedExperiences.length > 0) {
          if (!selectedExperiences.includes(job.experienceLevel)) {
            return false;
          }
        }

        // 5. Lọc Hình thức
        if (selectedType !== '') {
          if (job.employmentType !== selectedType) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'Mới nhất') {
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        }
        if (sortBy === 'Lương cao nhất') {
          return (b.maxBudget || 0) - (a.maxBudget || 0);
        }
        return 0;
      });
  }, [
    jobs,
    searchTerm,
    location,
    selectedCategories,
    selectedExperiences,
    selectedType,
    sortBy,
  ]);

  // Reset về trang 1 khi thay đổi bộ lọc
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, location, selectedCategories, selectedExperiences, selectedType, sortBy]);

  // Tính toán Phân trang
  const totalPages = Math.ceil(filteredJobs.length / ITEMS_PER_PAGE) || 1;
  const paginatedJobs = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredJobs.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredJobs, currentPage]);

  // Format mức lương
  const formatSalary = (min, max, currency) => {
    if (!min && !max) return 'Thỏa thuận';
    const curr = currency || 'USD';
    if (min && max) return `${min.toLocaleString()} - ${max.toLocaleString()} ${curr}`;
    if (min) return `Từ ${min.toLocaleString()} ${curr}`;
    return `Đến ${max.toLocaleString()} ${curr}`;
  };

  // Chuyển hướng tới trang chi tiết công việc
  const handleJobCardClick = (jobId) => {
    navigate(`/job/${jobId}`);
  };

  // Yêu thích công việc (chặn nổi bọt sự kiện để không bị trigger click thẻ card)
  const toggleFavorite = async (e, jobId) => {
    e.stopPropagation();
    try {
      const response = await favoriteService.toggleFavoriteJob(jobId);
      const isFavorited = response?.data;

      setFavorites((prev) =>
        isFavorited ? [...prev, jobId] : prev.filter((id) => id !== jobId)
      );
    } catch (error) {
      console.error('Lỗi khi lưu/bỏ lưu công việc:', error);
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
    setSortBy('Phù hợp nhất');
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
                  <p style={{ fontSize: '12px', color: '#6c757d' }}>
                    Đang cập nhật danh mục...
                  </p>
                )}
              </div>
            </div>

            {/* Experience Filter */}
            <div className={styles.filterGroup}>
              <h3>Trình độ / Kinh nghiệm</h3>
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
                  <p style={{ fontSize: '12px', color: '#6c757d' }}>
                    Đang cập nhật kinh nghiệm...
                  </p>
                )}
              </div>
            </div>

            {/* Employment Type Filter */}
            <div className={styles.filterGroup}>
              <h3>Hình thức làm việc</h3>
              <div className={styles.tagList}>
                <span
                  className={`${styles.tag} ${
                    selectedType === '' ? styles.active : ''
                  }`}
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
              Tìm thấy <strong>{filteredJobs.length}</strong> việc làm phù hợp
            </p>
            <div className={styles.sortSelectGroup}>
              <span>Sắp xếp theo:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="Phù hợp nhất">Phù hợp nhất</option>
                <option value="Mới nhất">Mới nhất</option>
                <option value="Lương cao nhất">Lương cao nhất</option>
              </select>
            </div>
          </div>

          {/* Job List */}
          <div className={styles.jobList}>
            {loading ? (
              <p>Đang tải danh sách công việc...</p>
            ) : paginatedJobs.length > 0 ? (
              paginatedJobs.map((job) => {
                const isFav = favorites.includes(job.id);

                // Ưu tiên avatarUrl của Client từ UserResponse, fallback nếu null/rỗng
                const clientAvatar = job.client?.avatarUrl || DEFAULT_AVATAR;

                // Tên người tuyển dụng
                const clientName = job.client
                  ? `${job.client.firstName || ''} ${job.client.lastName || ''}`.trim() || job.client.username
                  : 'Người tuyển dụng';

                return (
                  <div
                    key={job.id}
                    className={styles.jobCard}
                    onClick={() => handleJobCardClick(job.id)}
                  >
                    <div className={styles.cardIndicator} />
                    <div className={styles.companyLogo}>
                      <img
                        src={clientAvatar}
                        alt={clientName}
                        onError={(e) => {
                          e.target.src = DEFAULT_AVATAR;
                        }}
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
                        <strong>{job.companyName || clientName}</strong>
                        {job.client && ` (${clientName})`} •{' '}
                        {job.companyAddress || 'Toàn quốc'}
                      </p>

                      {/* Badges */}
                      <div className={styles.badgeGroup}>
                        {job.employmentType && (
                          <span className={styles.badge}>
                            {job.employmentType}
                          </span>
                        )}
                        {job.experienceLevel && (
                          <span className={styles.badge}>
                            {job.experienceLevel}
                            {job.requiredExperienceYears
                              ? ` (${job.requiredExperienceYears} năm)`
                              : ''}
                          </span>
                        )}
                        {job.categories?.map((cat) => (
                          <span key={cat.id} className={styles.badge}>
                            {cat.name}
                          </span>
                        ))}
                        <span
                          className={`${styles.badge} ${styles.salaryBadge}`}
                        >
                          <i className="bi bi-cash-stack"></i>{' '}
                          {formatSalary(
                            job.minBudget,
                            job.maxBudget,
                            job.currency
                          )}
                        </span>
                      </div>

                      {/* Required Skills */}
                      {job.requiredSkills?.length > 0 && (
                        <div
                          className={styles.badgeGroup}
                          style={{ marginBottom: '8px' }}
                        >
                          {job.requiredSkills.map((skill, idx) => (
                            <span
                              key={idx}
                              className={styles.badge}
                              style={{ opacity: 0.8 }}
                            >
                              #{skill}
                            </span>
                          ))}
                        </div>
                      )}

                      <p className={styles.jobDescription}>{job.description}</p>
                    </div>
                  </div>
                );
              })
            ) : (
              <p>Không tìm thấy công việc nào phù hợp với bộ lọc.</p>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className={styles.pagination}>
              <button
                className={styles.pageBtn}
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
              >
                <i className="bi bi-chevron-left"></i>
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (pageNum) => (
                  <button
                    key={pageNum}
                    className={`${styles.pageBtn} ${
                      currentPage === pageNum ? styles.active : ''
                    }`}
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </button>
                )
              )}

              <button
                className={styles.pageBtn}
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
              >
                <i className="bi bi-chevron-right"></i>
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Jobs;