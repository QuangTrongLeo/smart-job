import React, { useState, useEffect } from 'react';
import { userService, freelancerService } from '../../services';
import styles from './FreelancerProfileManager.module.scss';

const DEFAULT_AVATAR = 'https://ui-avatars.com/api/?background=2563eb&color=fff&name=User';

const initialForm = {
  title: '', bio: '', yearsOfExperience: 0, availabilityStatus: 'AVAILABLE',
  address: '', hourlyRate: 0, availableHours: '40h/tuần', cvUrl: '',
  languages: [], skills: [], portfolioUrls: [], experiences: [],
};

const initialExp = { title: '', company: '', startDate: '', endDate: '', isCurrent: false, description: '' };

function FreelancerProfileManager() {
  const [userData, setUserData] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);

  const [formData, setFormData] = useState(initialForm);
  const [expForm, setExpForm] = useState(initialExp);
  const [tempInputs, setTempInputs] = useState({ skill: '', lang: '', portfolio: '' });

  useEffect(() => {
    fetchInitialData();
  }, []);

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
      alert(`${hasProfile ? 'Cập nhật' : 'Tạo'} hồ sơ thành công!`);
      setHasProfile(true);
      setIsEditing(false);
      fetchInitialData();
    } catch (error) {
      alert('Có lỗi xảy ra khi lưu hồ sơ.');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Bạn có chắc muốn xóa hồ sơ Freelancer này?')) {
      try {
        await freelancerService.deleteMyProfile();
        alert('Xóa hồ sơ thành công.');
        setProfile(null);
        setHasProfile(false);
        setIsEditing(false);
      } catch (error) {
        console.error('Lỗi khi xóa:', error);
      }
    }
  };

  if (loading) return <div className={styles.loadingContainer}><p>Đang tải thông tin...</p></div>;

  const fullName = `${userData?.firstName || ''} ${userData?.lastName || ''}`.trim() || userData?.username || 'Freelancer';

  return (
    <div className={styles.profileContainer}>
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
        </div>
      ) : isEditing ? (
        /* Edit Form */
        <form onSubmit={handleSubmit} className={styles.formLayout}>
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
    </div>
  );
}

export default FreelancerProfileManager;