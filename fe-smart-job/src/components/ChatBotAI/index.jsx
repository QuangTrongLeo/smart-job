import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { aiService } from '~/services';
import styles from './ChatBotAI.module.scss';

function ChatBotAI() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Xin chào! Tôi là trợ lý AI. Tôi có thể giúp gì cho bạn?' },
  ]);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files?.[0] || null);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if ((!input.trim() && !selectedFile) || isLoading) return;

    const userMsg = {
      sender: 'user',
      text: input.trim() || 'Đã gửi file để phân tích',
      fileName: selectedFile?.name,
    };
    setMessages((prev) => [...prev, userMsg]);
    const formData = new FormData();
    if (input.trim()) formData.append('message', input.trim());
    if (selectedFile) formData.append('file', selectedFile);
    setInput('');
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setIsLoading(true);

    try {
      const response = await aiService.chat(formData);
      const botMsg = {
        sender: 'bot',
        text: response?.data?.text || 'Tôi chưa nhận được nội dung phản hồi từ hệ thống.',
        recommendedJobs: response?.data?.recommendedJobs || [],
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: error.response?.data?.msg || 'Không thể kết nối tới trợ lý AI. Vui lòng thử lại.',
          isError: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
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
                <div className={`${styles.msgBubble} ${msg.isError ? styles.errorBubble : ''}`}>
                  {msg.fileName && <div className={styles.sentFile}><i className="bi bi-file-earmark-text"></i>{msg.fileName}</div>}
                  <div className={styles.messageText}>{msg.text}</div>
                  {msg.recommendedJobs?.length > 0 && (
                    <div className={styles.recommendedJobs}>
                      <strong>Việc làm phù hợp</strong>
                      {msg.recommendedJobs.map((job) => (
                        <button
                          type="button"
                          className={styles.jobCard}
                          key={job.id}
                          onClick={() => navigate(`/job/${job.id}`)}
                          aria-label={`Xem công việc ${job.title}`}
                        >
                          <strong>{job.title}</strong>
                          <span>{job.companyName}</span>
                          <small>
                            {job.minBudget?.toLocaleString('vi-VN')} - {job.maxBudget?.toLocaleString('vi-VN')} {job.currency}
                          </small>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && <div className={`${styles.msgRow} ${styles.botRow}`}><div className={styles.msgBubble}>Đang phân tích...</div></div>}
          </div>

          {/* Footer Input */}
          <form onSubmit={handleSend} className={styles.chatbotFooter}>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              className={styles.fileInput}
            />
            <button
              type="button"
              className={styles.btnAttach}
              onClick={() => fileInputRef.current?.click()}
              title="Đính kèm CV"
              aria-label="Đính kèm CV"
            >
              <i className="bi bi-plus-lg"></i>
            </button>
            <input
              type="text"
              placeholder="Nhập tin nhắn..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            {selectedFile && <span className={styles.fileName} title={selectedFile.name}>{selectedFile.name}</span>}
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