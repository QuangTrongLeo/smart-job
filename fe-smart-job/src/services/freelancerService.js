import axiosClient from '../config/axiosClient';

export const freelancerService = {
  getAllProfiles: () => axiosClient.get('/freelancers'),

  getProfileById: (id) => axiosClient.get(`/freelancers/${id}`),
  
  getMyProfile: () => axiosClient.get('/freelancers/me'),
  
  createMyProfile: (data) => axiosClient.post('/freelancers/me', data),
  
  updateMyProfile: (data) => axiosClient.put('/freelancers/me', data),
  
  deleteMyProfile: () => axiosClient.delete('/freelancers/me'),
};