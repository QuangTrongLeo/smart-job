import axiosClient from '../config/axiosClient';

export const aiService = {
  /**
   * Gửi yêu cầu tư vấn hoặc file CV tới AI Chatbot
   * @param {FormData} formData - Chứa 'message' (Text) và/hoặc 'file' (Multipart file)
   */
  chat: (formData) =>
    axiosClient.post('/ai/chatbot', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),

  /**
   * Bóc tách và chuẩn hóa mô tả công việc
   * @param {Object} data - Dữ liệu JobParseReq
   */
  parseJob: (data) => axiosClient.post('/ai/parse-job', data),

  /**
   * Bóc tách hồ sơ CV bằng AI
   * @param {File} file - File CV cần phân tích
   */
  parseCv: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return axiosClient.post('/ai/parse-cv', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  /**
   * Ghép nối freelancer với công việc bằng AI
   * @param {Object} data - Dữ liệu JobMatchReq
   */
  matchFreelancerToJob: (data) => axiosClient.post('/ai/match', data),
};