import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { aiService, jobMatchService, jobService } from '~/services';
import { useAuth } from '~/context/AuthContext';
import styles from './FreelancerProposals.module.scss';

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
  return fullName || user?.username || user?.email || 'Client';
};

const getInitial = (user) => getFullName(user).charAt(0).toUpperCase();

const formatDate = (value) => {
  if (!value) return 'Chưa cập nhật';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString('vi-VN');
};

const formatBudget = (job) => {
  if (!job?.minBudget && !job?.maxBudget) return 'Thỏa thuận';
  const currency = job.currency || 'USD';
  if (job.minBudget && job.maxBudget) {
    return `${Number(job.minBudget).toLocaleString()} - ${Number(job.maxBudget).toLocaleString()} ${currency}`;
  }
  return job.minBudget
    ? `Từ ${Number(job.minBudget).toLocaleString()} ${currency}`
    : `Đến ${Number(job.maxBudget).toLocaleString()} ${currency}`;
};

const getMatchData = (response) => response?.data?.data || response?.data || response || null;

const formatScore = (score) => {
  const value = Number(score);
  if (!Number.isFinite(value)) return 'N/A';
  return `${Math.round(value <= 1 ? value * 100 : value)}%`;
};

const formatAmount = (amount) => {
  if (amount == null) return 'Chưa cập nhật';
  return Number(amount).toLocaleString('vi-VN');
};

function FreelancerProposals() {
  const { user } = useAuth();
  const [proposals, setProposals] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancellingId, setCancellingId] = useState(null);
  const [matchByProposal, setMatchByProposal] = useState({});
  const [matchLoadingId, setMatchLoadingId] = useState(null);

  const loadProposals = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await jobService.getMySentProposals();
      const data = getResponseData(response);
      setProposals(Array.isArray(data) ? data : []);
    } catch (requestError) {
      console.error('Lỗi khi tải đề xuất đã gửi:', requestError);
      setError(
        requestError.response?.data?.message ||
          'Không thể tải danh sách đề xuất đã gửi. Vui lòng thử lại.',
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProposals();
  }, []);

  const handleCancel = async (proposalId) => {
    if (!proposalId || cancellingId) return;

    setCancellingId(proposalId);
    setError('');
    try {
      await jobService.cancelProposal(proposalId);
      setProposals((current) => current.map((proposal) => (
        proposal.id === proposalId
          ? { ...proposal, status: 'CANCELLED' }
          : proposal
      )));
    } catch (requestError) {
      console.error('Lỗi khi hủy đề xuất:', requestError);
      setError(
        requestError.response?.data?.message ||
          'Không thể hủy đề xuất. Vui lòng thử lại.',
      );
    } finally {
      setCancellingId(null);
    }
  };

  const getFreelancerId = (proposal) =>
    proposal?.freelancer?.id || proposal?.freelancerProfile?.user?.id || user?.id || user?._id;

  const handleLoadMatch = async (proposal) => {
    const proposalId = proposal?.id;
    const jobId = proposal?.job?.id;
    const freelancerId = getFreelancerId(proposal);
    if (!proposalId || !jobId || !freelancerId || matchLoadingId) return;

    setMatchLoadingId(proposalId);
    setError('');
    try {
      const response = await jobMatchService.getJobMatch(jobId, freelancerId);
      const match = getMatchData(response);
      setMatchByProposal((current) => ({
        ...current,
        [proposalId]: { match: match?.id ? match : null, missing: !match?.id },
      }));
    } catch (requestError) {
      if (requestError.response?.status === 404) {
        setMatchByProposal((current) => ({
          ...current,
          [proposalId]: { match: null, missing: true },
        }));
      } else {
        console.error('Lỗi khi tải đánh giá Job Match:', requestError);
        setError(
          requestError.response?.data?.message ||
            'Không thể tải đánh giá độ phù hợp. Vui lòng thử lại.',
        );
      }
    } finally {
      setMatchLoadingId(null);
    }
  };

  const handleCreateMatch = async (proposal) => {
    const proposalId = proposal?.id;
    const jobId = proposal?.job?.id;
    if (!proposalId || !jobId || matchLoadingId) return;

    setMatchLoadingId(proposalId);
    setError('');
    try {
      const response = await aiService.matchFreelancerToJob({ jobId });
      setMatchByProposal((current) => ({
        ...current,
        [proposalId]: { match: getMatchData(response), missing: false },
      }));
    } catch (requestError) {
      console.error('Lỗi khi tạo đánh giá Job Match:', requestError);
      setError(
        requestError.response?.data?.message ||
          'Không thể tạo đánh giá độ phù hợp. Vui lòng thử lại.',
      );
    } finally {
      setMatchLoadingId(null);
    }
  };

  const visibleProposals = proposals.filter(
    (proposal) => filter === 'ALL' || proposal.status === filter,
  );

  if (loading) {
    return (
      <main className={styles.page}>
        <div className={styles.stateCard} role="status">
          <span className={styles.spinner} aria-hidden="true"></span>
          Đang tải đề xuất đã gửi...
        </div>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <header className={styles.pageHeader}>
        <div>
          <p className={styles.eyebrow}><i className="bi bi-file-earmark-text"></i> Freelancer workspace</p>
          <h1>Đề xuất đã gửi</h1>
          <p className={styles.subtitle}>Theo dõi các công việc bạn đã ứng tuyển và trạng thái phản hồi.</p>
        </div>
        <div className={styles.totalBadge}>{proposals.length} đề xuất</div>
      </header>

      {error && <div className={styles.error} role="alert">{error}</div>}

      <div className={styles.filterBar} aria-label="Lọc đề xuất">
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

      {visibleProposals.length === 0 ? (
        <section className={styles.emptyCard}>
          <i className="bi bi-file-earmark-plus"></i>
          <h2>{filter === 'ALL' ? 'Chưa có đề xuất nào' : 'Không có đề xuất phù hợp'}</h2>
          <p>Các công việc bạn ứng tuyển sẽ xuất hiện tại đây.</p>
          <Link to="/jobs" className={styles.jobsLink}>Khám phá việc làm</Link>
        </section>
      ) : (
        <section className={styles.proposalList}>
          {visibleProposals.map((proposal) => {
            const job = proposal.job || {};
            const client = proposal.client || {};
            const status = proposal.status || 'PENDING';
            const isCancelling = cancellingId === proposal.id;
            const matchState = matchByProposal[proposal.id];
            const isLoadingMatch = matchLoadingId === proposal.id;

            return (
              <article className={styles.proposalCard} key={proposal.id}>
                <div className={styles.cardHeader}>
                  <div className={styles.jobIdentity}>
                    <div className={styles.jobIcon}><i className="bi bi-briefcase-fill"></i></div>
                    <div>
                      <p className={styles.label}>Công việc đã ứng tuyển</p>
                      <h2>
                        {job.id ? (
                          <Link to={`/job/${job.id}`} className={styles.jobTitleLink}>
                            {job.title || 'Công việc chưa cập nhật tiêu đề'}
                          </Link>
                        ) : (
                          job.title || 'Công việc chưa cập nhật tiêu đề'
                        )}
                      </h2>
                    </div>
                  </div>
                  <span className={`${styles.status} ${STATUS_CLASSES[status] || styles.pending}`}>
                    {STATUS_LABELS[status] || status}
                  </span>
                </div>

                <div className={styles.clientRow}>
                  {client.avatarUrl ? (
                    <img src={client.avatarUrl} alt={getFullName(client)} className={styles.clientAvatar} />
                  ) : (
                    <div className={styles.clientFallback}>{getInitial(client)}</div>
                  )}
                  <div>
                    <span className={styles.clientLabel}>Client</span>
                    <strong>{getFullName(client)}</strong>
                    {client.email && <small>{client.email}</small>}
                  </div>
                </div>

                <div className={styles.metaGrid}>
                  <span><i className="bi bi-cash-stack"></i> {formatBudget(job)}</span>
                  {job.employmentType && <span><i className="bi bi-briefcase"></i> {job.employmentType}</span>}
                  {job.experienceLevel && <span><i className="bi bi-bar-chart"></i> {job.experienceLevel}</span>}
                  {job.companyAddress && <span><i className="bi bi-geo-alt"></i> {job.companyAddress}</span>}
                  <span><i className="bi bi-calendar3"></i> Ứng tuyển {formatDate(proposal.createdAt)}</span>
                </div>

                {job.companyName && <p className={styles.companyName}><i className="bi bi-building"></i> {job.companyName}</p>}
                {job.description && <p className={styles.description}>{job.description}</p>}

                {job.requiredSkills?.length > 0 && (
                  <div className={styles.skillList}>
                    {job.requiredSkills.slice(0, 6).map((skill) => <span key={skill}>{skill}</span>)}
                  </div>
                )}

                <div className={styles.matchSection}>
                  {!matchState && (
                    <button
                      type="button"
                      className={styles.matchButton}
                      onClick={() => handleLoadMatch(proposal)}
                      disabled={isLoadingMatch || !job.id || !getFreelancerId(proposal)}
                    >
                      <i className={isLoadingMatch ? 'bi bi-hourglass-split' : 'bi bi-stars'}></i>
                      {isLoadingMatch ? 'Đang tải đánh giá...' : 'Xem đánh giá AI'}
                    </button>
                  )}

                  {matchState?.missing && (
                    <div className={styles.matchEmpty}>
                      <span>Chưa có đánh giá cho công việc này.</span>
                      <button
                        type="button"
                        className={styles.createMatchButton}
                        onClick={() => handleCreateMatch(proposal)}
                        disabled={isLoadingMatch}
                      >
                        <i className={isLoadingMatch ? 'bi bi-hourglass-split' : 'bi bi-magic'}></i>
                        {isLoadingMatch ? 'Đang tạo...' : 'Tạo đánh giá AI'}
                      </button>
                    </div>
                  )}

                  {matchState?.match && (
                    <div className={styles.matchResult}>
                      <div className={styles.matchHeader}>
                        <div><span className={styles.matchLabel}>Đánh giá độ phù hợp</span><strong>{formatScore(matchState.match.matchScore)}</strong></div>
                        {matchState.match.status && <span className={styles.matchStatus}>{matchState.match.status}</span>}
                      </div>
                      {matchState.match.coverLetter && <p className={styles.coverLetter}>{matchState.match.coverLetter}</p>}
                      <div className={styles.matchMeta}>
                        {matchState.match.bidAmount != null && <span><i className="bi bi-cash-stack"></i> Đề xuất: {formatAmount(matchState.match.bidAmount)}</span>}
                        {matchState.match.createdAt && <span><i className="bi bi-calendar3"></i> Đánh giá: {formatDate(matchState.match.createdAt)}</span>}
                      </div>
                      {matchState.match.explanation && <p className={styles.explanation}><strong>Nhận xét AI:</strong> {matchState.match.explanation}</p>}
                      <div className={styles.matchColumns}>
                        <div><h4>Kỹ năng phù hợp</h4><ul>{(matchState.match.matchingSkills || []).map((skill) => <li key={skill}><i className="bi bi-check2"></i>{skill}</li>)}</ul></div>
                        <div><h4>Kỹ năng cần cải thiện</h4><ul>{(matchState.match.missingSkills || []).map((skill) => <li key={skill}><i className="bi bi-arrow-up-right"></i>{skill}</li>)}</ul></div>
                      </div>
                    </div>
                  )}
                </div>

                {status === 'PENDING' && (
                  <div className={styles.actions}>
                    <button
                      type="button"
                      className={styles.cancelButton}
                      onClick={() => handleCancel(proposal.id)}
                      disabled={isCancelling}
                    >
                      <i className={isCancelling ? 'bi bi-hourglass-split' : 'bi bi-x-circle'}></i>
                      {isCancelling ? 'Đang hủy...' : 'Hủy đề xuất'}
                    </button>
                  </div>
                )}

                {job.id && (
                  <Link to={`/job/${job.id}`} className={styles.viewJobLink}>
                    Xem chi tiết công việc <i className="bi bi-arrow-right"></i>
                  </Link>
                )}
              </article>
            );
          })}
        </section>
      )}
    </main>
  );
}

export default FreelancerProposals;
