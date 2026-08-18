import { Link } from 'react-router-dom';
import styles from './Footer.module.scss';

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.brandColumn}>
          <span className={styles.brandTitle}>SMART JOB</span>
          <p className={styles.brandDesc}>Nền tảng kết nối nhân tài chuyên nghiệp.</p>
        </div>
        <div className={styles.linkColumn}>
          <Link to="/about">Về chúng tôi</Link>
          <Link to="/jobs">Việc làm</Link>
        </div>
        <div className={styles.linkColumn}>
          <Link to="/freelancers">Tìm Freelancer</Link>
          <Link to="/support">Hỗ trợ</Link>
        </div>
        <div className={styles.linkColumn}>
          <Link to="/terms">Điều khoản</Link>
          <Link to="/privacy">Chính sách bảo mật</Link>
        </div>
      </div>
      <div className={styles.copyrightBar}>
        <p>© 2026 SMART JOB. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;