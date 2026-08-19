import axiosClient from '../config/axiosClient';

export const freelancerService = {
  getAllProfiles: () => axiosClient.get('/freelancers'),
  
  getProfileByUserId: (userId) => axiosClient.get(`/freelancers/user/${userId}`),
  
  getMyProfile: () => axiosClient.get('/freelancers/me'),
  
  createMyProfile: (data) => axiosClient.post('/freelancers/me', data),
  
  updateMyProfile: (data) => axiosClient.put('/freelancers/me', data),
  
  deleteMyProfile: () => axiosClient.delete('/freelancers/me'),
};