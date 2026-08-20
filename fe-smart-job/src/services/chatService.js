import axiosClient from '../config/axiosClient';

export const chatService = {
  getOrCreateConversation: (data) => axiosClient.post('/chat/conversations/initiate', data),

  sendMessage: (data) => axiosClient.post('/chat/messages', data),
  
  getMyConversations: () => axiosClient.get('/chat/conversations'),
  
  getMessagesByConversationId: (conversationId) => 
    axiosClient.get(`/chat/conversations/${conversationId}/messages`),
    
  markConversationAsRead: (conversationId) => 
    axiosClient.put(`/chat/conversations/${conversationId}/read`),
};