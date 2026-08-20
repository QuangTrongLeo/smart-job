import React, { useState, useEffect } from 'react';
import { userService, freelancerService, aiService } from '../../services';
import styles from './FreelancerProfileManager.module.scss';

const DEFAULT_AVATAR = 'https://ui-avatars.com/api/?background=2563eb&color=fff&name=User';

const initialForm = {
  title: '', bio: '', yearsOfExperience: 0, availabilityStatus: 'AVAILABLE',
  address: '', hourlyRate: 0, availableHours: '40h/tuần', cvUrl: '',
  languages: [], skills: [], portfolioUrls: [], experiences: [],
};

const initialExp = { title: '', company: '', startDate: '', endDate: '', isCurrent: false, description: '' };
const initialSelectedFields = {
  title: true,
  bio: true,
  yearsOfExperience: true,
  skills: true,
  experiences: true,
  languages: true,
};

function FreelancerProfileManager() {
  const [userData, setUserData] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);

  const [formData, setFormData] = useState(initialForm);
  const [expForm, setExpForm] = useState(initialExp);
  const [tempInputs, setTempInputs] = useState({ skill: '', lang: '', portfolio: '' });
  const [parsingCv, setParsingCv] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);
  const [parsedData, setParsedData] = useState(null);
  const [selectedFields, setSelectedFields] = useState(initialSelectedFields);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (!notification) return undefined;

    const timeoutId = window.setTimeout(() => setNotification(null), 4000);
    return () => window.clearTimeout(timeoutId);
  }, [notification]);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [userRes, profileRes] = await Promise.allSettled([
        userService.getMyProfile(),
        freelancerService.getMyProfile(),
      ]);

      if (userRes.status === 'fulfilled') {
        setUserData(userRes.value?.data?.data || userRes.value?.data);
      }

      if (profileRes.status === 'fulfilled' && profileRes.value?.data) {
        const data = profileRes.value?.data?.data || profileRes.value?.data;
        setProfile(data);
        setHasProfile(true);
        setFormData({ ...initialForm, ...data });
      } else {
        setHasProfile(false);
      }
    } catch (error) {
      console.error('Lỗi khi tải thông tin:', error);
    } finally {
      setLoading(false);
    }
  };

  // Helper xử lý Input chung
  const handleInputChange = (e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  
  // Helper xử lý Thêm/Xóa mảng (Skills, Languages, Portfolio) chung để giảm code lặp
  const handleArrayAdd = (field, inputKey) => {
    const val = tempInputs[inputKey]?.trim();
    if (val && !formData[field].includes(val)) {
      setFormData((prev) => ({ ...prev, [field]: [...prev[field], val] }));
      setTempInputs((prev) => ({ ...prev, [inputKey]: '' }));
    }
  };

  const handleArrayRemove = (field, index) => {
    setFormData((prev) => ({ ...prev, [field]: prev[field].filter((_, i) => i !== index) }));
  };

  const handleCvParse = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    setParsingCv(true);
    try {
      const response = await aiService.parseCv(file);
      const data = response?.data?.data || response?.data;
      setParsedData({
        ...data,
        skills: Array.isArray(data?.skills) ? data.skills : [],
        languages: Array.isArray(data?.languages) ? data.languages : [],
        experiences: Array.isArray(data?.experiences) ? data.experiences : [],
      });
      setSelectedFields(initialSelectedFields);
      setShowAiModal(true);
    } catch (error) {
      setNotification({ type: 'error', message: 'Không thể bóc tách CV. Vui lòng thử lại.' });
    } finally {
      setParsingCv(false);
    }
  };

  const closeAiModal = () => {
    setShowAiModal(false);
    setParsedData(null);
    setSelectedFields(initialSelectedFields);
  };

  const toggleAllFields = (checked) => {
    setSelectedFields(Object.keys(initialSelectedFields).reduce((fields, field) => ({
      ...fields,
      [field]: checked,
    }), {}));
  };

  const applyParsedData = () => {
    setFormData((prev) => {
      const nextData = { ...prev };

      ['title', 'bio', 'yearsOfExperience'].forEach((field) => {
        if (selectedFields[field] && parsedData?.[field] !== undefined) nextData[field] = parsedData[field];
      });

      ['skills', 'languages'].forEach((field) => {
        if (selectedFields[field]) {
          nextData[field] = [...new Set([...(prev[field] || []), ...(parsedData?.[field] || [])])];
        }
      });

      if (selectedFields.experiences) {
        const existingExperiences = prev.experiences || [];
        const parsedExperiences = parsedData?.experiences || [];
        nextData.experiences = [...existingExperiences];
        parsedExperiences.forEach((experience) => {
          const isDuplicate = existingExperiences.some((current) => (
            current.title === experience.title
            && current.company === experience.company
            && current.startDate === experience.startDate
          ));
          if (!isDuplicate) nextData.experiences.push(experience);
        });
      }

      return nextData;
    });
    setIsEditing(true);
    closeAiModal();
  };

  const renderCvUpload = () => (
    <label className={`${styles.aiUploadButton} ${parsingCv ? styles.aiUploadDisabled : ''}`}>
      <i className={parsingCv ? 'bi bi-arrow-repeat' : 'bi bi-stars'}></i>
      {parsingCv ? 'Đang bóc tách CV...' : 'Nhập tự động từ CV'}
      <input type="file" accept=".pdf,.doc,.docx" onChange={handleCvParse} disabled={parsingCv} />
    </label>
  );

  // Kinh nghiệm làm việc
  const handleAddExperience = () => {
    if (expForm.title && expForm.company) {
      setFormData((prev) => ({ ...prev, experiences: [...prev.experiences, { ...expForm }] }));
      setExpForm(initialExp);
    }
  };

  // Submit / Delete
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const action = hasProfile ? freelancerService.updateMyProfile : freelancerService.createMyProfile;
      await action(formData);
      setNotification({
        type: 'success',
        message: `${hasProfile ? 'Cập nhật' : 'Tạo'} hồ sơ thành công!`,
      });
      setHasProfile(true);
      setIsEditing(false);
      fetchInitialData();
    } catch (error) {
      setNotification({ type: 'error', message: 'Có lỗi xảy ra khi lưu hồ sơ.' });
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Bạn có chắc muốn xóa hồ sơ Freelancer này?')) {
      try {
        await freelancerService.deleteMyProfile();
        setNotification({ type: 'success', message: 'Xóa hồ sơ thành công.' });
        setProfile(null);
        setHasProfile(false);
        setIsEditing(false);
      } catch (error) {
        console.error('Lỗi khi xóa:', error);
        setNotification({ type: 'error', message: 'Có lỗi xảy ra khi xóa hồ sơ.' });
      }
    }
  };

  if (loading) return <div className={styles.loadingContainer}><p>Đang tải thông tin...</p></div>;

  const fullName = `${userData?.firstName || ''} ${userData?.lastName || ''}`.trim() || userData?.username || 'Freelancer';

  return (
    <div className={styles.profileContainer}>
      {notification && (
        <div className={`${styles.notification} ${styles[`notification${notification.type === 'success' ? 'Success' : 'Error'}`]}`} role="alert">
          <i className={`bi ${notification.type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill'}`}></i>
          <span>{notification.message}</span>
          <button type="button" onClick={() => setNotification(null)} aria-label="Đóng thông báo">
            <i className="bi bi-x-lg"></i>
          </button>
        </div>
      )}
      {/* Header Info từ UserResponse */}
      <div className={styles.headerCard}>
        <div className={styles.userInfoGroup}>
          <img src={userData?.avatarUrl || DEFAULT_AVATAR} alt={fullName} className={styles.avatar} onError={(e) => { e.target.src = DEFAULT_AVATAR; }} />
          <div className={styles.userText}>
            <div className={styles.nameBadge}>
              <h2>{fullName}</h2>
              {profile?.isVerified && <i className="bi bi-patch-check-fill text-primary" title="Đã xác thực"></i>}
            </div>
            <p className={styles.usernameEmail}>
              <span>@{userData?.username || 'username'}</span> • <span>{userData?.email || 'N/A'}</span>
            </p>
            <span className={styles.statusBadge}>{userData?.status || 'ACTIVE'}</span>
          </div>
        </div>

        <div className={styles.headerActions}>
          {hasProfile && !isEditing && (
            <>
              <button className={styles.btnPrimary} onClick={() => setIsEditing(true)}><i className="bi bi-pencil-square"></i> Cập nhật hồ sơ</button>
              <button className={styles.btnDanger} onClick={handleDelete}><i className="bi bi-trash"></i> Xóa</button>
            </>
          )}
          {isEditing && <button className={styles.btnSecondary} onClick={() => setIsEditing(false)}>Hủy bỏ</button>}
        </div>
      </div>

      {!hasProfile && !isEditing ? (
        <div className={styles.emptyCard}>
          <i className="bi bi-person-badge icon"></i>
          <h3>Bạn chưa tạo hồ sơ Freelancer</h3>
          <p>Tạo hồ sơ cá nhân ngay để bắt đầu ứng tuyển các công việc phù hợp.</p>
          <button className={styles.btnPrimary} onClick={() => setIsEditing(true)}>Tạo hồ sơ ngay</button>
          {renderCvUpload()}
        </div>
      ) : isEditing ? (
        /* Edit Form */
        <form onSubmit={handleSubmit} className={styles.formLayout}>
          <div className={styles.aiBanner}>
            <div>
              <strong>Tiết kiệm thời gian nhập liệu</strong>
              <p>Tải CV để AI gợi ý thông tin hồ sơ cho bạn.</p>
            </div>
            {renderCvUpload()}
          </div>
          <div className={styles.card}>
            <h3>Thông tin chung</h3>
            <div className={styles.formGroup}>
              <label>Chức danh nghề nghiệp</label>
              <input type="text" name="title" value={formData.title} onChange={handleInputChange} placeholder="VD: Senior Fullstack Developer" required />
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Kinh nghiệm (Năm)</label>
                <input type="number" name="yearsOfExperience" value={formData.yearsOfExperience} onChange={handleInputChange} min="0" />
              </div>
              <div className={styles.formGroup}>
                <label>Mức lương giờ ($/h)</label>
                <input type="number" name="hourlyRate" value={formData.hourlyRate} onChange={handleInputChange} step="0.5" />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Trạng thái</label>
                <select name="availabilityStatus" value={formData.availabilityStatus} onChange={handleInputChange}>
                  <option value="AVAILABLE">Sẵn sàng nhận việc</option>
                  <option value="BUSY">Đang bận</option>
                  <option value="UNAVAILABLE">Không nhận việc</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>Thời gian làm việc</label>
                <input type="text" name="availableHours" value={formData.availableHours} onChange={handleInputChange} placeholder="VD: 40h/tuần" />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>Địa chỉ</label>
              <input type="text" name="address" value={formData.address} onChange={handleInputChange} placeholder="Hà Nội, Việt Nam" />
            </div>

            <div className={styles.formGroup}>
              <label>Giới thiệu bản thân (Bio)</label>
              <textarea name="bio" rows="3" value={formData.bio} onChange={handleInputChange} placeholder="Mô tả thế mạnh, kinh nghiệm..." />
            </div>

            <div className={styles.formGroup}>
              <label>Đường dẫn CV (URL)</label>
              <input type="url" name="cvUrl" value={formData.cvUrl} onChange={handleInputChange} placeholder="https://drive.google.com/..." />
            </div>
          </div>

          {/* Dynamic List inputs */}
          <div className={styles.card}>
            <h3>Kỹ năng & Thông tin thêm</h3>
            {[
              { title: 'Kỹ năng (Skills)', field: 'skills', key: 'skill', ph: 'ReactJS, Java...' },
              { title: 'Ngoại ngữ (Languages)', field: 'languages', key: 'lang', ph: 'Tiếng Anh...' },
            ].map(({ title, field, key, ph }) => (
              <div className={styles.formGroup} key={field}>
                <label>{title}</label>
                <div className={styles.inputAppend}>
                  <input type="text" value={tempInputs[key]} onChange={(e) => setTempInputs({ ...tempInputs, [key]: e.target.value })} placeholder={`VD: ${ph}`} />
                  <button type="button" onClick={() => handleArrayAdd(field, key)}>Thêm</button>
                </div>
                <div className={styles.tagGroup}>
                  {formData[field].map((item, idx) => (
                    <span key={idx} className={styles.tag}>
                      {item} <i className="bi bi-x" onClick={() => handleArrayRemove(field, idx)}></i>
                    </span>
                  ))}
                </div>
              </div>
            ))}

            <div className={styles.formGroup}>
              <label>Portfolio URLs</label>
              <div className={styles.inputAppend}>
                <input type="url" value={tempInputs.portfolio} onChange={(e) => setTempInputs({ ...tempInputs, portfolio: e.target.value })} placeholder="https://github.com/..." />
                <button type="button" onClick={() => handleArrayAdd('portfolioUrls', 'portfolio')}>Thêm</button>
              </div>
              <ul className={styles.listUrls}>
                {formData.portfolioUrls.map((url, idx) => (
                  <li key={idx}>
                    <a href={url} target="_blank" rel="noreferrer">{url}</a>
                    <i className="bi bi-trash" onClick={() => handleArrayRemove('portfolioUrls', idx)}></i>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Work Experience Form */}
          <div className={styles.card}>
            <h3>Kinh nghiệm làm việc</h3>
            <div className={styles.subForm}>
              <div className={styles.formRow}>
                <input type="text" placeholder="Chức danh" value={expForm.title} onChange={(e) => setExpForm({ ...expForm, title: e.target.value })} />
                <input type="text" placeholder="Công ty" value={expForm.company} onChange={(e) => setExpForm({ ...expForm, company: e.target.value })} />
              </div>
              <div className={styles.formRow}>
                <input type="date" value={expForm.startDate} onChange={(e) => setExpForm({ ...expForm, startDate: e.target.value })} />
                <input type="date" disabled={expForm.isCurrent} value={expForm.endDate} onChange={(e) => setExpForm({ ...expForm, endDate: e.target.value })} />
              </div>
              <label className={styles.checkboxLabel}>
                <input type="checkbox" checked={expForm.isCurrent} onChange={(e) => setExpForm({ ...expForm, isCurrent: e.target.checked })} /> Đang làm việc ở đây
              </label>
              <textarea placeholder="Mô tả công việc..." rows="2" value={expForm.description} onChange={(e) => setExpForm({ ...expForm, description: e.target.value })} />
              <button type="button" className={styles.btnSecondary} onClick={handleAddExperience}>+ Thêm kinh nghiệm</button>
            </div>

            <div className={styles.expList}>
              {formData.experiences.map((exp, idx) => (
                <div key={idx} className={styles.expCard}>
                  <div>
                    <strong>{exp.title}</strong> - <span>{exp.company}</span>
                    <p className={styles.date}>{exp.startDate} ~ {exp.isCurrent ? 'Hiện tại' : exp.endDate}</p>
                    <p>{exp.description}</p>
                  </div>
                  <i className="bi bi-trash" onClick={() => handleArrayRemove('experiences', idx)}></i>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.formActions}>
            <button type="submit" className={styles.btnPrimary}>Lưu thay đổi</button>
          </div>
        </form>
      ) : (
        /* Profile Detail View */
        <div className={styles.viewLayout}>
          <div className={styles.mainContent}>
            <div className={styles.card}>
              <h1 className={styles.profileTitle}>{profile?.title}</h1>
              <p className={styles.bio}>{profile?.bio || 'Chưa cập nhật phần giới thiệu bản thân.'}</p>
            </div>

            <div className={styles.card}>
              <h3>Kỹ năng chuyên môn</h3>
              <div className={styles.skillsGroup}>
                {profile?.skills?.length ? (
                  profile.skills.map((skill, idx) => <span key={idx} className={styles.skillBadge}>#{skill}</span>)
                ) : (
                  <p className={styles.emptyText}>Chưa có kỹ năng.</p>
                )}
              </div>
            </div>

            <div className={styles.card}>
              <h3>Lịch sử kinh nghiệm</h3>
              <div className={styles.timeline}>
                {profile?.experiences?.length ? (
                  profile.experiences.map((exp, idx) => (
                    <div key={idx} className={styles.timelineItem}>
                      <div className={styles.dot}></div>
                      <div className={styles.timelineContent}>
                        <h4>{exp.title}</h4>
                        <span className={styles.company}>{exp.company}</span>
                        <span className={styles.period}>{exp.startDate} - {exp.isCurrent ? 'Hiện tại' : exp.endDate}</span>
                        <p>{exp.description}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className={styles.emptyText}>Chưa cập nhật kinh nghiệm làm việc.</p>
                )}
              </div>
            </div>

            {profile?.portfolioUrls?.length > 0 && (
              <div className={styles.card}>
                <h3>Portfolio / Dự án nổi bật</h3>
                <ul className={styles.portfolioList}>
                  {profile.portfolioUrls.map((url, idx) => (
                    <li key={idx}>
                      <i className="bi bi-link-45deg"></i>
                      <a href={url} target="_blank" rel="noreferrer">{url}</a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className={styles.sidebar}>
            <div className={styles.card}>
              <h3>Thông tin chi tiết</h3>
              <ul className={styles.metaList}>
                <li><i className="bi bi-cash-stack"></i> Mức lương: <strong>${profile?.hourlyRate}/giờ</strong></li>
                <li><i className="bi bi-briefcase"></i> Thâm niên: <strong>{profile?.yearsOfExperience} năm</strong></li>
                <li><i className="bi bi-clock"></i> Thời gian: <strong>{profile?.availableHours}</strong></li>
                <li><i className="bi bi-geo-alt"></i> Địa chỉ: <strong>{profile?.address || 'Chưa cập nhật'}</strong></li>
                <li><i className="bi bi-translate"></i> Ngôn ngữ: <strong>{profile?.languages?.join(', ') || 'N/A'}</strong></li>
              </ul>
            </div>

            <div className={styles.card}>
              <h3>Chỉ số hiệu suất</h3>
              <div className={styles.performanceMetrics}>
                <div className={styles.metricItem}>
                  <i className="bi bi-star-fill text-warning"></i>
                  <div>
                    <strong>{profile?.rating || 0.0} / 5.0</strong>
                    <p>{profile?.reviewCount || 0} lượt đánh giá</p>
                  </div>
                </div>
                <div className={styles.metricItem}>
                  <i className="bi bi-check-circle-fill text-success"></i>
                  <div>
                    <strong>{profile?.completionRate || 100}%</strong>
                    <p>Tỷ lệ hoàn thành công việc</p>
                  </div>
                </div>
              </div>

              {profile?.cvUrl && (
                <a href={profile.cvUrl} target="_blank" rel="noreferrer" className={styles.btnCvDownload}>
                  <i className="bi bi-file-earmark-pdf"></i> Xem CV cá nhân
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {showAiModal && parsedData && (
        <div className={styles.modalBackdrop} role="presentation" onClick={closeAiModal}>
          <div className={styles.aiModal} role="dialog" aria-modal="true" aria-labelledby="ai-modal-title" onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div>
                <h2 id="ai-modal-title">Xác nhận dữ liệu bóc tách từ CV</h2>
                <p>Chọn những thông tin bạn muốn áp dụng vào hồ sơ.</p>
              </div>
              <button type="button" className={styles.modalClose} onClick={closeAiModal} aria-label="Đóng">
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            <label className={styles.selectAll}>
              <input
                type="checkbox"
                checked={Object.values(selectedFields).every(Boolean)}
                onChange={(e) => toggleAllFields(e.target.checked)}
              />
              Chọn tất cả / Bỏ chọn tất cả
            </label>

            <div className={styles.aiPreview}>
              {[
                ['title', 'Tựa đề CV / Chức danh', parsedData.title],
                ['yearsOfExperience', 'Số năm kinh nghiệm', parsedData.yearsOfExperience],
                ['bio', 'Giới thiệu bản thân', parsedData.bio],
              ].map(([field, label, value]) => (
                <label className={styles.previewSection} key={field}>
                  <span className={styles.previewHeading}>
                    <input type="checkbox" checked={selectedFields[field]} onChange={(e) => setSelectedFields((prev) => ({ ...prev, [field]: e.target.checked }))} />
                    <strong>{label}</strong>
                  </span>
                  <span className={styles.previewValue}>{value || 'Chưa có dữ liệu'}</span>
                </label>
              ))}

              {['skills', 'languages'].map((field) => (
                <label className={styles.previewSection} key={field}>
                  <span className={styles.previewHeading}>
                    <input type="checkbox" checked={selectedFields[field]} onChange={(e) => setSelectedFields((prev) => ({ ...prev, [field]: e.target.checked }))} />
                    <strong>{field === 'skills' ? 'Kỹ năng' : 'Ngôn ngữ'}</strong>
                  </span>
                  <span className={styles.previewTags}>
                    {parsedData[field]?.length ? parsedData[field].map((item) => <span className={styles.previewTag} key={item}>{item}</span>) : 'Chưa có dữ liệu'}
                  </span>
                </label>
              ))}

              <div className={styles.previewSection}>
                <label className={styles.previewHeading}>
                  <input type="checkbox" checked={selectedFields.experiences} onChange={(e) => setSelectedFields((prev) => ({ ...prev, experiences: e.target.checked }))} />
                  <strong>Kinh nghiệm làm việc</strong>
                </label>
                <div className={styles.previewExperiences}>
                  {parsedData.experiences?.length ? parsedData.experiences.map((experience, index) => (
                    <div className={styles.previewExperience} key={`${experience.company}-${experience.title}-${index}`}>
                      <strong>{experience.title || 'Chưa có chức danh'}</strong>
                      <span>{experience.company || 'Chưa có công ty'}</span>
                      <small>{experience.startDate || '?'} - {experience.isCurrent ? 'Hiện tại' : experience.endDate || '?'}</small>
                      {experience.description && <p>{experience.description}</p>}
                    </div>
                  )) : <span>Chưa có dữ liệu</span>}
                </div>
              </div>
            </div>

            <div className={styles.modalActions}>
              <button type="button" className={styles.btnSecondary} onClick={closeAiModal}>Hủy bỏ</button>
              <button type="button" className={styles.btnPrimary} onClick={applyParsedData}>Áp dụng thông tin đã chọn</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FreelancerProfileManager;