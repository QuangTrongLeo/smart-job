import axiosClient from '../config/axiosClient';

export const favoriteService = {
  // Dành cho Freelancer
  toggleFavoriteJob: (jobId) => axiosClient.post(`/favorites/jobs/${jobId}`),
  getMyFavoriteJobs: () => axiosClient.get('/favorites/jobs'),

  // Dành cho Client
  toggleFavoriteFreelancer: (freelancerUserId) => 
    axiosClient.post(`/favorites/freelancers/${freelancerUserId}`),
  getMyFavoriteFreelancers: () => axiosClient.get('/favorites/freelancers'),
};