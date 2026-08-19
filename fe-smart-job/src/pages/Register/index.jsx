import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/authService';
import styles from './Register.module.scss';
import config from '../../config';

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    role: '',
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    terms: false,
  });

  const [roleError, setRoleError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSelectRole = (selectedRole) => {
    setFormData((prev) => ({ ...prev, role: selectedRole }));
    setRoleError(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.role) {
      setRoleError(true);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Mật khẩu và Nhập lại mật khẩu không khớp nhau!');
      return;
    }

    if (!formData.terms) {
      setErrorMessage('Bạn cần đồng ý với Điều khoản dịch vụ và Chính sách bảo mật!');
      return;
    }

    setLoading(true);

    try {
      // Map dữ liệu theo DTO RegisterRequest của Backend
      const payload = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        roleType: formData.role.toUpperCase(), // 'client' -> 'CLIENT', 'freelancer' -> 'FREELANCER'
      };

      const response = await authService.register(payload);

      // Lấy thông báo từ ApiResponse của Backend
      alert(response?.data?.message || 'Đăng ký tài khoản thành công!');
      
      // Chuyển hướng sang trang đăng nhập
      navigate('/login');
    } catch (error) {
      console.error('Lỗi đăng ký:', error);
      // Hiển thị lỗi từ Backend trả về (ví dụ: Email đã tồn tại)
      const apiMessage =
        error.response?.data?.message || 'Đã xảy ra lỗi khi đăng ký. Vui lòng thử lại!';
      setErrorMessage(apiMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.registerPage}>
      <main className={styles.mainCard}>
        {/* Left Side: Visual / Branding */}
        <div className={styles.visualSide}>
          <div>
            <h1 className={styles.brandTitle}>
              <i className="bi bi-briefcase-fill me-2"></i>SMART JOB
            </h1>
            <p className={styles.brandSubtitle}>Kết nối nhân tài, kiến tạo thành công.</p>
          </div>

          <div className={styles.testimonials}>
            <div className={styles.testimonialCard}>
              <div className={styles.stars}>
                {[...Array(5)].map((_, i) => (
                  <i key={i} className="bi bi-star-fill"></i>
                ))}
              </div>
              <p className={styles.comment}>
                "Nền tảng tuyệt vời giúp tôi tìm được designer xuất sắc cho dự án của mình chỉ trong 2 ngày."
              </p>
              <p className={styles.author}>- Nguyễn Văn A, Client</p>
            </div>

            <div className={styles.testimonialCard}>
              <div className={styles.stars}>
                {[...Array(5)].map((_, i) => (
                  <i key={i} className="bi bi-star-fill"></i>
                ))}
              </div>
              <p className={styles.comment}>
                "Tôi đã tăng gấp đôi thu nhập từ khi làm freelancer toàn thời gian trên Smart Job."
              </p>
              <p className={styles.author}>- Trần Thị B, Freelancer</p>
            </div>
          </div>

          <div className={styles.bgPattern} />
        </div>

        {/* Right Side: Registration Form */}
        <div className={styles.formSide}>
          <div className={styles.mobileHeader}>
            <h1>
              <i className="bi bi-briefcase-fill me-2"></i>SMART JOB
            </h1>
          </div>
          <h2 className={styles.formTitle}>Tạo tài khoản mới</h2>
          <p className={styles.formSubtitle}>Vui lòng chọn vai trò và điền thông tin đăng ký</p>

          {errorMessage && (
            <div className="alert alert-danger mb-3" role="alert">
              {errorMessage}
            </div>
          )}

          <form className={styles.form} onSubmit={handleSubmit}>
            {/* Role Selection */}
            <div className={styles.fieldGroup}>
              <label className={styles.label}>
                Chọn vai trò <span className={styles.required}>*</span>
              </label>
              <div className={styles.roleGrid}>
                {/* Client Role */}
                <button
                  type="button"
                  className={`${styles.roleCard} ${formData.role === 'client' ? styles.active : ''}`}
                  onClick={() => handleSelectRole('client')}
                >
                  <div className={styles.iconContainer}>
                    <i className="bi bi-building"></i>
                  </div>
                  <span className={styles.roleTitle}>Tôi là Client</span>
                  <span className={styles.roleDesc}>Muốn thuê Freelancer</span>
                  {formData.role === 'client' && (
                    <div className={styles.checkIcon}>
                      <i className="bi bi-check-circle-fill"></i>
                    </div>
                  )}
                </button>

                {/* Freelancer Role */}
                <button
                  type="button"
                  className={`${styles.roleCard} ${formData.role === 'freelancer' ? styles.active : ''}`}
                  onClick={() => handleSelectRole('freelancer')}
                >
                  <div className={styles.iconContainer}>
                    <i className="bi bi-person-badge"></i>
                  </div>
                  <span className={styles.roleTitle}>Tôi là Freelancer</span>
                  <span className={styles.roleDesc}>Muốn tìm việc</span>
                  {formData.role === 'freelancer' && (
                    <div className={styles.checkIcon}>
                      <i className="bi bi-check-circle-fill"></i>
                    </div>
                  )}
                </button>
              </div>
              {roleError && <p className={styles.errorText}>Vui lòng chọn vai trò của bạn!</p>}
            </div>

            {/* Họ & Tên */}
            <div className={styles.rowGrid}>
              <div className={styles.fieldGroup}>
                <label className={styles.label} htmlFor="firstName">
                  Họ <span className={styles.required}>*</span>
                </label>
                <input
                  required
                  type="text"
                  id="firstName"
                  name="firstName"
                  className={styles.input}
                  placeholder="Nguyễn Văn"
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label} htmlFor="lastName">
                  Tên <span className={styles.required}>*</span>
                </label>
                <input
                  required
                  type="text"
                  id="lastName"
                  name="lastName"
                  className={styles.input}
                  placeholder="A"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Username */}
            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="username">
                Tên đăng nhập (Username) <span className={styles.required}>*</span>
              </label>
              <input
                required
                type="text"
                id="username"
                name="username"
                className={styles.input}
                placeholder="nguyenvana123"
                value={formData.username}
                onChange={handleChange}
              />
            </div>

            {/* Email */}
            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="email">
                Email <span className={styles.required}>*</span>
              </label>
              <input
                required
                type="email"
                id="email"
                name="email"
                className={styles.input}
                placeholder="nguyenvana@example.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            {/* Mật khẩu */}
            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="password">
                Mật khẩu <span className={styles.required}>*</span>
              </label>
              <input
                required
                type="password"
                id="password"
                name="password"
                className={styles.input}
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            {/* Nhập lại mật khẩu */}
            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="confirmPassword">
                Nhập lại mật khẩu <span className={styles.required}>*</span>
              </label>
              <input
                required
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                className={styles.input}
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>

            {/* Đồng ý điều khoản */}
            <div className={styles.termsGroup}>
              <input
                required
                type="checkbox"
                id="terms"
                name="terms"
                checked={formData.terms}
                onChange={handleChange}
              />
              <label htmlFor="terms">
                Tôi đồng ý với <a href="#terms">Điều khoản dịch vụ</a> và <a href="#privacy">Chính sách bảo mật</a> của Smart Job.
              </label>
            </div>

            {/* Submit Button */}
            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? (
                <span>Đang xử lý...</span>
              ) : (
                <>
                  Đăng ký
                  <i className="bi bi-arrow-right ms-2"></i>
                </>
              )}
            </button>
          </form>

          <div className={styles.footerText}>
            Đã có tài khoản? <Link to={config.routes.login}>Đăng nhập</Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Register;