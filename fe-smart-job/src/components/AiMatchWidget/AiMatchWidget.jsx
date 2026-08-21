import React, { useState } from 'react';
import { aiService } from '../../services';
import styles from './AiMatchWidget.module.scss';

const getMatchData = (response) => response?.data?.data || response?.data || {};

const getSkills = (value) => {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value === 'string') return value.split(',').map((skill) => skill.trim()).filter(Boolean);
  return [];
};

function AiMatchWidget({ jobId }) {
  const [loading, setLoading] = useState(false);
  const [matchData, setMatchData] = useState(null);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (!jobId) {
      setError('Không tìm thấy mã công việc để phân tích.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await aiService.matchFreelancerToJob({ jobId });
      setMatchData(getMatchData(response));
    } catch (requestError) {
      console.error('Lỗi khi phân tích độ phù hợp bằng AI:', requestError);
      setError(
        requestError?.response?.data?.message ||
          requestError?.response?.data?.msg ||
          'Không thể phân tích độ phù hợp lúc này. Vui lòng thử lại.',
      );
    } finally {
      setLoading(false);
    }
  };

  const score = Math.max(0, Math.min(100, Number(matchData?.matchScore ?? matchData?.score) || 0));
  const matchingSkills = getSkills(matchData?.matchingSkills ?? matchData?.matchedSkills);
  const missingSkills = getSkills(matchData?.missingSkills ?? matchData?.skillsMissing);
  const explanation = matchData?.explanation || matchData?.aiReason || matchData?.reason;
  const scoreClass = score > 70 ? styles.high : score >= 50 ? styles.medium : styles.low;

  return (
    <section className={styles.widget} aria-live="polite">
      {!matchData && !loading && (
        <button type="button" className={styles.analyzeButton} onClick={handleAnalyze}>
          <i className="bi bi-stars" aria-hidden="true"></i>
          Phân tích độ phù hợp với AI
        </button>
      )}

      {loading && (
        <div className={styles.loadingState} role="status">
          <span className={styles.spinner} aria-hidden="true"></span>
          AI đang phân tích hồ sơ và yêu cầu công việc...
        </div>
      )}

      {error && <p className={styles.error} role="alert">{error}</p>}

      {matchData && !loading && (
        <div className={styles.result}>
          <div className={styles.resultHeader}>
            <div>
              <p className={styles.eyebrow}><i className="bi bi-stars" aria-hidden="true"></i> Smart Matching Engine</p>
              <h3>Độ phù hợp với công việc</h3>
            </div>
            <strong className={`${styles.score} ${scoreClass}`}>{score}%</strong>
          </div>

          <div className={styles.progressTrack} aria-label={`Độ phù hợp ${score}%`}>
            <div className={`${styles.progressValue} ${scoreClass}`} style={{ width: `${score}%` }} />
          </div>

          <div className={styles.skillSection}>
            <h4>Kỹ năng đáp ứng</h4>
            <div className={styles.chips}>
              {matchingSkills.length > 0 ? matchingSkills.map((skill) => (
                <span key={skill} className={`${styles.chip} ${styles.matchChip}`}>
                  <i className="bi bi-check2" aria-hidden="true"></i> {skill}
                </span>
              )) : <span className={styles.emptyText}>Chưa có dữ liệu kỹ năng khớp.</span>}
            </div>
          </div>

          <div className={styles.skillSection}>
            <h4>Kỹ năng còn thiếu</h4>
            <div className={styles.chips}>
              {missingSkills.length > 0 ? missingSkills.map((skill) => (
                <span key={skill} className={`${styles.chip} ${styles.missingChip}`}>
                  <i className="bi bi-dash" aria-hidden="true"></i> {skill}
                </span>
              )) : <span className={styles.emptyText}>Không phát hiện kỹ năng còn thiếu.</span>}
            </div>
          </div>

          {explanation && (
            <blockquote className={styles.explanation}>
              <i className="bi bi-quote" aria-hidden="true"></i>
              <span>{explanation}</span>
            </blockquote>
          )}

          <button type="button" className={styles.retryButton} onClick={handleAnalyze}>
            <i className="bi bi-arrow-clockwise" aria-hidden="true"></i> Phân tích lại
          </button>
        </div>
      )}
    </section>
  );
}

export default AiMatchWidget;
