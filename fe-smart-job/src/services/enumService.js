import axiosClient from '../config/axiosClient';

export const enumService = {
  getCurrencies: () => axiosClient.get('/enums/currencies'),
  getEmploymentTypes: () => axiosClient.get('/enums/employment-types'),
  getExperienceLevels: () => axiosClient.get('/enums/experience-levels'),
  getJobStatuses: () => axiosClient.get('/enums/job-statuses'),
  getMatchStatuses: () => axiosClient.get('/enums/match-statuses'),
  getRoleTypes: () => axiosClient.get('/enums/role-types'),
  getUserStatuses: () => axiosClient.get('/enums/user-statuses'),
  getAllEnums: () => axiosClient.get('/enums/all'),
};