import axiosClient from '../config/axiosClient';

export const freelancerService = {
  getAllProfiles: () => axiosClient.get('/freelancers'),

  getProfileById: (id) => axiosClient.get(`/freelancers/${id}`),
  
  getMyProfile: () => axiosClient.get('/freelancers/me'),
  
  createMyProfile: (data) => axiosClient.post('/freelancers/me', data),
  
  updateMyProfile: (data) => axiosClient.put('/freelancers/me', data),
  
  deleteMyProfile: () => axiosClient.delete('/freelancers/me'),

  // Client invitations
  sendInvitation: (data) => axiosClient.post('/freelancers/invitations', data),

  getSentInvitations: () => axiosClient.get('/freelancers/invitations/sent'),

  cancelInvitation: (id) =>
    axiosClient.delete(`/freelancers/invitations/${id}/cancel`),

  // Freelancer invitation management
  getReceivedInvitations: (status) =>
    axiosClient.get('/freelancers/invitations/received', {
      params: status ? { status } : undefined,
    }),

  respondToInvitation: (id, status) =>
    axiosClient.patch(`/freelancers/invitations/${id}/respond`, null, {
      params: { status },
    }),
};