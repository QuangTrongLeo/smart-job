import React, { useState } from 'react';
import styles from './ForgotPassword.module.scss';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success'

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email) return;

    // Bật trạng thái gửi dữ liệu (loading)
    setStatus('loading');

    // Giả lập gọi API khôi phục mật khẩu
    setTimeout(() => {
      setStatus('success');

      // Tự động khôi phục lại trạng thái ban đầu sau 3 giây
      setTimeout(() => {
        setStatus('idle');
        setEmail('');
      }, 3000);
    }, 1500);
  };

  return (
    <div className={styles.forgotPasswordPage}>
      {/* Ambient Background Elements */}
      <div className={styles.ambientContainer}>
        <div className={styles.shape1} />
        <div className={styles.shape2} />
      </div>

      {/* Main Container */}
      <div className={styles.mainWrapper}>
        {/* Brand Logo */}
        <div className={styles.brandLogo}>
          <a href="#home">
            <i className="bi bi-briefcase-fill me-2"></i>SMART JOB
          </a>
        </div>

        {/* Card Content */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.iconBadge}>
              <i className="bi bi-shield-lock-fill"></i>
            </div>
            <h1 className={styles.title}>Quên mật khẩu?</h1>
            <p className={styles.subtitle}>
              Nhập email của bạn để nhận hướng dẫn khôi phục
            </p>
          </div>

          {/* Form */}
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="email">
                Email
              </label>
              <div className={styles.inputWrapper}>
                <i className={`bi bi-envelope ${styles.fieldIcon}`}></i>
                <input
                  required
                  type="email"
                  id="email"
                  name="email"
                  className={styles.input}
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={status === 'loading' || status === 'success'}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={status === 'loading'}
              className={`${styles.submitBtn} ${status === 'success' ? styles.success : ''}`}
            >
              {status === 'idle' && (
                <>
                  <i className="bi bi-send-fill me-2"></i>
                  Gửi yêu cầu
                </>
              )}

              {status === 'loading' && (
                <>
                  <div className="spinner-border spinner-border-sm me-2" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  Đang gửi...
                </>
              )}

              {status === 'success' && (
                <>
                  <i className="bi bi-check-circle-fill me-2"></i>
                  Đã gửi thành công
                </>
              )}
            </button>
          </form>

          {/* Back to Login */}
          <div className={styles.backToLogin}>
            <a href="#login" className={styles.backLink}>
              <i className="bi bi-arrow-left"></i>
              Quay lại Đăng nhập
            </a>
          </div>
        </div>

        {/* Footer Links */}
        <div className={styles.footerLinks}>
          <a href="#support">Hỗ trợ</a>
          <a href="#privacy">Bảo mật</a>
          <a href="#terms">Điều khoản</a>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;