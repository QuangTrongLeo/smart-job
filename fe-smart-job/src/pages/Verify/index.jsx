import React, { useState, useRef, useEffect } from 'react';
import styles from './Verify.module.scss';

function Verify() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success'
  const [timeLeft, setTimeLeft] = useState(0);
  const [isCardScaled, setIsCardScaled] = useState(false);
  const inputRefs = useRef([]);

  // Xử lý đếm ngược khi Resend OTP
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // Xử lý khi nhập chữ số vào từng ô
  const handleChange = (e, index) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    if (!value) {
      const newOtp = [...otp];
      newOtp[index] = '';
      setOtp(newOtp);
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Tự động nhảy ô tiếp theo
    if (index < 5 && value) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Xử lý bấm Backspace để lùi ô
  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Xử lý Paste (Dán) chuỗi 6 số
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData('text')
      .replace(/[^0-9]/g, '')
      .slice(0, 6);

    if (pastedData) {
      const newOtp = [...otp];
      for (let i = 0; i < pastedData.length; i++) {
        newOtp[i] = pastedData[i];
      }
      setOtp(newOtp);

      const focusIndex = Math.min(pastedData.length, 5);
      inputRefs.current[focusIndex]?.focus();
    }
  };

  // Xử lý Submit Form
  const handleSubmit = (e) => {
    e.preventDefault();
    if (status === 'loading') return;

    setStatus('loading');

    // Giả lập gọi API
    setTimeout(() => {
      setStatus('success');

      setTimeout(() => {
        setStatus('idle');
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }, 2000);
    }, 1500);
  };

  // Xử lý Gửi lại mã OTP
  const handleResendCode = () => {
    setTimeLeft(60);
    setIsCardScaled(true);
    setTimeout(() => setIsCardScaled(false), 150);
  };

  return (
    <div className={styles.container}>
      <main className={styles.mainContent}>
        {/* Brand Logo */}
        <div className={styles.brand}>
          <a href="#" className={styles.logo}>
            SMART JOB
          </a>
        </div>

        {/* Form Card */}
        <div
          className={styles.verifyCard}
          style={{ transform: isCardScaled ? 'scale(0.99)' : 'scale(1)' }}
        >
          <div className={styles.topBar}></div>

          {/* Icon Badge */}
          <div className={styles.iconBadge}>
            <i className={`bi bi-envelope-check-fill ${styles.icon}`}></i>
          </div>

          <h1 className={styles.title}>Xác thực tài khoản</h1>
          <p className={styles.subtitle}>
            Chúng tôi đã gửi mã xác thực gồm 6 chữ số đến email của bạn
          </p>

          <form className={styles.otpForm} onSubmit={handleSubmit}>
            <div className={styles.otpContainer}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength={1}
                  value={digit}
                  autoFocus={index === 0}
                  ref={(el) => (inputRefs.current[index] = el)}
                  onChange={(e) => handleChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onPaste={handlePaste}
                  className={styles.otpInput}
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={status === 'loading'}
              className={`${styles.submitBtn} ${
                status === 'success' ? styles.success : ''
              }`}
            >
              {status === 'loading' && (
                <>
                  <i className={`bi bi-arrow-repeat ${styles.btnIcon} ${styles.spin}`}></i>
                  Đang xác thực...
                </>
              )}

              {status === 'success' && (
                <>
                  <i className={`bi bi-check-circle-fill ${styles.btnIcon}`}></i>
                  Thành công
                </>
              )}

              {status === 'idle' && (
                <>
                  Xác nhận
                  <i className={`bi bi-arrow-right ${styles.btnIcon}`}></i>
                </>
              )}
            </button>
          </form>

          {/* Resend Link */}
          <div className={styles.resendSection}>
            Chưa nhận được mã?{' '}
            {timeLeft <= 0 ? (
              <button
                type="button"
                className={styles.resendBtn}
                onClick={handleResendCode}
              >
                Gửi lại
              </button>
            ) : null}
          </div>

          {timeLeft > 0 && (
            <div className={styles.timerText}>
              Có thể gửi lại sau <span>{timeLeft}</span>s
            </div>
          )}
        </div>

        {/* Security Footer */}
        <div className={styles.securityFooter}>
          <i className={`bi bi-lock-fill ${styles.lockIcon}`}></i>
          Bảo mật thông tin được mã hóa an toàn
        </div>
      </main>
    </div>
  );
}

export default Verify;