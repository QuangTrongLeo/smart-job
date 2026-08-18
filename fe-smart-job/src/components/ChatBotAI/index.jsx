import React, { useState } from 'react';
import styles from './ChatBotAI.module.scss';

function ChatBotAI() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Xin chào! Tôi là trợ lý AI. Tôi có thể giúp gì cho bạn?' },
  ]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    // Giả lập tin nhắn phản hồi từ Bot
    setTimeout(() => {
      const botMsg = { sender: 'bot', text: 'Cảm ơn bạn đã nhắn tin. Tôi đã nhận được yêu cầu!' };
      setMessages((prev) => [...prev, botMsg]);
    }, 800);
  };

  return (
    <div className={styles.chatbotWrapper}>
      {/* Khung Chat Window */}
      {isOpen && (
        <div className={styles.chatbotWindow}>
          {/* Header */}
          <div className={styles.chatbotHeader}>
            <div className={styles.headerTitle}>
              <i className="bi bi-robot"></i>
              <span>Trợ lý AI</span>
            </div>
            <button className={styles.btnClose} onClick={toggleChat} aria-label="Close">
              <i className="bi bi-x-lg"></i>
            </button>
          </div>

          {/* Body */}
          <div className={styles.chatbotBody}>
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`${styles.msgRow} ${
                  msg.sender === 'user' ? styles.userRow : styles.botRow
                }`}
              >
                <div className={styles.msgBubble}>{msg.text}</div>
              </div>
            ))}
          </div>

          {/* Footer Input */}
          <form onSubmit={handleSend} className={styles.chatbotFooter}>
            <input
              type="text"
              placeholder="Nhập tin nhắn..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit" className={styles.btnSend}>
              <i className="bi bi-send-fill"></i>
            </button>
          </form>
        </div>
      )}

      {/* Nút tròn FAB */}
      <button
        className={styles.chatbotFab}
        onClick={toggleChat}
        title="Trợ lý AI"
      >
        <i className={isOpen ? 'bi bi-x-lg' : 'bi bi-chat-dots-fill'}></i>
      </button>
    </div>
  );
}

export default ChatBotAI;