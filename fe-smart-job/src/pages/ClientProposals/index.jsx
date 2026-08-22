import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { aiService, jobMatchService, jobService } from '~/services';
import styles from './ClientProposals.module.scss';

const STATUS_LABELS = { 
  PENDING: 'Đang chờ phản hồi', 
  ACCEPTED: 'Đã chấp nhận', 
  REJECTED: 'Đã từ chối', 
  CANCELLED: 'Đã hủy' 
};

const STATUS_CLASSES = { 
  PENDING: styles.pending, 
  ACCEPTED: styles.accepted, 
  REJECTED: styles.rejected, 
  CANCELLED: styles.cancelled 
};

const getData = (response, fallback = []) => {
  const data = response?.data?.data ?? response?.data ?? response;
  return data?.data ?? data ?? fallback;
};

const getName = (user) => `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || user?.username || user?.email || 'Freelancer';
const getInitial = (user) => getName(user).charAt(0).toUpperCase();
const formatDate = (value) => value ? new Date(value).toLocaleString('vi-VN') : 'Chưa cập nhật';
const formatScore = (value) => { 
  const score = Number(value); 
  return Number.isFinite(score) ? `${Math.round(score <= 1 ? score * 100 : score)}%` : 'N/A'; 
};

const formatBudget = (job) => {
  if (!job?.minBudget && !job?.maxBudget) return 'Thỏa thuận';
  const currency = job.currency || 'VND';
  if (job.minBudget && job.maxBudget) return `${Number(job.minBudget).toLocaleString()} - ${Number(job.maxBudget).toLocaleString()} ${currency}`;
  return job.minBudget ? `Từ ${Number(job.minBudget).toLocaleString()} ${currency}` : `Đến ${Number(job.maxBudget).toLocaleString()} ${currency}`;
};

function ClientProposals() {
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState('');
  const [allProposals, setAllProposals] = useState([]);
  const [matchByProposal, setMatchByProposal] = useState({});
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState('');

  // 1. Tải danh sách Jobs và Proposals của Client
  useEffect(() => {
    const fetchClientData = async () => {
      try {
        setLoading(true);
        setError('');

        const [jobsRes, proposalsRes] = await Promise.all([
          jobService.getMyJobs(),
          jobService.getProposalsForClient()
        ]);

        const jobsData = getData(jobsRes);
        const proposalsData = getData(proposalsRes);

        setJobs(Array.isArray(jobsData) ? jobsData : []);
        setAllProposals(Array.isArray(proposalsData) ? proposalsData : []);
      } catch (requestError) {
        console.error('Lỗi khi tải dữ liệu Workspace Client:', requestError);
        setError(requestError.response?.data?.message || 'Không thể tải danh sách ứng tuyển.');
      } finally {
        setLoading(false);
      }
    };

    fetchClientData();
  }, []);

  const displayedProposals = selectedJobId
    ? allProposals.filter((p) => p.job?.id === selectedJobId)
    : allProposals;

  const selectedJob = jobs.find((job) => job.id === selectedJobId);

  // 2. Phản hồi Đơn ứng tuyển
  const handleRespond = async (proposalId, status) => {
    if (!proposalId || busyId) return;
    setBusyId(proposalId);
    setError('');
    try {
      const response = await jobService.respondToProposal(proposalId, status);
      const updated = getData(response);
      setAllProposals((current) =>
        current.map((proposal) =>
          proposal.id === proposalId ? { ...proposal, ...(updated || {}), status } : proposal
        )
      );
    } catch (requestError) {
      console.error('Lỗi khi phản hồi proposal:', requestError);
      setError(requestError.response?.data?.message || 'Không thể cập nhật đề xuất.');
    } finally {
      setBusyId(null);
    }
  };

  // 3. Xử lý logic Job Match: Tìm trong DB trước -> Nếu không có mới gọi AI Match
  const handleLoadMatch = async (proposal) => {
    const proposalId = proposal?.id;
    const jobId = proposal?.job?.id;
    const freelancerId = proposal?.freelancer?.id;

    if (!proposalId || !jobId || !freelancerId) {
      setError('Thiếu thông tin Job ID hoặc Freelancer ID để thực hiện đánh giá.');
      return;
    }

    if (busyId) return;
    setBusyId(proposalId);
    setError('');

    // BƯỚC 1: Kiểm tra xem JobMatch đã có dưới DB chưa
    try {
      const response = await jobMatchService.getJobMatch(jobId, freelancerId);
      const existingMatch = getData(response);

      if (existingMatch && (existingMatch.id || existingMatch.jobId)) {
        // Đã có dữ liệu trong DB -> Lưu vào state render luôn, DỪNG TẠI ĐÂY (Không gọi matchFreelancerToJob)
        setMatchByProposal((current) => ({ ...current, [proposalId]: existingMatch }));
        setBusyId(null);
        return;
      }
    } catch (getMatchError) {
      // BƯỚC 2: Nếu chưa có (Backend báo lỗi không tìm thấy) -> Bắt lỗi và tiếp tục xuống BƯỚC 3 bên dưới
      console.warn('Chưa có JobMatch dưới DB. Tiến hành gọi AI Match...');
    }

    // BƯỚC 3: Chỉ chạy khi chưa có JobMatch -> Gọi API AI Match để tính toán và lưu mới
    try {
      const matchRes = await aiService.matchFreelancerToJob({
        jobId,
        freelancerId
      });
      const newMatch = getData(matchRes);

      setMatchByProposal((current) => ({ ...current, [proposalId]: newMatch }));
    } catch (createError) {
      console.error('Lỗi khi tính toán ghép nối AI:', createError);
      setError(createError.response?.data?.message || 'Chưa thể thực hiện ghép nối AI.');
    } finally {
      setBusyId(null);
    }
  };

  return (
    <main className={styles.page}>
      <header className={styles.pageHeader}>
        <div>
          <p className={styles.eyebrow}><i className="bi bi-people-fill"></i> Client workspace</p>
          <h1>Đề xuất cho công việc</h1>
          <p className={styles.subtitle}>Xem, đánh giá và phản hồi các Freelancer đã ứng tuyển.</p>
        </div>
        <div className={styles.totalBadge}>{displayedProposals.length} ứng viên</div>
      </header>

      {error && <div className={styles.error} role="alert">{error}</div>}

      <section className={styles.jobSelector}>
        <label htmlFor="client-job">Lọc theo công việc</label>
        <select
          id="client-job"
          value={selectedJobId}
          onChange={(event) => setSelectedJobId(event.target.value)}
          disabled={loading || jobs.length === 0}
        >
          <option value="">-- Tất cả công việc ({allProposals.length} ứng tuyển) --</option>
          {jobs.map((job) => (
            <option key={job.id} value={job.id}>
              {job.title || job.id}
            </option>
          ))}
        </select>
        {selectedJob?.id && (
          <Link to={`/job/${selectedJob.id}`} className={styles.jobLink}>
            Xem Job <i className="bi bi-arrow-up-right"></i>
          </Link>
        )}
      </section>

      {selectedJob && (
        <section className={styles.jobSummary}>
          <div className={styles.summaryIcon}><i className="bi bi-briefcase-fill"></i></div>
          <div className={styles.summaryContent}>
            <span className={styles.summaryLabel}>Đang lọc đề xuất cho</span>
            <h2>{selectedJob.title || 'Công việc chưa cập nhật tiêu đề'}</h2>
            <div className={styles.summaryMeta}>
              {selectedJob.companyName && <span><i className="bi bi-building"></i>{selectedJob.companyName}</span>}
              {selectedJob.companyAddress && <span><i className="bi bi-geo-alt"></i>{selectedJob.companyAddress}</span>}
              <span><i className="bi bi-cash-stack"></i>{formatBudget(selectedJob)}</span>
            </div>
          </div>
        </section>
      )}

      {loading ? (
        <div className={styles.stateCard} role="status">
          <span className={styles.spinner}></span>Đang tải đề xuất...
        </div>
      ) : displayedProposals.length === 0 ? (
        <section className={styles.emptyCard}>
          <i className="bi bi-inbox"></i>
          <h2>Chưa có đề xuất nào</h2>
          <p>Các Freelancer ứng tuyển sẽ xuất hiện tại đây.</p>
        </section>
      ) : (
        <section className={styles.proposalList}>
          {displayedProposals.map((proposal) => {
            const freelancer = proposal.freelancer || {};
            const profile = proposal.freelancerProfile || {};
            const jobInfo = proposal.job || {};
            const status = proposal.status || 'PENDING';
            const match = matchByProposal[proposal.id];
            const isBusy = busyId === proposal.id;

            return (
              <article className={styles.proposalCard} key={proposal.id}>
                {jobInfo.title && (
                  <div style={{ marginBottom: '12px', fontSize: '0.85rem', color: '#0f766e', fontWeight: 'bold' }}>
                    <i className="bi bi-briefcase" style={{ marginRight: '6px' }}></i>
                    Ứng tuyển cho: <Link to={`/job/${jobInfo.id}`} style={{ color: '#0f766e', textDecoration: 'underline' }}>{jobInfo.title}</Link>
                  </div>
                )}

                <div className={styles.cardHeader}>
                  <div className={styles.identity}>
                    {freelancer.avatarUrl ? (
                      <img src={freelancer.avatarUrl} alt={getName(freelancer)} />
                    ) : (
                      <div className={styles.avatarFallback}>{getInitial(freelancer)}</div>
                    )}
                    <div>
                      <span className={styles.label}>Freelancer ứng tuyển</span>
                      <h2>{getName(freelancer)}</h2>
                      {profile.title && <p>{profile.title}</p>}
                    </div>
                  </div>
                  <span className={`${styles.status} ${STATUS_CLASSES[status] || styles.pending}`}>
                    {STATUS_LABELS[status] || status}
                  </span>
                </div>

                <div className={styles.meta}>
                  <span><i className="bi bi-envelope"></i> {freelancer.email || 'Chưa cập nhật email'}</span>
                  <span><i className="bi bi-calendar3"></i> Ứng tuyển {formatDate(proposal.createdAt)}</span>
                  {profile.hourlyRate != null && <span><i className="bi bi-cash"></i> ${profile.hourlyRate}/giờ</span>}
                </div>

                {profile.skills?.length > 0 && (
                  <div className={styles.skills}>
                    {profile.skills.slice(0, 8).map((skill) => (
                      <span key={skill}>{skill}</span>
                    ))}
                  </div>
                )}

                <div className={styles.actions}>
                  <button type="button" className={styles.matchButton} onClick={() => handleLoadMatch(proposal)} disabled={isBusy}>
                    {isBusy ? 'Đang phân tích...' : 'Xem AI Match'} <i className="bi bi-stars"></i>
                  </button>
                  {status === 'PENDING' && (
                    <>
                      <button type="button" className={styles.rejectButton} onClick={() => handleRespond(proposal.id, 'REJECTED')} disabled={isBusy}>
                        Từ chối
                      </button>
                      <button type="button" className={styles.acceptButton} onClick={() => handleRespond(proposal.id, 'ACCEPTED')} disabled={isBusy}>
                        Chấp nhận
                      </button>
                    </>
                  )}
                </div>

                {match && (
                  <div className={styles.matchPanel}>
                    <div className={styles.matchTop}>
                      <span>Điểm phù hợp</span>
                      <strong>{formatScore(match.matchScore)}</strong>
                      <em>{match.status || 'MATCHED'}</em>
                    </div>

                    {match.coverLetter && (
                      <p style={{ marginTop: '10px' }}><b>Cover Letter:</b> {match.coverLetter}</p>
                    )}

                    {match.explanation && (
                      <p style={{ marginTop: '6px' }}><b>Nhận xét AI:</b> {match.explanation}</p>
                    )}

                    <div className={styles.matchMeta}>
                      {match.bidAmount != null && (
                        <span><i className="bi bi-cash-coin"></i> Mức giá chào: {Number(match.bidAmount).toLocaleString('vi-VN')} VND</span>
                      )}
                      {match.createdAt && (
                        <span><i className="bi bi-clock-history"></i> Thời gian: {formatDate(match.createdAt)}</span>
                      )}
                    </div>

                    <div className={styles.matchColumns}>
                      <div>
                        <b><i className="bi bi-check-circle-fill" style={{ color: '#16a34a', marginRight: '6px' }}></i>Kỹ năng khớp</b>
                        <ul>
                          {match.matchingSkills?.length > 0 ? (
                            match.matchingSkills.map((skill) => <li key={skill}>{skill}</li>)
                          ) : (
                            <li>Không có thông tin</li>
                          )}
                        </ul>
                      </div>
                      <div>
                        <b><i className="bi bi-x-circle-fill" style={{ color: '#dc2626', marginRight: '6px' }}></i>Kỹ năng thiếu</b>
                        <ul>
                          {match.missingSkills?.length > 0 ? (
                            match.missingSkills.map((skill) => <li key={skill}>{skill}</li>)
                          ) : (
                            <li>Không có thông tin</li>
                          )}
                        </ul>
                      </div>
                    </div>
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

export default ClientProposals;