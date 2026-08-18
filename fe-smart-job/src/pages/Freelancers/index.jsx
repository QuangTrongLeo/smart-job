import React from 'react';
import styles from './Freelancers.module.scss';

const FREELANCERS_DATA = [
  {
    id: 1,
    name: 'Trần Thị Kim Chi',
    role: 'UI/UX Designer',
    rating: 4.9,
    location: 'Hà Nội, VN',
    bio: 'Chuyên gia thiết kế UI/UX với hơn 4 năm kinh nghiệm. Thế mạnh về thiết kế hệ thống (Design System) và tối ưu hóa trải nghiệm người dùng (UX) cho các ứng dụng SaaS và thương mại điện tử.',
    skills: ['Figma', 'Prototyping', 'User Research'],
    price: '$25/hr',
    projects: 42,
    successRate: '98%',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDFrc8kCbOWU67myn-5tVZmMeaM7Fo7GZKZeL9IB5l3DPQzm_XIT5nF6sJmY7KATJnnwyWgweaa8_8bnf3E49jrmsljHwnDd2S_54wSCm5sXrXC-p97hL5p7toZ_aCm9NzySXUik00W_JbJdX7D-4A_XmQQZIC2HWnJzQZ-nvEUk6Skjnblj4RkwC4aJTOjClsR-0KTTgF2cgpZ28yJvmhqIHLVy9H9d5aS7Dc97WDMGSyMiCSCstjj'
  },
  {
    id: 2,
    name: 'Nguyễn Văn An',
    role: 'Senior Frontend Dev',
    rating: 5.0,
    location: 'TP.HCM, VN',
    bio: 'Lập trình viên Frontend với 5 năm kinh nghiệm chuyên sâu về hệ sinh thái React. Đam mê xây dựng các giao diện web mượt mà, hiệu năng cao và có tính mở rộng tốt.',
    skills: ['ReactJS', 'Tailwind CSS', 'Next.js'],
    price: '$30/hr',
    projects: 65,
    successRate: '100%',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB3OFvEO_LxLO54ce6rZ8HYLeg4xW15q722Kvl73fQGVzHlHfStM_IH9JDDg8sjOwxPoSp-0wYaOZxH6mn1wj_FyEmJHtz85n12ZUDL8zrF8_P3J1LevGBMJogGAraxFxCWVYv42yXpNUq9F4yA11TWLpmcvmJkzkBQ_WkJ-FFxQ76s_f0fr-nC9WNHdLpjntjNzaAZ6TnO-qZ8rxU551vlmg3tj010no9zO-dRQiI8w59jLpraQGrM'
  },
  {
    id: 3,
    name: 'Lê Quang Hải',
    role: 'Digital Marketer',
    rating: 4.7,
    location: 'Đà Nẵng, VN',
    bio: 'Chuyên gia Digital Marketing tập trung vào chuyển đổi. Kinh nghiệm triển khai các chiến dịch quảng cáo đa kênh mang lại ROI cao cho các doanh nghiệp vừa và nhỏ.',
    skills: ['Facebook Ads', 'SEO', 'Google Analytics'],
    price: '$20/hr',
    projects: 28,
    successRate: '92%',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBb3aOoa2RXmXMOD3VJmIBC-9644Vr0P8JB8TCUfSPaB8KxMUX9P-pjQKkWuYD-RtAjE9gKs-g2Ewl0UGgZ1YFtd6X5TVWUpJqBaxrR0I5kP-F43J4I5dauWhjc83XYFNa-bAAybXv96WUIYHq3pHPi1U5rf24TeCiy90lW3UP__kTL8FRhrrWdWWsqq3EL2tUvIGLVYlPZNDphguIyuMwkBr7Mz2XD9SmBeQIWrfHXIBK4E_OVpX_C'
  }
];

export function Freelancers() {
  return (
    <div className={styles.freelancersContainer}>
      {/* Header Section */}
      <div className={styles.headerSection}>
        <h1>Tìm kiếm Freelancer</h1>
        <p>Khám phá và kết nối với hàng ngàn chuyên gia tự do tài năng để hoàn thành dự án của bạn một cách xuất sắc nhất.</p>
      </div>

      <div className={styles.contentGrid}>
        {/* Left Column: Filters */}
        <aside className={styles.sidebar}>
          <div className={styles.filterCard}>
            <div className={styles.filterHeader}>
              <h2>Bộ lọc</h2>
              <button>Xóa bộ lọc</button>
            </div>

            {/* Kỹ năng */}
            <div className={styles.filterGroup}>
              <h3>Kỹ năng</h3>
              <div className={styles.optionsList}>
                <label><input type="checkbox" /> Lập trình</label>
                <label><input type="checkbox" defaultChecked /> Thiết kế</label>
                <label><input type="checkbox" /> Marketing</label>
                <label><input type="checkbox" /> Viết lách &amp; Dịch thuật</label>
              </div>
              <button className={styles.btnMore}>
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>add</span> Xem thêm
              </button>
            </div>

            {/* Kinh nghiệm */}
            <div className={styles.filterGroup}>
              <h3>Kinh nghiệm</h3>
              <div className={styles.optionsList}>
                <label><input type="radio" name="experience" /> Dưới 1 năm</label>
                <label><input type="radio" name="experience" defaultChecked /> 1-3 năm</label>
                <label><input type="radio" name="experience" /> Trên 5 năm</label>
              </div>
            </div>

            {/* Mức giá */}
            <div className={styles.filterGroup}>
              <h3>Mức giá</h3>
              <div className={styles.optionsList}>
                <label><input type="checkbox" defaultChecked /> Theo giờ</label>
                <label><input type="checkbox" /> Theo dự án</label>
              </div>
            </div>

            {/* Đánh giá */}
            <div className={styles.filterGroup}>
              <h3>Đánh giá</h3>
              <div className={styles.optionsList}>
                <label>
                  <input type="checkbox" defaultChecked />
                  4 sao trở lên
                  <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#F59E0B', marginLeft: '4px' }}>star</span>
                </label>
              </div>
            </div>
          </div>
        </aside>

        {/* Right Column: Freelancer Cards */}
        <section className={styles.resultsSection}>
          <div className={styles.toolbar}>
            <span>Hiển thị <strong>124</strong> Freelancer phù hợp</span>
            <div className={styles.sortControls}>
              <span>Sắp xếp theo:</span>
              <select>
                <option>Phù hợp nhất</option>
                <option>Đánh giá cao</option>
                <option>Giá thấp đến cao</option>
              </select>
            </div>
          </div>

          <div className={styles.bentoGrid}>
            {FREELANCERS_DATA.map((freelancer) => (
              <article key={freelancer.id} className={styles.freelancerCard}>
                <div className={styles.cardHeader}>
                  <img className={styles.avatar} src={freelancer.avatar} alt={freelancer.name} />
                  <div className={styles.info}>
                    <div className={styles.titleRow}>
                      <div>
                        <h3>{freelancer.name}</h3>
                        <p className={styles.role}>{freelancer.role}</p>
                      </div>
                      <button className={styles.favBtn} aria-label="Lưu freelancer">
                        <span className="material-symbols-outlined">favorite</span>
                      </button>
                    </div>
                    <div className={styles.ratingRow}>
                      <span className={`material-symbols-outlined ${styles.starIcon}`}>star</span>
                      <span>{freelancer.rating}</span>
                      <span>•</span>
                      <span>{freelancer.location}</span>
                    </div>
                  </div>
                </div>

                <p className={styles.bio}>{freelancer.bio}</p>

                <div className={styles.skills}>
                  {freelancer.skills.map((skill, index) => (
                    <span key={index} className={styles.skillTag}>{skill}</span>
                  ))}
                </div>

                <div className={styles.metrics}>
                  <div className={styles.price}>
                    <span>Giá tham khảo</span>
                    <span>{freelancer.price}</span>
                  </div>
                  <div className={styles.stats}>
                    <div>
                      <span>Dự án</span>
                      <span>{freelancer.projects}</span>
                    </div>
                    <div>
                      <span>Thành công</span>
                      <span className={styles.successRate}>{freelancer.successRate}</span>
                    </div>
                  </div>
                </div>

                <div className={styles.cardActions}>
                  <button className={styles.btnContact}>Liên hệ</button>
                  <button className={styles.btnProfile}>Xem hồ sơ</button>
                </div>
              </article>
            ))}
          </div>

          {/* Pagination */}
          <div className={styles.pagination}>
            <button disabled>
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <button className={styles.active}>1</button>
            <button>2</button>
            <button>3</button>
            <span>...</span>
            <button>12</button>
            <button>
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Freelancers;