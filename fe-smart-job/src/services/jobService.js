import axiosClient from '../config/axiosClient';

export const jobService = {
  getAllJobs: () => axiosClient.get('/jobs'),
  
  getJobById: (id) => axiosClient.get(`/jobs/${id}`),
  
  getMyJobs: () => axiosClient.get('/jobs/my-jobs'),
  
  createJob: (data) => axiosClient.post('/jobs', data),
  
  updateJob: (id, data) => axiosClient.put(`/jobs/${id}`, data),
  
  deleteJob: (id) => axiosClient.delete(`/jobs/${id}`),
};