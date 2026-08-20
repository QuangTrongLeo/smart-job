import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { chatService } from '../../services';
import styles from './Messages.module.scss';

const DEFAULT_AVATAR = 'https://ui-avatars.com/api/?background=2563eb&color=fff&name=User';
const getResponseData = (response, fallback) => response?.data?.data ?? response?.data ?? fallback;

const formatTime = (value) => {
  if (!value) return '';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '' : date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
};

const formatDate = (value) => {
  if (!value) return '';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '' : date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

const getConversationId = (conversation) => conversation?.id || conversation?.conversationId || '';

function Messages() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const requestedConversationId = searchParams.get('conversationId');
  const initialConversation = location.state?.conversation;
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(initialConversation || null);
  const [messages, setMessages] = useState([]);
  const [search, setSearch] = useState('');
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const shouldScrollRef = useRef(false);

  const filteredConversations = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return conversations;
    return conversations.filter((conversation) => (
      [conversation.partnerName, conversation.lastMessage, conversation.jobId]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query))
    ));
  }, [conversations, search]);

  const loadConversations = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await chatService.getMyConversations();
      const data = getResponseData(response, []);
      const nextConversations = Array.isArray(data) ? data : [];
      const mergedConversations = nextConversations.some((conversation) => getConversationId(conversation) === getConversationId(initialConversation))
        ? nextConversations
        : initialConversation ? [initialConversation, ...nextConversations] : nextConversations;
      setConversations(mergedConversations);
      setActiveConversation((current) => (
        mergedConversations.find((conversation) => getConversationId(conversation) === requestedConversationId)
        || mergedConversations.find((conversation) => getConversationId(conversation) === getConversationId(current))
        || mergedConversations[0]
        || null
      ));
    } catch (requestError) {
      console.error('Lỗi khi tải danh sách trò chuyện:', requestError);
      setError(requestError.response?.data?.message || 'Không thể tải danh sách trò chuyện.');
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (conversation) => {
    const conversationId = getConversationId(conversation);
    if (!conversationId) return;
    setMessagesLoading(true);
    setError('');
    try {
      const response = await chatService.getMessagesByConversationId(conversationId);
      const data = getResponseData(response, []);
      setMessages(Array.isArray(data) ? data : []);
      if (conversation.unreadCount > 0) {
        await chatService.markConversationAsRead(conversation.id);
        setConversations((current) => current.map((item) => (
          getConversationId(item) === conversationId ? { ...item, unreadCount: 0 } : item
        )));
      }
    } catch (requestError) {
      console.error('Lỗi khi tải tin nhắn:', requestError);
      setError(requestError.response?.data?.message || 'Không thể tải tin nhắn.');
      setMessages([]);
    } finally {
      setMessagesLoading(false);
    }
  };

  useEffect(() => { loadConversations(); }, [initialConversation, requestedConversationId]);

  useEffect(() => {
    setMessages([]);
    shouldScrollRef.current = true;
    loadMessages(activeConversation);
  }, [activeConversation?.id]);

  useEffect(() => {
    if (!activeConversation?.id) return undefined;

    let cancelled = false;
    const pollMessages = async () => {
      try {
        const response = await chatService.getMessagesByConversationId(getConversationId(activeConversation));
        const data = getResponseData(response, []);
        if (!cancelled && Array.isArray(data)) setMessages(data);
      } catch (requestError) {
        if (!cancelled) console.error('Lỗi khi đồng bộ tin nhắn:', requestError);
      }
    };

    const intervalId = window.setInterval(pollMessages, 3000);
    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, [activeConversation?.id]);

  useEffect(() => {
    if (!shouldScrollRef.current) return;

    messagesEndRef.current?.scrollIntoView({ behavior: 'auto', block: 'end' });
    shouldScrollRef.current = false;
  }, [messages]);

  const handleSend = async (event) => {
    event.preventDefault();
    const content = draft.trim();
    if (!content || !activeConversation?.id || sending) return;
    setSending(true);
    setError('');
    try {
      const response = await chatService.sendMessage({
        receiverId: activeConversation.partnerId,
        jobId: activeConversation.jobId,
        content,
      });
      const sentMessage = getResponseData(response, null);
      if (sentMessage) {
        shouldScrollRef.current = true;
        setMessages((current) => [...current, sentMessage]);
      }
      setDraft('');
      setConversations((current) => current.map((conversation) => (
        conversation.id === activeConversation.id
          ? { ...conversation, lastMessage: content, lastMessageAt: new Date().toISOString() }
          : conversation
      )));
    } catch (requestError) {
      console.error('Lỗi khi gửi tin nhắn:', requestError);
      setError(requestError.response?.data?.message || 'Không thể gửi tin nhắn. Vui lòng thử lại.');
    } finally {
      setSending(false);
    }
  };

  const handleDraftKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  };

  return (
    <div className={styles.messagesContainer}>
      <aside className={styles.chatListColumn}>
        <div className={styles.listHeader}>
          <div><span className={styles.eyebrow}>Hộp thư</span><h1>Tin nhắn</h1></div>
          <button type="button" className={styles.refreshButton} onClick={loadConversations} title="Làm mới" aria-label="Làm mới"><i className="bi bi-arrow-clockwise"></i></button>
        </div>
        <div className={styles.searchBox}>
          <div className={styles.inputWrapper}>
            <i className={`bi bi-search ${styles.searchIcon}`}></i>
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Tìm kiếm cuộc trò chuyện..." aria-label="Tìm kiếm cuộc trò chuyện" />
          </div>
        </div>
        <div className={styles.chatListScroll}>
          {loading && <p className={styles.stateMessage}>Đang tải cuộc trò chuyện...</p>}
          {!loading && error && !activeConversation && <div className={styles.stateMessage}><i className="bi bi-exclamation-circle"></i><p>{error}</p><button type="button" className={styles.retryButton} onClick={loadConversations}>Thử lại</button></div>}
          {!loading && !error && filteredConversations.length === 0 && <p className={styles.stateMessage}>{search ? 'Không tìm thấy cuộc trò chuyện.' : 'Bạn chưa có cuộc trò chuyện nào.'}</p>}
          {filteredConversations.map((conversation) => (
            <button type="button" key={getConversationId(conversation)} className={`${styles.chatItem} ${getConversationId(activeConversation) === getConversationId(conversation) ? styles.active : ''}`} onClick={() => setActiveConversation(conversation)}>
              <div className={styles.avatarWrapper}>
                <img src={conversation.partnerAvatar || DEFAULT_AVATAR} alt={conversation.partnerName || 'Đối phương'} onError={(event) => { event.currentTarget.src = DEFAULT_AVATAR; }} />
                {conversation.unreadCount > 0 && <span className={styles.unreadDot}></span>}
              </div>
              <div className={styles.chatMeta}>
                <div className={styles.itemHeader}><h4>{conversation.partnerName || 'Người dùng SmartJob'}</h4><span className={styles.time}>{formatTime(conversation.lastMessageAt)}</span></div>
                <p className={styles.lastMessage}>{conversation.lastMessage || 'Chưa có tin nhắn'}</p>
                {conversation.unreadCount > 0 && <span className={styles.unreadBadge}>{conversation.unreadCount}</span>}
              </div>
            </button>
          ))}
        </div>
      </aside>

      <main className={styles.chatWindowColumn}>
        {!activeConversation ? (
          <div className={styles.emptyConversation}><i className="bi bi-chat-dots"></i><h2>Chọn một cuộc trò chuyện</h2><p>Các tin nhắn của bạn sẽ xuất hiện tại đây.</p></div>
        ) : (
          <>
            <header className={styles.chatHeader}>
              <button type="button" className={styles.mobileBack} onClick={() => setActiveConversation(null)} title="Quay lại danh sách" aria-label="Quay lại danh sách cuộc trò chuyện">
                <i className="bi bi-arrow-left"></i>
              </button>
              <div className={styles.userInfo}>
                <img src={activeConversation.partnerAvatar || DEFAULT_AVATAR} alt={activeConversation.partnerName || 'Đối phương'} onError={(event) => { event.currentTarget.src = DEFAULT_AVATAR; }} />
                <div><h2>{activeConversation.partnerName || 'Người dùng SmartJob'}</h2><p className={styles.statusText}><span className={styles.greenDot}></span> Đang trò chuyện</p></div>
              </div>
            </header>
            {error && <div className={styles.inlineError} role="alert"><i className="bi bi-exclamation-triangle"></i>{error}</div>}
            <div className={styles.messagesArea}>
              {messagesLoading && <p className={styles.stateMessage}>Đang tải tin nhắn...</p>}
              {!messagesLoading && messages.length === 0 && <p className={styles.stateMessage}>Chưa có tin nhắn. Hãy bắt đầu cuộc trò chuyện.</p>}
              {!messagesLoading && messages.map((message) => {
                const isSent = String(message.senderId) !== String(activeConversation.partnerId);
                return <div key={message.id} className={`${styles.msgRow} ${isSent ? styles.sent : ''}`}><div className={styles.msgBubble}><p>{message.content}</p><span className={styles.msgTime}>{formatTime(message.createdAt)}</span></div></div>;
              })}
              <div ref={messagesEndRef}></div>
            </div>
            <form className={styles.chatInputArea} onSubmit={handleSend}>
              <div className={styles.inputBox}><textarea ref={textareaRef} value={draft} onChange={(event) => setDraft(event.target.value)} onKeyDown={handleDraftKeyDown} placeholder="Nhập tin nhắn..." rows={1} disabled={sending} aria-label="Nội dung tin nhắn" style={{ height: '42px', minHeight: '42px', maxHeight: '42px' }} /><button type="submit" className={styles.btnSend} disabled={!draft.trim() || sending} title="Gửi tin nhắn" aria-label="Gửi tin nhắn"><i className={sending ? 'bi bi-hourglass-split' : 'bi bi-send-fill'}></i></button></div>
              <small>Enter để gửi, Shift + Enter để xuống dòng</small>
            </form>
          </>
        )}
      </main>

      <aside className={styles.contextColumn}>
        {activeConversation && <>
          <div className={styles.companyHeader}><img className={styles.logoImg} src={activeConversation.partnerAvatar || DEFAULT_AVATAR} alt={activeConversation.partnerName || 'Đối phương'} /><h3>{activeConversation.partnerName || 'Người dùng SmartJob'}</h3><p className={styles.location}><i className="bi bi-briefcase"></i> Cuộc trò chuyện SmartJob</p></div>
          <div className={styles.projectSection}><h4>Thông tin cuộc trò chuyện</h4><div className={styles.projectCard}>{activeConversation.jobId && <><span><i className="bi bi-briefcase"></i> Mã công việc</span><strong>{activeConversation.jobId}</strong></>}<div className={styles.cardFooter}><span>Tin chưa đọc</span><span className={styles.status}>{activeConversation.unreadCount || 0}</span></div></div></div>
          <div className={styles.filesSection}><h4>Trạng thái</h4><p className={styles.contextNote}>Tin nhắn được đồng bộ trực tiếp với hệ thống SmartJob.</p><p className={styles.contextDate}>Hoạt động gần nhất: {formatDate(activeConversation.lastMessageAt) || 'Chưa có dữ liệu'}</p></div>
        </>}
      </aside>
    </div>
  );
}

export default Messages;
