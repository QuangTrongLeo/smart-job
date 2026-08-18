import config from '~/config';
import { Link } from 'react-router-dom';
import styles from './Header.module.scss';

function Header() {
  return (
    <nav className={styles.header}>
      <div className={styles.leftSection}>
        <Link to={config.routes.home} className={styles.brand}>SMART JOB</Link>
        <div className={styles.navigation}>
          <Link to={config.routes.jobs} className={styles.navLink}>Việc làm</Link>
          <Link to={config.routes.freelancers} className={styles.navLink}>Tìm Freelancer</Link>
          <Link to={config.routes.explore} className={styles.navLink}>Khám phá</Link>
          <Link to={config.routes.about} className={styles.navLink}>Về Smart Job</Link>
        </div>
      </div>
      <div className={styles.rightSection}>
        <Link to={config.routes.login}>
          <button className={styles.btnLogin}>Đăng nhập</button>
        </Link>
        <Link to={config.routes.register}>
          <button className={styles.btnRegister}>Đăng ký</button>
        </Link>
      </div>
    </nav>
  );
}

export default Header;