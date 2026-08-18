import { Link } from 'react-router-dom';
import styles from './Header.module.scss';

function Header() {
  return (
    <nav className={styles.header}>
      <div className={styles.leftSection}>
        <Link to="/" className={styles.brand}>SMART JOB</Link>
        <div className={styles.navigation}>
          <Link to="/jobs" className={styles.navLink}>Việc làm</Link>
          <Link to="/freelancers" className={styles.navLink}>Tìm Freelancer</Link>
          <Link to="/explore" className={styles.navLink}>Khám phá</Link>
          <Link to="/about" className={styles.navLink}>Về Smart Job</Link>
        </div>
      </div>
      <div className={styles.rightSection}>
        <Link to="/login">
          <button className={styles.btnLogin}>Đăng nhập</button>
        </Link>
        <Link to="/register">
          <button className={styles.btnRegister}>Đăng ký</button>
        </Link>
      </div>
    </nav>
  );
}

export default Header;