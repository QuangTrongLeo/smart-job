import React, { useEffect, useState } from 'react';
import { aiService } from '~/services';
import styles from './FreelancerRoadmaps.module.scss';

const getRoadmapsFromResponse = (response) => {
  const data = response?.data?.data || response?.data || [];
  return Array.isArray(data) ? data : [];
};

const getProgress = (roadmap) => {
  const totalSteps = Number(roadmap?.totalSteps) || roadmap?.steps?.length || 0;
  const completedSteps = Number(roadmap?.completedSteps) || 0;
  return totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;
};

const formatDate = (dateValue) => {
  if (!dateValue) return 'Chưa xác định ngày tạo';
  return new Date(dateValue).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

function FreelancerRoadmaps() {
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingStepId, setUpdatingStepId] = useState(null);

  const fetchRoadmaps = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await aiService.getMyRoadmaps();
      setRoadmaps(getRoadmapsFromResponse(response));
    } catch (requestError) {
      console.error('Lỗi khi tải danh sách lộ trình:', requestError);
      setError(
        requestError.response?.data?.message ||
          'Không thể tải danh sách lộ trình. Vui lòng thử lại sau.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoadmaps();
  }, []);

  const summary = roadmaps.reduce(
    (result, roadmap) => {
      const steps = Array.isArray(roadmap.steps) ? roadmap.steps : [];
      result.total += Number(roadmap.totalSteps) || steps.length;
      result.completed += Number(roadmap.completedSteps) || steps.filter((step) => step.isCompleted).length;
      return result;
    },
    { total: 0, completed: 0 }
  );
  const overallProgress = summary.total > 0 ? Math.round((summary.completed / summary.total) * 100) : 0;

  const handleToggleStep = async (roadmapId, stepId, completed) => {
    if (!stepId || updatingStepId) return;

    const previousRoadmaps = roadmaps;
    setUpdatingStepId(stepId);
    setRoadmaps((currentRoadmaps) =>
      currentRoadmaps.map((roadmap) => {
        if (roadmap.id !== roadmapId) return roadmap;

        const steps = (roadmap.steps || []).map((step) =>
          step.id === stepId ? { ...step, isCompleted: completed } : step
        );
        const completedSteps = steps.filter((step) => step.isCompleted).length;

        return { ...roadmap, steps, completedSteps, totalSteps: steps.length };
      })
    );

    try {
      await aiService.toggleRoadmapStepCompletion(stepId, completed);
    } catch (requestError) {
      console.error('Lỗi khi cập nhật bước lộ trình:', requestError);
      setRoadmaps(previousRoadmaps);
      setError('Không thể cập nhật bước học tập. Vui lòng thử lại.');
    } finally {
      setUpdatingStepId(null);
    }
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.statusState}>
          <div className="spinner-border text-primary" role="status" />
          <p>Đang tải lộ trình học tập...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <div>
          <span className={styles.eyebrow}>AI SKILL DEVELOPMENT</span>
          <h1>Lộ trình phát triển kỹ năng</h1>
          <p>Theo dõi các bước cải thiện kỹ năng được đề xuất cho những công việc bạn quan tâm.</p>
        </div>
        <button type="button" className={styles.refreshButton} onClick={fetchRoadmaps} disabled={loading}>
          <i className="bi bi-arrow-clockwise" /> Làm mới
        </button>
      </header>

      {roadmaps.length > 0 && (
        <section className={styles.overview} aria-label="Tổng quan tiến độ học tập">
          <div className={styles.overviewIntro}>
            <span className={styles.overviewIcon}><i className="bi bi-graph-up-arrow" /></span>
            <div>
              <span className={styles.overviewLabel}>TIẾN ĐỘ TỔNG QUAN</span>
              <strong>{overallProgress}% hoàn thành</strong>
            </div>
          </div>
          <div className={styles.overviewTrack}>
            <span style={{ width: `${overallProgress}%` }} />
          </div>
          <div className={styles.overviewStats}>
            <span><strong>{roadmaps.length}</strong> lộ trình</span>
            <span><strong>{summary.completed}</strong>/{summary.total} bước</span>
          </div>
        </section>
      )}

      {error && (
        <div className={styles.errorState} role="alert">
          <i className="bi bi-exclamation-triangle-fill" />
          <span>{error}</span>
          <button type="button" onClick={() => setError('')} aria-label="Đóng thông báo">
            <i className="bi bi-x-lg" />
          </button>
        </div>
      )}

      {roadmaps.length === 0 ? (
        <div className={styles.emptyState}>
          <i className="bi bi-map" />
          <h2>Chưa có lộ trình nào</h2>
          <p>Hãy kiểm tra độ tương thích với một công việc để tạo lộ trình AI đầu tiên.</p>
        </div>
      ) : (
        <div className={styles.roadmapList}>
          {roadmaps.map((roadmap) => {
            const steps = Array.isArray(roadmap.steps) ? roadmap.steps : [];
            const progress = getProgress(roadmap);

            return (
              <section className={styles.roadmapCard} key={roadmap.id || roadmap.matchId}>
                <div className={styles.roadmapHeader}>
                  <div>
                    <span className={styles.roadmapLabel}>LỘ TRÌNH AI</span>
                    <h2>{roadmap.jobTitle || `Lộ trình cho công việc #${roadmap.jobId || 'N/A'}`}</h2>
                    <p>Mã kết quả: {roadmap.matchId || 'N/A'} · Tạo ngày {formatDate(roadmap.createdAt)}</p>
                  </div>
                  <span className={`${styles.progressBadge} ${progress === 100 ? styles.progressComplete : ''}`}>
                    {progress === 100 ? 'Đã hoàn thành' : `${progress}% hoàn thành`}
                  </span>
                </div>

                <div className={styles.progressTrack} aria-label={`Đã hoàn thành ${progress}%`}>
                  <span style={{ width: `${progress}%` }} />
                </div>
                <div className={styles.progressMeta}>
                  <span>{roadmap.completedSteps || 0}/{roadmap.totalSteps || steps.length} bước hoàn thành</span>
                  <span>Mục tiêu: {roadmap.targetScore ?? 'N/A'} điểm</span>
                </div>

                <div className={styles.stepList}>
                  {steps.map((step, index) => {
                    const completed = Boolean(step.isCompleted);
                    return (
                      <article className={`${styles.step} ${completed ? styles.completed : ''}`} key={step.id || index}>
                        <label className={styles.stepCheck}>
                          <input
                            type="checkbox"
                            checked={completed}
                            disabled={updatingStepId === step.id}
                            onChange={(event) => handleToggleStep(roadmap.id, step.id, event.target.checked)}
                          />
                          <span className={styles.checkmark}><i className="bi bi-check" /></span>
                        </label>
                        <div className={styles.stepContent}>
                          <span className={styles.stepNumber}>Bước {step.stepNumber || index + 1}</span>
                          <h3>{step.missingSkill || 'Kỹ năng cần cải thiện'}</h3>
                          <p>{step.action || 'Hoàn thành nội dung học tập được đề xuất.'}</p>
                          <div className={styles.stepMeta}>
                            <span><i className="bi bi-clock" /> {step.estimatedHours || 0} giờ dự kiến</span>
                            {step.resourceUrl && (
                              <a href={step.resourceUrl} target="_blank" rel="noopener noreferrer">
                                <i className="bi bi-box-arrow-up-right" /> Tài liệu tham khảo
                              </a>
                            )}
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default FreelancerRoadmaps;
