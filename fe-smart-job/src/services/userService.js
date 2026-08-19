import axiosClient from '../config/axiosClient';

export const userService = {
  getAllUsers: () => axiosClient.get('/users'),
  
  getUserById: (id) => axiosClient.get(`/users/${id}`),
  
  getMyProfile: () => axiosClient.get('/users/my-profile'),
  
  updateProfile: (data) => axiosClient.put('/users/profile', data),
  
  uploadAvatar: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return axiosClient.post('/users/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  changePassword: (data) => axiosClient.put('/users/change-password', data),
  
  updateStatus: (id, status) => axiosClient.patch(`/users/${id}/status`, null, { params: { status } }),
  
  deleteUser: (id) => axiosClient.delete(`/users/${id}`),
};