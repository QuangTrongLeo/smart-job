import React, { useEffect, useState } from 'react';
import { jobService, categoryService, enumService, aiService } from '~/services';
import AiMatchWidget from '~/components/AiMatchWidget/AiMatchWidget';
import styles from './ClientJobManagement.module.scss';

const INITIAL_FORM_STATE = {
  title: '',
  description: '',
  companyName: '',
  companyAddress: '',
  experienceLevel: '',
  requiredExperienceYears: 1,
  employmentType: '',
  categoryIds: [],
  requiredSkills: '',
  minBudget: '',
  maxBudget: '',
  currency: '',
};

// Map hiển thị nhãn Tiếng Việt thân thiện cho từng giá trị Enum
const ENUM_LABELS = {
  // Experience Level
  NO_EXPERIENCE: 'Chưa có kinh nghiệm',
  INTERN_FRESHER: 'Thực tập / Fresher',
  JUNIOR: 'Junior',
  MIDDLE: 'Middle',
  SENIOR: 'Senior',
  EXPERT: 'Chuyên gia (Expert)',

  // Employment Type
  FULL_TIME: 'Toàn thời gian (Full-time)',
  PART_TIME: 'Bán thời gian (Part-time)',
  FREELANCE: 'Tự do (Freelance)',
  REMOTE: 'Làm từ xa (Remote)',
  HYBRID: 'Làm việc linh hoạt (Hybrid)',

  // Job Status
  DRAFT: 'Bản nháp',
  OPEN: 'Đang tuyển',
  CLOSED: 'Đã đóng',
  CANCELLED: 'Đã hủy',
};

const getEnumLabel = (val) => ENUM_LABELS[val] || val;

const getFreelancerId = (candidate) => (
  candidate?.freelancerId ||
  candidate?.freelancer?.id ||
  candidate?.freelancer?.user?.id ||
  candidate?.applicant?.id ||
  candidate?.applicant?.user?.id ||
  candidate?.user?.id ||
  candidate?.profile?.user?.id ||
  candidate?.profileId
);

const getCandidateName = (candidate, index) => {
  const user = candidate?.freelancer?.user || candidate?.applicant?.user || candidate?.user || candidate?.profile?.user;
  const fullName = `${user?.firstName || ''} ${user?.lastName || ''}`.trim();
  return fullName || user?.username || user?.email || candidate?.freelancer?.title || `Ứng viên ${index + 1}`;
};

const getJobCandidates = (job) => {
  const candidates = job?.applications || job?.applicants || job?.candidates || [];
  return Array.isArray(candidates) ? candidates : [];
};

function ClientJobManagement() {
  const [jobs, setJobs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [enums, setEnums] = useState({
    currencies: [],
    employmentTypes: [],
    experienceLevels: [],
    jobStatuses: [],
  });

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [parsingAi, setParsingAi] = useState(false);
  const [aiSuccessMsg, setAiSuccessMsg] = useState('');

  // Modal & Form States
  const [showModal, setShowModal] = useState(false);
  const [editingJobId, setEditingJobId] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [deleteId, setDeleteId] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [selectedMatch, setSelectedMatch] = useState(null);

  useEffect(() => {
    fetchMyJobs();
    fetchCategories();
    fetchEnums();
  }, []);

  const fetchEnums = async () => {
    try {
      const res = await enumService.getAllEnums();
      const data = res?.data?.data || res?.data || {};
      const fetchedCurrencies = data.currencies || [];
      const fetchedEmpTypes = data.employmentTypes || [];
      const fetchedExpLevels = data.experienceLevels || [];

      setEnums({
        currencies: fetchedCurrencies,
        employmentTypes: fetchedEmpTypes,
        experienceLevels: fetchedExpLevels,
        jobStatuses: data.jobStatuses || [],
      });

      // Thiết lập giá trị mặc định cho form dựa trên Enum trả về
      setFormData((prev) => ({
        ...prev,
        currency: prev.currency || fetchedCurrencies[0] || 'VND',
        employmentType: prev.employmentType || fetchedEmpTypes[0] || 'FULL_TIME',
        experienceLevel: prev.experienceLevel || fetchedExpLevels[0] || 'JUNIOR',
      }));
    } catch (error) {
      console.error('Lỗi lấy danh sách Enum:', error);
    }
  };

  const fetchMyJobs = async () => {
    setLoading(true);
    try {
      const res = await jobService.getMyJobs();
      setJobs(res?.data?.data || res?.data || []);
    } catch (error) {
      console.error('Lỗi lấy danh sách bài đăng:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await categoryService.getAllCategories();
      const list = res?.data?.data || res?.data || [];
      setCategories(list);
    } catch (error) {
      console.error('Lỗi lấy danh mục:', error);
    }
  };

  const handleOpenCreateModal = () => {
    setEditingJobId(null);
    setFormData({
      ...INITIAL_FORM_STATE,
      currency: enums.currencies[0] || 'VND',
      employmentType: enums.employmentTypes[0] || 'FULL_TIME',
      experienceLevel: enums.experienceLevels[0] || 'JUNIOR',
      categoryIds: categories.length > 0 ? [categories[0].id] : [],
    });
    setErrorMsg('');
    setShowModal(true);
  };

  const handleOpenEditModal = (job) => {
    setEditingJobId(job.id);
    setFormData({
      title: job.title || '',
      description: job.description || '',
      companyName: job.companyName || '',
      companyAddress: job.companyAddress || '',
      experienceLevel: job.experienceLevel || enums.experienceLevels[0] || 'JUNIOR',
      requiredExperienceYears: job.requiredExperienceYears ?? 0,
      employmentType: job.employmentType || enums.employmentTypes[0] || 'FULL_TIME',
      categoryIds: job.categoryIds || [],
      requiredSkills: Array.isArray(job.requiredSkills) ? job.requiredSkills.join(', ') : '',
      minBudget: job.minBudget ?? '',
      maxBudget: job.maxBudget ?? '',
      currency: job.currency || enums.currencies[0] || 'VND',
    });
    setErrorMsg('');
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === 'description') {
      setAiSuccessMsg('');
    }
  };

  const handleAiParseJob = async () => {
    if (!formData.description.trim()) {
      setErrorMsg('Vui lòng nhập mô tả công việc thô để AI phân tích!');
      setAiSuccessMsg('');
      return;
    }

    setParsingAi(true);
    setErrorMsg('');
    setAiSuccessMsg('');

    try {
      const response = await aiService.parseJob({
        title: formData.title,
        description: formData.description,
      });
      const parsedData = response?.data || {};
      const parsedSkills = Array.isArray(parsedData.requiredSkills)
        ? parsedData.requiredSkills.join(', ')
        : formData.requiredSkills;
      const validExperienceLevel = enums.experienceLevels.includes(parsedData.experienceLevel)
        ? parsedData.experienceLevel
        : formData.experienceLevel;
      const validEmploymentType = enums.employmentTypes.includes(parsedData.employmentType)
        ? parsedData.employmentType
        : formData.employmentType;

      setFormData((prev) => ({
        ...prev,
        description: parsedData.aiParsedDesc || prev.description,
        requiredSkills: parsedSkills,
        experienceLevel: validExperienceLevel,
        requiredExperienceYears: parsedData.requiredExperienceYears ?? prev.requiredExperienceYears,
        employmentType: validEmploymentType,
      }));
      setAiSuccessMsg('AI đã phân tích và tự động điền thông tin thành công.');
    } catch (error) {
      console.error('Lỗi khi AI phân tích bài đăng:', error);
      const responseData = error?.response?.data;
      setErrorMsg(responseData?.msg || responseData?.message || 'AI không thể phân tích mô tả công việc. Vui lòng thử lại.');
    } finally {
      setParsingAi(false);
    }
  };

  const handleCategoryChange = (e) => {
    const options = e.target.options;
    const selectedList = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selectedList.push(options[i].value);
      }
    }
    setFormData((prev) => ({ ...prev, categoryIds: selectedList }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');

    // Kiểm tra danh mục ở FE
    if (!formData.categoryIds || formData.categoryIds.length === 0) {
      setErrorMsg('Vui lòng chọn ít nhất 1 danh mục công việc.');
      setSubmitting(false);
      return;
    }

    // Chuẩn hóa Payload đúng kiểu dữ liệu Backend yêu cầu
    const payload = {
      title: formData.title,
      description: formData.description,
      companyName: formData.companyName || null,
      companyAddress: formData.companyAddress || null,
      experienceLevel: formData.experienceLevel || enums.experienceLevels[0] || 'JUNIOR',
      requiredExperienceYears: Number(formData.requiredExperienceYears) || 0,
      employmentType: formData.employmentType || enums.employmentTypes[0] || 'FULL_TIME',
      categoryIds: formData.categoryIds,
      requiredSkills: formData.requiredSkills
        ? formData.requiredSkills.split(',').map((s) => s.trim()).filter(Boolean)
        : [],
      minBudget: formData.minBudget !== '' && formData.minBudget !== null ? Number(formData.minBudget) : null,
      maxBudget: formData.maxBudget !== '' && formData.maxBudget !== null ? Number(formData.maxBudget) : null,
      currency: formData.currency || enums.currencies[0] || 'VND',
    };

    try {
      if (editingJobId) {
        await jobService.updateJob(editingJobId, payload);
      } else {
        await jobService.createJob(payload);
      }
      setShowModal(false);
      fetchMyJobs();
    } catch (error) {
      console.error('Lỗi chi tiết khi lưu bài đăng:', error?.response);

      // Trích xuất chi tiết thông báo lỗi từ Spring Boot
      const resData = error?.response?.data;
      let extractMsg = 'Có lỗi xảy ra, vui lòng thử lại.';

      if (typeof resData === 'string') {
        extractMsg = resData;
      } else if (resData?.message) {
        extractMsg = resData.message;
      } else if (resData?.errors && Array.isArray(resData.errors)) {
        extractMsg = resData.errors.map((err) => err.defaultMessage || err).join(', ');
      } else if (resData?.error) {
        extractMsg = resData.error;
      } else if (error?.message) {
        extractMsg = error.message;
      }

      setErrorMsg(extractMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await jobService.deleteJob(deleteId);
      setDeleteId(null);
      fetchMyJobs();
    } catch (error) {
      console.error('Lỗi khi xóa bài đăng:', error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Quản lý bài đăng tuyển dụng</h1>
          <p className={styles.subtitle}>Tạo, chỉnh sửa và theo dõi các tin tuyển dụng của bạn</p>
        </div>
        <button className={styles.btnPrimary} onClick={handleOpenCreateModal}>
          + Đăng bài tuyển dụng
        </button>
      </div>

      <div className={styles.tableCard}>
        {loading ? (
          <div className={styles.loadingState}>
            <p>Đang tải danh sách bài đăng...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className={styles.emptyState}>
            <h3>Bạn chưa có bài đăng nào</h3>
            <p>Hãy tạo bài đăng công việc đầu tiên để tiếp cận các ứng viên tiềm năng.</p>
            <button className={styles.btnPrimary} onClick={handleOpenCreateModal}>
              Tạo bài đăng ngay
            </button>
          </div>
        ) : (
          <div className={styles.tableResponsive}>
            <table className={styles.customTable}>
              <thead>
                <tr>
                  <th>Tiêu đề công việc</th>
                  <th>Công ty</th>
                  <th>Ngân sách</th>
                  <th>Hình thức</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job.id}>
                    <td>
                      <div className={styles.jobTitle}>{job.title}</div>
                      <span className={styles.subDetail}>
                        Kinh nghiệm: {getEnumLabel(job.experienceLevel)}
                      </span>
                    </td>
                    <td>
                      <div>{job.companyName || 'Chưa cập nhật'}</div>
                      <span className={styles.subDetail}>{job.companyAddress}</span>
                    </td>
                    <td>
                      <span className={styles.budgetText}>
                        {job.minBudget ? job.minBudget.toLocaleString() : '0'} -{' '}
                        {job.maxBudget ? job.maxBudget.toLocaleString() : 'Thỏa thuận'} {job.currency}
                      </span>
                    </td>
                    <td>
                      <span className={styles.badgeEmployment}>
                        {getEnumLabel(job.employmentType)}
                      </span>
                    </td>
                    <td>
                      <span className={`${styles.badgeStatus} ${styles[job.status?.toLowerCase()]}`}>
                        {getEnumLabel(job.status)}
                      </span>
                    </td>
                    <td>
                      <div className={styles.actionGroup}>
                        <button
                          className={styles.btnIconEdit}
                          title="Chỉnh sửa"
                          onClick={() => handleOpenEditModal(job)}
                        >
                          Sửa
                        </button>
                        <button
                          className={styles.btnIconDelete}
                          title="Xóa"
                          onClick={() => setDeleteId(job.id)}
                        >
                          Xóa
                        </button>
                        <button
                          className={styles.btnAiMatch}
                          title="Xem đánh giá AI"
                          onClick={() => setSelectedMatch({ job, candidates: getJobCandidates(job) })}
                        >
                          <i className="bi bi-stars" aria-hidden="true"></i> Đánh giá AI
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedMatch && (
        <div className={styles.modalOverlay} onClick={() => setSelectedMatch(null)}>
          <div className={styles.matchModal} onClick={(event) => event.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Đánh giá AI: {selectedMatch.job.title}</h3>
              <button className={styles.closeBtn} onClick={() => setSelectedMatch(null)} aria-label="Đóng">
                &times;
              </button>
            </div>

            {selectedMatch.candidates.length > 0 ? (
              <div className={styles.matchModalBody}>
                <label htmlFor="candidate-select">Chọn ứng viên</label>
                <select
                  id="candidate-select"
                  value={selectedMatch.freelancerId || ''}
                  onChange={(event) => setSelectedMatch((prev) => ({ ...prev, freelancerId: event.target.value }))}
                >
                  <option value="">Chọn ứng viên để phân tích</option>
                  {selectedMatch.candidates.map((candidate, index) => {
                    const candidateId = getFreelancerId(candidate);
                    return candidateId ? (
                      <option key={candidateId} value={candidateId}>
                        {getCandidateName(candidate, index)}
                      </option>
                    ) : null;
                  })}
                </select>
                {selectedMatch.freelancerId && (
                  <AiMatchWidget
                    jobId={selectedMatch.job.id}
                    freelancerId={selectedMatch.freelancerId}
                  />
                )}
              </div>
            ) : (
              <div className={styles.matchEmptyState}>
                <i className="bi bi-person-exclamation" aria-hidden="true"></i>
                <p>Chưa có ứng viên để thực hiện đánh giá AI cho công việc này.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal Form */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>{editingJobId ? 'Chỉnh sửa bài đăng' : 'Tạo bài đăng mới'}</h3>
              <button className={styles.closeBtn} onClick={() => setShowModal(false)}>
                &times;
              </button>
            </div>

            {errorMsg && <div className={styles.alertDanger}>{errorMsg}</div>}

            <form onSubmit={handleSubmit} className={styles.modalBody}>
              <div className={styles.formGrid}>
                <div className={styles.fullWidth}>
                  <div className={styles.aiAssistBox}>
                    <div>
                      <strong>✨ AI tự động phân tích thông tin tuyển dụng</strong>
                      <p>Nhập tiêu đề và mô tả công việc, sau đó nhấn nút AI. Hệ thống sẽ tự động chọn cấp độ, số năm kinh nghiệm, hình thức làm việc, kỹ năng cần có và chuẩn hóa lại mô tả.</p>
                    </div>
                    <button
                      type="button"
                      className={styles.aiButton}
                      onClick={handleAiParseJob}
                      disabled={parsingAi || !formData.title.trim() || !formData.description.trim()}
                    >
                      {parsingAi ? 'Đang tự động điền...' : '✨ Phân tích & tự động điền'}
                    </button>
                  </div>
                  {aiSuccessMsg && <div className={styles.aiSuccessMsg}>{aiSuccessMsg}</div>}
                </div>

                <div className={styles.fullWidth}>
                  <label>Tiêu đề công việc *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    placeholder="Ví dụ: Senior Java Developer"
                  />
                </div>

                <div className={styles.fullWidth}>
                  <label>Mô tả công việc *</label>
                  <textarea
                    name="description"
                    rows="4"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    placeholder="Nhập yêu cầu, trách nhiệm, kỹ năng và thông tin công việc..."
                  ></textarea>
                </div>

                <div>
                  <label>Tên công ty</label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    placeholder="Tên công ty"
                  />
                </div>

                <div>
                  <label>Địa chỉ công ty</label>
                  <input
                    type="text"
                    name="companyAddress"
                    value={formData.companyAddress}
                    onChange={handleChange}
                    placeholder="Hà Nội, TP.HCM..."
                  />
                </div>

                <div>
                  <label>Cấp độ kinh nghiệm *</label>
                  <select
                    name="experienceLevel"
                    value={formData.experienceLevel}
                    onChange={handleChange}
                    required
                  >
                    {enums.experienceLevels.map((level) => (
                      <option key={level} value={level}>
                        {getEnumLabel(level)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label>Số năm kinh nghiệm yêu cầu</label>
                  <input
                    type="number"
                    name="requiredExperienceYears"
                    value={formData.requiredExperienceYears}
                    onChange={handleChange}
                    min="0"
                  />
                </div>

                <div>
                  <label>Hình thức làm việc *</label>
                  <select
                    name="employmentType"
                    value={formData.employmentType}
                    onChange={handleChange}
                    required
                  >
                    {enums.employmentTypes.map((type) => (
                      <option key={type} value={type}>
                        {getEnumLabel(type)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label>Danh mục bài đăng * (Giữ Ctrl / Cmd để chọn nhiều)</label>
                  <select
                    multiple
                    name="categoryIds"
                    value={formData.categoryIds}
                    onChange={handleCategoryChange}
                    required
                    className={styles.multiSelect}
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label>Ngân sách tối thiểu</label>
                  <input
                    type="number"
                    name="minBudget"
                    value={formData.minBudget}
                    onChange={handleChange}
                    placeholder="VD: 10000000"
                  />
                </div>

                <div>
                  <label>Ngân sách tối đa</label>
                  <input
                    type="number"
                    name="maxBudget"
                    value={formData.maxBudget}
                    onChange={handleChange}
                    placeholder="VD: 25000000"
                  />
                </div>

                <div>
                  <label>Đơn vị tiền tệ</label>
                  <select name="currency" value={formData.currency} onChange={handleChange}>
                    {enums.currencies.map((curr) => (
                      <option key={curr} value={curr}>
                        {curr}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.fullWidth}>
                  <label>Kỹ năng yêu cầu (phân cách bằng dấu phẩy)</label>
                  <input
                    type="text"
                    name="requiredSkills"
                    value={formData.requiredSkills}
                    onChange={handleChange}
                    placeholder="Java, Spring Boot, MongoDB, React"
                  />
                </div>
              </div>

              <div className={styles.modalFooter}>
                <button
                  type="button"
                  className={styles.btnSecondary}
                  onClick={() => setShowModal(false)}
                >
                  Hủy
                </button>
                <button type="submit" className={styles.btnPrimary} disabled={submitting}>
                  {submitting ? 'Đang xử lý...' : editingJobId ? 'Cập nhật' : 'Tạo bài đăng'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Xóa */}
      {deleteId && (
        <div className={styles.modalOverlay}>
          <div className={styles.confirmModal}>
            <h3>Xác nhận xóa</h3>
            <p>Bạn có chắc chắn muốn xóa bài đăng này? Hành động này không thể hoàn tác.</p>
            <div className={styles.confirmGroup}>
              <button className={styles.btnSecondary} onClick={() => setDeleteId(null)}>
                Hủy
              </button>
              <button className={styles.btnDanger} onClick={handleDelete}>
                Xóa ngay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ClientJobManagement;