import axiosClient from '../config/axiosClient';

export const authService = {
  /**
   * Đăng ký tài khoản mới
   * @param {Object} data - { username, email, password, firstName, lastName, roleId }
   */
  register: (data) => axiosClient.post('/auth/register', data),

  /**
   * Đăng nhập hệ thống
   * @param {Object} data - { usernameOrEmail, password }
   */
  login: (data) => axiosClient.post('/auth/login', data),

  /**
   * Làm mới Access Token khi hết hạn
   * @param {Object} data - { refreshToken }
   */
  refreshToken: (data) => axiosClient.post('/auth/refresh-token', data),
};