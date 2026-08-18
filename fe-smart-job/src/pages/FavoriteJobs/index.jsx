import React from 'react';
import styles from './FavoriteJobs.module.scss';

const FAVORITE_JOBS = [
  {
    id: 1,
    title: 'Senior Frontend Developer (React/Vue)',
    company: 'TechNova Solutions',
    logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAKGMdzaDa8A2LvHcskWkkBP3ZxZdZ8Rff3DbQNk-wRZVTMcajIdB243AbEPkiMsHZ-LWIxA4gBHbYghqfOIsHK7P1_Vo2tliCq_MpD9YtzD1tbp9kYMz1eat9bnq_XdSoHzn-5ZIUNzgezOU6KCbSGVOTSBf_B_Ck1oNEGnzQa2SBevutuFByyu9eLpYjAV9xsKMlNbJ7fixyYjTPuHCjcDIMitiSJJ4guUFiGWv9s8ChTbHrAbv3E',
    location: 'Hà Nội (Hybrid)',
    salary: '$1500 - $2500',
    skills: ['ReactJS', 'TypeScript', 'TailwindCSS'],
    savedAt: 'Đã lưu 2 ngày trước',
  },
  {
    id: 2,
    title: 'UI/UX Designer (Figma/Webflow)',
    company: 'Creative Pulse',
    logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBENvvDn9U0bVPXTzs4zaFdYYinG7AzamNZjj2Xu9hiPldDwIrIbdmWD_s0wDWLx04Pdc2akz65pCxvOQ4bO_Q4jhcRnECueMGUTNmHXxoDLn04sRU7itgnGdN9kfsH-vE4XMA1iHTzJT3YXKgtrYZ2ctinGVemPRBB8dMuQAe8vFfQHu7v9Td1_xA_7tDKJWt1wvF7Z7AVdnlmOPNTjEqOfmGd6apUdCvNdJ4FEwCz92r99GNZwTce',
    location: 'Remote',
    salary: 'Thỏa thuận',
    skills: ['Figma', 'Prototyping', 'Webflow'],
    savedAt: 'Đã lưu 3 ngày trước',
  },
  {
    id: 3,
    title: 'Digital Marketing Specialist',
    company: 'GrowthX Agency',
    logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCdDlLVRtu2FLDv6zHC9eTh2LPDdF3KnNLlcApTDFpdDPMIncbefh21sL3wi4vKuRzjitCJ_mHvpjUcpHRvGuofcQPw67a7kL0TinmD1_aoEtHf__VxQUGS0hDnsGscpl1HQcAT5-rOk_h39P4ovkM1qU97s3EIfhhkprc1tVCA0m3vK6o3gHCF1I7HkMfhBiFvpUaIIW9YPxUr1Y0WOBpmzvVxKMX1H5xShvCrgF9_OareXY_lAazK',
    location: 'TP. Hồ Chí Minh',
    salary: '15M - 25M VNĐ',
    skills: ['SEO', 'Google Ads', 'Analytics'],
    savedAt: 'Đã lưu 1 tuần trước',
  },
];

const FavoriteJobs = () => {
  return (
    <div className={styles.jobFavoritePage}>
      <main className={styles.container}>
        {/* Header Section */}
        <div className={styles.header}>
          <div className={styles.titleBox}>
            <h1 className={styles.title}>Việc làm đã lưu</h1>
            <p className={styles.subtitle}>
              Đang lưu {FAVORITE_JOBS.length} việc làm
            </p>
          </div>

          <div className={styles.filterGroup}>
            <div className={styles.searchBox}>
              <span className={`material-symbols-outlined ${styles.searchIcon}`}>
                search
              </span>
              <input
                type="text"
                className={styles.searchInput}
                placeholder="Tìm trong danh sách lưu..."
              />
            </div>
            <button className={styles.btnFilter} aria-label="Lọc">
              <span className="material-symbols-outlined">filter_list</span>
            </button>
          </div>
        </div>

        {/* Cards Grid */}
        <div className={styles.gridList}>
          {FAVORITE_JOBS.map((job) => (
            <div key={job.id} className={styles.jobCard}>
              <button className={styles.btnBookmark} aria-label="Bỏ lưu">
                <span className="material-symbols-outlined">bookmark</span>
              </button>

              <div className={styles.cardHeader}>
                <img
                  src={job.logo}
                  alt={job.company}
                  className={styles.companyLogo}
                />
                <div className={styles.headerInfo}>
                  <h2 className={styles.jobTitle}>{job.title}</h2>
                  <p className={styles.companyName}>{job.company}</p>
                </div>
              </div>

              <div className={styles.badgeGroup}>
                <span className={styles.badgeLocation}>
                  <span className="material-symbols-outlined">location_on</span>{' '}
                  {job.location}
                </span>
                <span className={styles.badgeSalary}>
                  <span className="material-symbols-outlined">payments</span>{' '}
                  {job.salary}
                </span>
              </div>

              <div className={styles.skillsBox}>
                <p className={styles.skillsLabel}>Kỹ năng yêu cầu:</p>
                <div className={styles.tags}>
                  {job.skills.map((skill, index) => (
                    <span key={index} className={styles.skillTag}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className={styles.cardFooter}>
                <span className={styles.savedTime}>{job.savedAt}</span>
                <button className={styles.btnApply}>Ứng tuyển ngay</button>
              </div>
            </div>
          ))}
        </div>

        {/* Action Button */}
        <div className={styles.loadMoreBox}>
          <button className={styles.btnLoadMore}>Tải thêm việc làm</button>
        </div>
      </main>
    </div>
  );
};

export default FavoriteJobs;