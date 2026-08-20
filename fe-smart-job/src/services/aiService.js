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
};