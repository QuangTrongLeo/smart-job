import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { freelancerService, chatService } from '~/services';
import styles from './FreelancerInvitations.module.scss';

const STATUS_LABELS = {
  PENDING: 'Đang chờ phản hồi',
  ACCEPTED: 'Đã chấp nhận',
  REJECTED: 'Đã từ chối',
  CANCELLED: 'Đã hủy',
};

const STATUS_CLASSES = {
  PENDING: styles.pending,
  ACCEPTED: styles.accepted,
  REJECTED: styles.rejected,
  CANCELLED: styles.cancelled,
};

const getResponseData = (response) => response?.data?.data || response?.data || response || [];

const getClientName = (invitation) => {
  const client = invitation?.client || {};
  const fullName = `${client.firstName || ''} ${client.lastName || ''}`.trim();
  return fullName || client.username || client.email || 'Client';
};

const getClientInitial = (client) =>
  `${client?.firstName?.[0] || ''}${client?.lastName?.[0] || ''}`.toUpperCase() || 'C';

const formatDate = (value) => {
  if (!value) return 'Chưa cập nhật';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString('vi-VN');
};

const getConversationId = (conversation) =>
  conversation?.id || conversation?.conversationId;

function FreelancerInvitations() {
  const navigate = useNavigate();
  const [invitations, setInvitations] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [respondingId, setRespondingId] = useState(null);
  const [messagingId, setMessagingId] = useState(null);

  const loadInvitations = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await freelancerService.getReceivedInvitations();
      const data = getResponseData(response);
      console.groupCollapsed('[FreelancerInvitations] getReceivedInvitations');
      console.log('Raw response:', response);
      console.log('Resolved data:', data);
      console.log('Is array:', Array.isArray(data));
      console.log('Invitation count:', Array.isArray(data) ? data.length : 0);
      console.log('First invitation:', Array.isArray(data) ? data[0] : undefined);
      console.groupEnd();
      setInvitations(Array.isArray(data) ? data : []);
    } catch (requestError) {
      console.error('Lỗi khi tải lời mời hợp tác:', requestError);
      console.groupCollapsed('[FreelancerInvitations] getReceivedInvitations error');
      console.error('Error response:', requestError.response);
      console.error('Error status:', requestError.response?.status);
      console.error('Error data:', requestError.response?.data);
      console.groupEnd();
      setError(
        requestError.response?.data?.message ||
          'Không thể tải danh sách lời mời hợp tác. Vui lòng thử lại.',
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInvitations();
  }, []);

  const handleRespond = async (invitationId, status) => {
    if (!invitationId || respondingId || messagingId) return;

    setRespondingId(invitationId);
    setError('');
    try {
      const response = await freelancerService.respondToInvitation(invitationId, status);
      const updatedInvitation = getResponseData(response);
      setInvitations((current) =>
        current.map((invitation) =>
          invitation.id === invitationId
            ? { ...invitation, ...(updatedInvitation || {}), status }
            : invitation,
        ),
      );
    } catch (requestError) {
      console.error('Lỗi khi phản hồi lời mời hợp tác:', requestError);
      setError(
        requestError.response?.data?.message ||
          'Không thể cập nhật lời mời. Vui lòng thử lại.',
      );
    } finally {
      setRespondingId(null);
    }
  };

  const handleMessage = async (invitation) => {
    const invitationId = invitation?.id;
    const partnerId = invitation?.client?.id;
    if (!invitationId || messagingId || respondingId) return;

    if (!partnerId) {
      setError('Không tìm thấy tài khoản Client để mở cuộc trò chuyện.');
      return;
    }

    setMessagingId(invitationId);
    setError('');
    try {
      const response = await chatService.getOrCreateConversation({ partnerId });
      const conversation = response?.data?.data || response?.data || response;
      const conversationId = getConversationId(conversation);
      if (!conversationId) throw new Error('Missing conversation id');

      navigate(`/messages?conversationId=${conversationId}`, {
        state: { conversation },
      });
    } catch (requestError) {
      console.error('Lỗi khi mở cuộc trò chuyện với Client:', requestError);
      setError(
        requestError.response?.data?.message ||
          'Không thể mở cuộc trò chuyện. Vui lòng thử lại.',
      );
    } finally {
      setMessagingId(null);
    }
  };

  const visibleInvitations = invitations.filter(
    (invitation) => filter === 'ALL' || invitation.status === filter,
  );

  if (loading) {
    return (
      <main className={styles.page}>
        <div className={styles.stateCard} role="status">
          <span className={styles.spinner} aria-hidden="true"></span>
          Đang tải lời mời hợp tác...
        </div>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <header className={styles.pageHeader}>
        <div>
          <p className={styles.eyebrow}><i className="bi bi-envelope-paper"></i> Freelancer workspace</p>
          <h1>Lời mời hợp tác</h1>
          <p className={styles.subtitle}>Xem các yêu cầu từ Client và chọn cơ hội phù hợp với bạn.</p>
        </div>
        <div className={styles.totalBadge}>{invitations.length} lời mời</div>
      </header>

      {error && <div className={styles.error} role="alert">{error}</div>}

      <div className={styles.filterBar} aria-label="Lọc lời mời">
        {['ALL', 'PENDING', 'ACCEPTED', 'REJECTED', 'CANCELLED'].map((status) => (
          <button
            key={status}
            type="button"
            className={filter === status ? styles.activeFilter : ''}
            onClick={() => setFilter(status)}
          >
            {status === 'ALL' ? 'Tất cả' : STATUS_LABELS[status]}
          </button>
        ))}
      </div>

      {visibleInvitations.length === 0 ? (
        <section className={styles.emptyCard}>
          <i className="bi bi-inbox"></i>
          <h2>{filter === 'ALL' ? 'Chưa có lời mời hợp tác' : 'Không có lời mời phù hợp'}</h2>
          <p>Các lời mời từ Client sẽ xuất hiện tại đây.</p>
        </section>
      ) : (
        <section className={styles.invitationList}>
          {visibleInvitations.map((invitation) => {
            const status = invitation.status || 'PENDING';
            const isResponding = respondingId === invitation.id;
            const isMessaging = messagingId === invitation.id;
            const client = invitation.client || {};
            return (
              <article className={styles.invitationCard} key={invitation.id}>
                <div className={styles.cardHeader}>
                  <div className={styles.clientIdentity}>
                    {client.avatarUrl ? (
                      <img
                        src={client.avatarUrl}
                        alt={getClientName(invitation)}
                        className={styles.clientAvatar}
                      />
                    ) : (
                      <div className={styles.clientIcon}>{getClientInitial(client)}</div>
                    )}
                    <div>
                      <p className={styles.label}>Lời mời từ Client</p>
                      <h2>{getClientName(invitation)}</h2>
                      {client.email && <span className={styles.email}>{client.email}</span>}
                    </div>
                  </div>
                  <span className={`${styles.status} ${STATUS_CLASSES[status] || styles.pending}`}>
                    {STATUS_LABELS[status] || status}
                  </span>
                </div>

                <div className={styles.details}>
                  <span><i className="bi bi-calendar3"></i> Gửi ngày {formatDate(invitation.createdAt)}</span>
                  {client.status && <span><i className="bi bi-circle-fill"></i> {client.status}</span>}
                </div>

                <div className={styles.actions}>
                  <button
                    type="button"
                    className={styles.chatButton}
                    onClick={() => handleMessage(invitation)}
                    disabled={isMessaging || isResponding}
                  >
                    <i className={isMessaging ? 'bi bi-hourglass-split' : 'bi bi-chat-dots-fill'}></i>
                    {isMessaging ? 'Đang mở trò chuyện...' : 'Nhắn tin với Client'}
                  </button>

                  {status === 'PENDING' && (
                    <>
                      <button
                        type="button"
                        className={styles.rejectButton}
                        onClick={() => handleRespond(invitation.id, 'REJECTED')}
                        disabled={isResponding}
                      >
                        <i className="bi bi-x-lg"></i> Từ chối
                      </button>
                      <button
                        type="button"
                        className={styles.acceptButton}
                        onClick={() => handleRespond(invitation.id, 'ACCEPTED')}
                        disabled={isResponding}
                      >
                        <i className={isResponding ? 'bi bi-hourglass-split' : 'bi bi-check-lg'}></i>
                        {isResponding ? 'Đang cập nhật...' : 'Chấp nhận lời mời'}
                      </button>
                    </>
                  )}
                </div>
              </article>
            );
          })}
        </section>
      )}
    </main>
  );
}

export default FreelancerInvitations;
