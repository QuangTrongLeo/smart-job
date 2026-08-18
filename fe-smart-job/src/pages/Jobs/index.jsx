import React, { useState } from 'react';
import styles from './Jobs.module.scss';

const JOBS_DATA = [
  {
    id: 1,
    title: 'Senior Frontend Developer (React, TypeScript)',
    company: 'TechNova Solutions',
    location: 'Hà Nội',
    type: 'Toàn thời gian',
    experience: '3-5 năm',
    salary: '$1500 - $2500',
    description:
      'Chúng tôi đang tìm kiếm một Senior Frontend Developer có kinh nghiệm sâu rộng với React và TypeScript để xây dựng các nền tảng web hiện đại, hiệu suất cao. Bạn sẽ làm việc chặt chẽ với đội ngũ thiết kế và backend...',
    logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCNyjBugPY_mJcbjx8Iu7MjwoeRz9J1-qk-FZSJmJ61t3W73mUygue0SxBQ2CO1I74ma2WK-mTlPB8lqeme9YNS42yclUdj01Vz9Kgn_xR7XQLTC78hM-axjf19nSNQxVWtFtEEzelrCKYTW2OYOSGtr17rOYKv4OjILK5JUB0i5IGVxUlNcK8VsTqBnHGFiaiD5YoVO0-2wySotqXRGBo4HNBQ7dCpA3OS4rArJSMnY0TsrzPt-KXu',
  },
  {
    id: 2,
    title: 'UI/UX Designer (Figma, Design System)',
    company: 'Creative Minds Agency',
    location: 'TP. Hồ Chí Minh',
    type: 'Freelance',
    experience: 'Từ xa',
    salary: 'Thỏa thuận',
    description:
      'Dự án thiết kế lại toàn bộ hệ thống ứng dụng di động cho một startup FinTech. Yêu cầu thành thạo Figma, có kinh nghiệm xây dựng Design System và hiểu biết tốt về trải nghiệm người dùng trên thiết bị di động.',
    logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuByangvM_DgNLXORUb9JZg2ReJH_DR9cIHaOJaFUwBcaOZDx3efsh4rj9gvmuK-6qwZwyy88HcuVdAYtCpJcuW93cEtdQ58tn-dkVGTq_e3NzGNTozHmGoA6ECORRpehsunzj1VggoRWzCOgCDVJ6UF8cW3sVaD5fZKDJYYZW1ccULFfncSoX2SBGZP9pz8-SE7OTfRaU6W92rWwPpzD1ckTVqc1Mh7sVM1tjZZbZnUa-O2cbtn8gEs',
  },
  {
    id: 3,
    title: 'Chuyên Viên Digital Marketing',
    company: 'Global Finance Group',
    location: 'Đà Nẵng',
    type: 'Toàn thời gian',
    experience: '1-3 năm',
    salary: '15M - 25M VNĐ',
    description:
      'Lập kế hoạch và triển khai các chiến dịch quảng cáo trên Google Ads, Facebook Ads. Tối ưu hóa tỷ lệ chuyển đổi và báo cáo hiệu suất định kỳ. Yêu cầu có tư duy phân tích dữ liệu tốt.',
    logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCJBGPJH9N7Y_cv3Mp0lo9VwcyukkuVNlTdmE7KL4X2yxe_A1nKJNEe-W-Golsvcyab6mXlmIlVbqoWtJ61SZ4spt3iGjosgWgYVBfU1zusOWn8V6t-JPewA_JT1VHAasKz7CO00E7qV0IUHAoTwuIsoeNdSItZW8LUh67oC5UArChhaNhxERLiFpghEMfGS9fVlRyhx4vsMbwujnbqPImjbN-ZwW6ft9QdetL94-MKDJa7vpFd75-p',
  },
];

function Jobs() {
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('Tất cả địa điểm');
  const [favorites, setFavorites] = useState([]);

  const toggleFavorite = (e, id) => {
    e.stopPropagation();
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className={styles.jobsPage}>
      {/* Main Layout Container */}
      <div className={styles.mainLayout}>
        {/* Sidebar Filter (Left) */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarInner}>
            <div className={styles.sidebarHeader}>
              <h2>Bộ lọc</h2>
              <button className={styles.clearBtn}>Xóa lọc</button>
            </div>

            {/* Category Filter */}
            <div className={styles.filterGroup}>
              <h3>Danh mục</h3>
              <div className={styles.checkboxList}>
                <label className={styles.checkboxLabel}>
                  <input type="checkbox" />
                  <span>IT / Phần mềm (450)</span>
                </label>
                <label className={styles.checkboxLabel}>
                  <input type="checkbox" />
                  <span>Marketing / PR (320)</span>
                </label>
                <label className={styles.checkboxLabel}>
                  <input type="checkbox" />
                  <span>Thiết kế / Sáng tạo (280)</span>
                </label>
              </div>
            </div>

            {/* Experience Filter */}
            <div className={styles.filterGroup}>
              <h3>Kinh nghiệm</h3>
              <div className={styles.checkboxList}>
                <label className={styles.checkboxLabel}>
                  <input type="checkbox" />
                  <span>Chưa có kinh nghiệm</span>
                </label>
                <label className={styles.checkboxLabel}>
                  <input type="checkbox" defaultChecked />
                  <span>1 - 3 năm</span>
                </label>
                <label className={styles.checkboxLabel}>
                  <input type="checkbox" />
                  <span>3 - 5 năm</span>
                </label>
              </div>
            </div>

            {/* Job Type Filter Tags */}
            <div className={styles.filterGroup}>
              <h3>Hình thức</h3>
              <div className={styles.tagList}>
                <span className={styles.tag}>Toàn thời gian</span>
                <span className={`${styles.tag} ${styles.active}`}>
                  Bán thời gian
                </span>
                <span className={styles.tag}>Freelance</span>
                <span className={styles.tag}>Từ xa (Remote)</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content (Right) */}
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
              Tìm thấy <strong>2.356</strong> việc làm phù hợp
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
            {JOBS_DATA.map((job) => {
              const isFav = favorites.includes(job.id);
              return (
                <div key={job.id} className={styles.jobCard}>
                  <div className={styles.cardIndicator} />
                  <div className={styles.companyLogo}>
                    <img src={job.logo} alt={job.company} />
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
                      {job.company} • {job.location}
                    </p>
                    <div className={styles.badgeGroup}>
                      <span className={styles.badge}>{job.type}</span>
                      <span className={styles.badge}>{job.experience}</span>
                      <span className={`${styles.badge} ${styles.salaryBadge}`}>
                        <i className="bi bi-cash-stack"></i> {job.salary}
                      </span>
                    </div>
                    <p className={styles.jobDescription}>{job.description}</p>
                  </div>
                </div>
              );
            })}
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
            <button className={styles.pageBtn}>24</button>
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