import React, { useEffect, useState } from 'react';
import { freelancerService } from '~/services';
import styles from './ClientInvitations.module.scss';

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

const getFullName = (user) => {
  const fullName = `${user?.firstName || ''} ${user?.lastName || ''}`.trim();
  return fullName || user?.username || user?.email || 'Freelancer';
};

const getInitial = (user) => getFullName(user).charAt(0).toUpperCase();

const formatDate = (value) => {
  if (!value) return 'Chưa cập nhật';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString('vi-VN');
};

function ClientInvitations() {
  const [invitations, setInvitations] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancellingId, setCancellingId] = useState(null);

  const loadInvitations = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await freelancerService.getSentInvitations();
      const data = getResponseData(response);
      setInvitations(Array.isArray(data) ? data : []);
    } catch (requestError) {
      console.error('Lỗi khi tải lời mời đã gửi:', requestError);
      setError(
        requestError.response?.data?.message ||
          'Không thể tải danh sách lời mời đã gửi. Vui lòng thử lại.',
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInvitations();
  }, []);

  const handleCancel = async (invitationId) => {
    if (!invitationId || cancellingId) return;

    setCancellingId(invitationId);
    setError('');
    try {
      await freelancerService.cancelInvitation(invitationId);
      setInvitations((current) => current.map((invitation) => (
        invitation.id === invitationId
          ? { ...invitation, status: 'CANCELLED' }
          : invitation
      )));
    } catch (requestError) {
      console.error('Lỗi khi hủy lời mời hợp tác:', requestError);
      setError(
        requestError.response?.data?.message ||
          'Không thể hủy lời mời hợp tác. Vui lòng thử lại.',
      );
    } finally {
      setCancellingId(null);
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
          Đang tải lời mời đã gửi...
        </div>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <header className={styles.pageHeader}>
        <div>
          <p className={styles.eyebrow}><i className="bi bi-send-check"></i> Client workspace</p>
          <h1>Lời mời hợp tác đã gửi</h1>
          <p className={styles.subtitle}>Theo dõi các Freelancer bạn đã mời tham gia hợp tác.</p>
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
          <i className="bi bi-send"></i>
          <h2>{filter === 'ALL' ? 'Chưa có lời mời nào' : 'Không có lời mời phù hợp'}</h2>
          <p>Các lời mời bạn gửi đến Freelancer sẽ xuất hiện tại đây.</p>
        </section>
      ) : (
        <section className={styles.invitationList}>
          {visibleInvitations.map((invitation) => {
            const profile = invitation.freelancerProfile || {};
            const user = profile.user || {};
            const status = invitation.status || 'PENDING';
            const isCancelling = cancellingId === invitation.id;

            return (
              <article className={styles.invitationCard} key={invitation.id}>
                <div className={styles.cardHeader}>
                  <div className={styles.freelancerIdentity}>
                    {user.avatarUrl ? (
                      <img src={user.avatarUrl} alt={getFullName(user)} className={styles.avatar} />
                    ) : (
                      <div className={styles.avatarFallback}>{getInitial(user)}</div>
                    )}
                    <div>
                      <p className={styles.label}>Freelancer nhận lời mời</p>
                      <h2>{getFullName(user)}</h2>
                      {user.email && <span className={styles.email}>{user.email}</span>}
                    </div>
                  </div>
                  <span className={`${styles.status} ${STATUS_CLASSES[status] || styles.pending}`}>
                    {STATUS_LABELS[status] || status}
                  </span>
                </div>

                <div className={styles.profileMeta}>
                  {profile.title && <span><i className="bi bi-person-workspace"></i> {profile.title}</span>}
                  {profile.address && <span><i className="bi bi-geo-alt"></i> {profile.address}</span>}
                  <span><i className="bi bi-calendar3"></i> Gửi ngày {formatDate(invitation.createdAt)}</span>
                </div>

                {profile.skills?.length > 0 && (
                  <div className={styles.skillList}>
                    {profile.skills.slice(0, 6).map((skill) => <span key={skill}>{skill}</span>)}
                  </div>
                )}

                {status === 'PENDING' && (
                  <div className={styles.actions}>
                    <button
                      type="button"
                      className={styles.cancelButton}
                      onClick={() => handleCancel(invitation.id)}
                      disabled={isCancelling}
                    >
                      <i className={isCancelling ? 'bi bi-hourglass-split' : 'bi bi-x-circle'}></i>
                      {isCancelling ? 'Đang hủy...' : 'Hủy lời mời'}
                    </button>
                  </div>
                )}
              </article>
            );
          })}
        </section>
      )}
    </main>
  );
}

export default ClientInvitations;
