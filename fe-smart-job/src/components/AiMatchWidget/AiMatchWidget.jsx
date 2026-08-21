import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { aiService } from '../../services';
import styles from './AiMatchWidget.module.scss';

const getMatchData = (response) => response?.data?.data || response?.data || {};
const getRoadmapData = (response) => response?.data?.data || response?.data || {};
const ROADMAP_STORAGE_KEY = 'smart-job-roadmap-match-ids';

const getSkills = (value) => {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value === 'string') return value.split(',').map((skill) => skill.trim()).filter(Boolean);
  return [];
};

const getScore = (matchData) => {
  const rawScore = Number(matchData?.matchScore);
  if (!Number.isFinite(rawScore)) return 0;
  return rawScore <= 1 ? rawScore * 100 : rawScore;
};

function AiMatchWidget({ jobId }) {
  const [loading, setLoading] = useState(false);
  const [matchData, setMatchData] = useState(null);
  const [error, setError] = useState('');
  const [roadmap, setRoadmap] = useState(null);
  const [roadmapLoading, setRoadmapLoading] = useState(false);
  const [roadmapError, setRoadmapError] = useState('');

  const saveRoadmapMatchId = (matchId) => {
    const savedMatchIds = JSON.parse(localStorage.getItem(ROADMAP_STORAGE_KEY) || '[]');
    if (!savedMatchIds.includes(matchId)) {
      localStorage.setItem(ROADMAP_STORAGE_KEY, JSON.stringify([...savedMatchIds, matchId]));
    }
  };

  const loadRoadmap = async (matchId, allowGenerate = true) => {
    if (!matchId) return;

    setRoadmapLoading(true);
    setRoadmapError('');
    try {
      let response;

      if (allowGenerate) {
        try {
          response = await aiService.generateRoadmap({ matchId });
        } catch (generationError) {
          // A roadmap may already exist, so use the read endpoint as a fallback.
          response = await aiService.getRoadmapByMatchId(matchId);
          if (!response) throw generationError;
        }
      } else {
        response = await aiService.getRoadmapByMatchId(matchId);
      }

      setRoadmap(getRoadmapData(response));
      saveRoadmapMatchId(matchId);
    } catch (requestError) {
      console.error('Lỗi khi tải lộ trình bằng AI:', requestError);
      setRoadmapError(
        requestError?.response?.data?.message ||
          'Không thể tải lộ trình lúc này. Vui lòng thử lại.',
      );
    } finally {
      setRoadmapLoading(false);
    }
  };

  const handleAnalyze = async () => {
    if (!jobId) {
      setError('Không tìm thấy mã công việc để phân tích.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await aiService.matchFreelancerToJob({ jobId });
      const nextMatchData = getMatchData(response);
      setMatchData(nextMatchData);

      const matchId = nextMatchData?.id || nextMatchData?.matchId;
      if (getScore(nextMatchData) < 80 && matchId) {
        await loadRoadmap(matchId);
      } else {
        setRoadmap(null);
        setRoadmapError('');
      }
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

  const handleGenerateRoadmap = async () => {
    const matchId = matchData?.id || matchData?.matchId;
    if (!matchId) {
      setRoadmapError('Kết quả AI Match chưa có mã match để tạo lộ trình.');
      return;
    }
    await loadRoadmap(matchId);
  };

  const score = Math.max(0, Math.min(100, getScore(matchData)));
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

          {score < 80 && !roadmap && (
            <div className={styles.roadmapPrompt}>
              <div>
                <h4>Cải thiện khả năng phù hợp</h4>
                <p>AI có thể tạo lộ trình học tập dựa trên các kỹ năng còn thiếu.</p>
              </div>
              <button
                type="button"
                className={styles.roadmapButton}
                onClick={handleGenerateRoadmap}
                disabled={roadmapLoading}
              >
                <i className="bi bi-map" aria-hidden="true"></i>
                {roadmapLoading ? 'Đang tạo lộ trình...' : 'Tạo lộ trình học tập'}
              </button>
            </div>
          )}

          {roadmapLoading && (
            <div className={styles.loadingState} role="status">
              <span className={styles.spinner} aria-hidden="true"></span>
              AI đang xây dựng lộ trình cải thiện kỹ năng...
            </div>
          )}

          {roadmapError && <p className={styles.error} role="alert">{roadmapError}</p>}

          {roadmap && (
            <div className={styles.roadmap}>
              <div className={styles.roadmapHeader}>
                <div>
                  <p className={styles.eyebrow}>AI ROADMAP</p>
                  <h4>Lộ trình cải thiện kỹ năng</h4>
                </div>
                <span>{roadmap.completedSteps || 0}/{roadmap.totalSteps || roadmap.steps?.length || 0} bước</span>
              </div>
              <ol className={styles.stepList}>
                {(roadmap.steps || []).map((step) => (
                  <li key={step.id || step.stepNumber} className={step.isCompleted ? styles.completedStep : ''}>
                    <strong>Bước {step.stepNumber}</strong>
                    <span>{step.missingSkill}</span>
                    <p>{step.action}</p>
                    <small>{step.estimatedHours || 0} giờ dự kiến</small>
                    {step.resourceUrl && (
                      <a href={step.resourceUrl} target="_blank" rel="noopener noreferrer">Xem tài liệu</a>
                    )}
                  </li>
                ))}
              </ol>
              <Link className={styles.roadmapLink} to="/freelancer/roadmaps">
                Đến trang quản lý lộ trình học tập <i className="bi bi-arrow-right" aria-hidden="true"></i>
              </Link>
            </div>
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
