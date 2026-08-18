import React from 'react';
import styles from './FavoriteFreelancers.module.scss';

const FREELANCERS_DATA = [
  {
    id: 1,
    name: 'Trần Văn A',
    role: 'Senior UI/UX Designer',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDPAHHXijWBNwZrQV7rtmnIrA2OLO0Gp26a-Akng-mRjJzfJhJ2YWbiUmUdW5_-hDMqQrchrOxAmr7UsM0FkummoRp8a5S3fqCcVuD-ULHFcZlOBXNDG4R66SSCXCi6LFi2SR1Yqgbkcg_IH4TC1p1SUJhYXvQjFUJlNClGk8EAVjW7PC7GeiHg9X0lkJ02COoFx8mnMx3kU813AUUVlZ-EyUNojmcvVA81WIi7lU05S_wifKLvexwz',
    rating: 4.9,
    reviewsCount: 120,
    skills: ['Figma', 'Prototyping', 'User Research'],
    hourlyRate: 25,
    successRate: 98,
  },
  {
    id: 2,
    name: 'Nguyễn Thị B',
    role: 'Fullstack Developer',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBildk6ZInzJJMJ5_vvD_vlot0NPnr84_MN-KYwMY4qNlC354NIKAyQlW62K82E0gNFWE3J_tRn-Zo1VdgJuDW4f1qxK8EjgsjPYU1w-YCmbPvma-GxW42Z0kCFC5OkBC3oPygFiYM_o9JhtNnRCnYulcfMwNPQbb9dpx3XUe5wXxKoXYAcxb_yaq56jys33q6oeCui3MQ8LMqiZ8pcNwyoD6p5Whsy5LD2CJk04EzOWQGuS5nuGmXh',
    rating: 5.0,
    reviewsCount: 85,
    skills: ['React', 'Node.js', 'TypeScript'],
    hourlyRate: 35,
    successRate: 100,
  },
  {
    id: 3,
    name: 'Lê Văn C',
    role: 'Mobile App Expert',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAmyg3lCCh1KHZfxrC643G61UezC3cXU2vylIQIec4-yg9hqw8kWPCRY0qYKhGOFPh9ITOX9VBUiHzviHlbCR6DlrOw_M0tw1W9J1qHUSoSBOrk6zU8GezH6YMZV2vCKOgwi73al6XfuFzZaxlh7QcnRNVpJvZJbcmxz13LUAi726fZ2UlEt_E6VNCuxea1gnpMPBIRv8oMe2pN0bfUMMSkDKinshVQ_JrCxSM1oS4pAJwcnfL51kMd',
    rating: 4.8,
    reviewsCount: 210,
    skills: ['Flutter', 'Dart', 'Firebase'],
    hourlyRate: 30,
    successRate: 95,
  },
];

const FavoriteFreelancers = () => {
  return (
    <div className={styles.favoriteFreelancersPage}>
      <main className={styles.container}>
        {/* Page Header */}
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Freelancer đã lưu</h1>
            <p className={styles.subtitle}>
              Đang lưu {FREELANCERS_DATA.length} Freelancer
            </p>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className={styles.filterBar}>
          <div className={styles.searchBox}>
            <span className={`material-symbols-outlined ${styles.searchIcon}`}>
              search
            </span>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Tìm kiếm trong danh sách đã lưu..."
            />
          </div>

          <div className={styles.filterCategories}>
            <button className={styles.btnFilterActive}>Tất cả</button>
            <button className={styles.btnFilter}>UI/UX Design</button>
            <button className={styles.btnFilter}>Web Dev</button>
            <button className={styles.btnFilter}>Mobile Dev</button>
            <button className={styles.btnFilter}>
              <span className={`material-symbols-outlined ${styles.tuneIcon}`}>
                tune
              </span>
              Bộ lọc khác
            </button>
          </div>
        </div>

        {/* Freelancer Grid */}
        <div className={styles.gridList}>
          {FREELANCERS_DATA.map((freelancer) => (
            <div key={freelancer.id} className={styles.card}>
              <button className={styles.btnFavorite} aria-label="Bỏ yêu thích">
                <span className="material-symbols-outlined">favorite</span>
              </button>

              <div className={styles.cardHeader}>
                <img
                  src={freelancer.avatar}
                  alt={freelancer.name}
                  className={styles.avatar}
                />
                <div className={styles.freelancerInfo}>
                  <h3 className={styles.name}>{freelancer.name}</h3>
                  <p className={styles.role}>{freelancer.role}</p>
                  <div className={styles.ratingBox}>
                    <span className={`material-symbols-outlined ${styles.starIcon}`}>
                      star
                    </span>
                    <span className={styles.ratingScore}>{freelancer.rating}</span>
                    <span>({freelancer.reviewsCount} đánh giá)</span>
                  </div>
                </div>
              </div>

              <div className={styles.skillsGroup}>
                {freelancer.skills.map((skill, index) => (
                  <span key={index} className={styles.skillTag}>
                    {skill}
                  </span>
                ))}
              </div>

              <div className={styles.statsRow}>
                <div className={styles.rateBox}>
                  <span className={styles.rateValue}>${freelancer.hourlyRate}</span>
                  <span className={styles.rateUnit}>/giờ</span>
                </div>
                <div className={styles.successRateBox}>
                  <span className={styles.successLabel}>Tỷ lệ thành công</span>
                  <span className={styles.successValue}>
                    {freelancer.successRate}%
                  </span>
                </div>
              </div>

              <div className={styles.actionGroup}>
                <button className={styles.btnContact}>Liên hệ</button>
                <button className={styles.btnInvite}>Mời làm việc</button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default FavoriteFreelancers;