import React, { useState } from 'react';
import styles from './Login.module.scss';
import config from '~/config';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Submitted:', { email, password });
  };

  const handleGoogleLogin = () => {
    console.log('Google login clicked');
  };

  return (
    <div className={`${styles.loginWrapper} container-fluid d-flex align-items-center justify-content-center py-4 p-3`}>
      <div className={`${styles.loginCard} w-100 p-4 rounded-4 shadow-sm border`}>
        
        {/* Header */}
        <div className="text-center mb-3">
          <h1 className={`${styles.fwBlack} h4 tracking-tight text-primary m-0`}>SMART JOB</h1>
          <h2 className="small text-secondary mt-1 mb-0">Chào mừng trở lại</h2>
        </div>

        {/* Form đăng nhập */}
        <form onSubmit={handleSubmit} className="d-flex flex-column gap-2.5">
          
          {/* Ô nhập Email */}
          <div>
            <label className="form-label small fw-semibold mb-1" htmlFor="email">Email</label>
            <input 
              type="email" 
              id="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control px-3 py-2" 
              placeholder="Nhập email của bạn" 
              required 
            />
          </div>

          {/* Ô nhập Mật khẩu */}
          <div>
            <div className="d-flex justify-content-between align-items-center mb-1">
              <label className="form-label small fw-semibold m-0" htmlFor="password">Mật khẩu</label>
              <a className="small text-primary text-decoration-none" href={config.routes.forgot_password}>
                Quên mật khẩu?
              </a>
            </div>
            <input 
              type="password" 
              id="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control px-3 py-2" 
              placeholder="Nhập mật khẩu" 
              required 
            />
          </div>

          {/* Nút Submit */}
          <button type="submit" className="btn btn-primary py-2 w-100 mt-2 fw-semibold shadow-sm">
            Đăng nhập
          </button>
        </form>

        {/* Đường kẻ Hoặc */}
        <div className="my-3 d-flex align-items-center gap-3">
          <div className="flex-grow-1 border-top"></div>
          <span className="small text-muted text-uppercase" style={{ fontSize: '11px' }}>Hoặc</span>
          <div className="flex-grow-1 border-top"></div>
        </div>

        {/* Nút đăng nhập Google */}
        <button 
          type="button" 
          onClick={handleGoogleLogin} 
          className="btn btn-light border w-100 d-flex align-items-center justify-content-center gap-2 py-2 shadow-sm"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.26H17.92C17.66 15.63 16.88 16.79 15.71 17.57V20.34H19.28C21.36 18.42 22.56 15.6 22.56 12.25Z" fill="#4285F4"></path>
            <path d="M12 23C14.97 23 17.46 22.02 19.28 20.34L15.71 17.57C14.73 18.23 13.48 18.63 12 18.63C9.14 18.63 6.71 16.7 5.84 14.09H2.18V16.93C3.99 20.53 7.7 23 12 23Z" fill="#34A853"></path>
            <path d="M5.84 14.09C5.62 13.43 5.49 12.73 5.49 12C5.49 11.27 5.62 10.57 5.84 9.91V7.07H2.18C1.43 8.55 1 10.22 1 12C1 13.78 1.43 15.45 2.18 16.93L5.84 14.09Z" fill="#FBBC05"></path>
            <path d="M12 5.38C13.62 5.38 15.06 5.94 16.21 7.02L19.36 3.87C17.46 2.09 14.97 1 12 1C7.7 1 3.99 3.47 2.18 7.07L5.84 9.91C6.71 7.3 9.14 5.38 12 5.38Z" fill="#EA4335"></path>
          </svg>
          Đăng nhập bằng Google
        </button>

        {/* Link sang Đăng ký */}
        <div className="mt-3 text-center">
          <p className="small text-muted m-0">
            Chưa có tài khoản?{' '}
            <a className="text-primary text-decoration-none fw-semibold" href="#register">Đăng ký ngay</a>
          </p>
        </div>

      </div>
    </div>
  );
}

export default Login;