import axiosClient from '../config/axiosClient';

export const jobMatchService = {
  getJobMatch: (jobId, freelancerId) =>
    axiosClient.get('/job-matches', {
      params: { jobId, freelancerId },
    }),
};
