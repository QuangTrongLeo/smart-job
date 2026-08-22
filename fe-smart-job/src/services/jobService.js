import axiosClient from '../config/axiosClient';

export const jobService = {
  getAllJobs: () => axiosClient.get('/jobs'),
  
  getJobById: (id) => axiosClient.get(`/jobs/${id}`),
  
  getMyJobs: () => axiosClient.get('/jobs/my-jobs'),
  
  createJob: (data) => axiosClient.post('/jobs', data),
  
  updateJob: (id, data) => axiosClient.put(`/jobs/${id}`, data),
  
  deleteJob: (id) => axiosClient.delete(`/jobs/${id}`),

  // Freelancer proposals
  createProposal: (data) => axiosClient.post('/jobs/proposals', data),

  getMySentProposals: () => axiosClient.get('/jobs/proposals/me'),

  cancelProposal: (id) => axiosClient.delete(`/jobs/proposals/${id}/cancel`),

  // Client proposal management
  getProposalsForClient: () => axiosClient.get('/jobs/proposals/client'),

  respondToProposal: (id, status) =>
    axiosClient.patch(`/jobs/proposals/${id}/respond`, null, {
      params: { status },
    }),
};