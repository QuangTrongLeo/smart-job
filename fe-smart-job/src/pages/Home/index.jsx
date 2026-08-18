import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="home-page">
      {/* 1. Hero Section Banner */}
      <section className="bg-primary text-white rounded-3 p-4 p-md-5 mb-4 shadow-sm">
        <div className="row align-items-center">
          <div className="col-lg-7">
            <h1 className="display-5 fw-bold mb-3">
              Tìm việc Freelance mơ ước & Tuyển dụng nhân tài nhanh chóng
            </h1>
            <p className="lead mb-4">
              Kết nối hơn 10,000+ Freelancer chất lượng cao với các dự án hàng đầu tại Việt Nam.
            </p>
            <div className="d-flex gap-3">
              <Link to="/jobs" className="btn btn-light btn-lg text-primary fw-bold">
                <i className="bi bi-search me-2"></i>Tìm việc ngay
              </Link>
              <Link to="/client/post-job" className="btn btn-outline-light btn-lg">
                <i className="bi bi-plus-circle me-2"></i>Đăng dự án
              </Link>
            </div>
          </div>
          <div className="col-lg-5 d-none d-lg-block text-center">
            <i className="bi bi-rocket-takeoff text-white opacity-75" style={{ fontSize: '10rem' }}></i>
          </div>
        </div>
      </section>

      {/* 2. Stats Section (Thống kê) */}
      <section className="row text-center mb-5 g-3">
        <div className="col-md-4">
          <div className="p-3 bg-white rounded shadow-sm border">
            <h3 className="fw-bold text-primary mb-1">1,250+</h3>
            <p className="text-muted mb-0">Dự án đang tuyển</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="p-3 bg-white rounded shadow-sm border">
            <h3 className="fw-bold text-success mb-1">8,500+</h3>
            <p className="text-muted mb-0">Freelancer hoạt động</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="p-3 bg-white rounded shadow-sm border">
            <h3 className="fw-bold text-warning mb-1">98%</h3>
            <p className="text-muted mb-0">Khách hàng hài lòng</p>
          </div>
        </div>
      </section>

      {/* 3. Outstanding Categories (Danh mục nổi bật) */}
      <section className="mb-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="fw-bold mb-0">Danh mục công việc nổi bật</h4>
          <Link to="/jobs" className="text-decoration-none">Xem tất cả <i className="bi bi-arrow-right"></i></Link>
        </div>
        <div className="row g-3">
          <div className="col-md-3 col-sm-6">
            <div className="card h-100 border-0 shadow-sm text-center p-3">
              <i className="bi bi-code-slash text-primary fs-1 mb-2"></i>
              <h6 className="fw-bold">Lập trình Web & App</h6>
              <small className="text-muted">340+ việc làm</small>
            </div>
          </div>
          <div className="col-md-3 col-sm-6">
            <div className="card h-100 border-0 shadow-sm text-center p-3">
              <i className="bi bi-palette text-danger fs-1 mb-2"></i>
              <h6 className="fw-bold">Thiết kế Đồ họa</h6>
              <small className="text-muted">210+ việc làm</small>
            </div>
          </div>
          <div className="col-md-3 col-sm-6">
            <div className="card h-100 border-0 shadow-sm text-center p-3">
              <i className="bi bi-megaphone text-success fs-1 mb-2"></i>
              <h6 className="fw-bold">Marketing & SEO</h6>
              <small className="text-muted">180+ việc làm</small>
            </div>
          </div>
          <div className="col-md-3 col-sm-6">
            <div className="card h-100 border-0 shadow-sm text-center p-3">
              <i className="bi bi-pen text-warning fs-1 mb-2"></i>
              <h6 className="fw-bold">Viết lách & Dịch thuật</h6>
              <small className="text-muted">120+ việc làm</small>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Latest Jobs (Công việc mới nhất) */}
      <section className="mb-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="fw-bold mb-0">Dự án mới đăng</h4>
          <Link to="/jobs" className="btn btn-outline-primary btn-sm">Khám phá thêm</Link>
        </div>
        <div className="row g-3">
          {/* Sample Job Item 1 */}
          <div className="col-12">
            <div className="card border-0 shadow-sm p-3">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h5 className="fw-bold text-primary mb-1">
                    <Link to="/jobs/1" className="text-decoration-none text-dark">
                      Xây dựng Website E-commerce bằng React & Spring Boot
                    </Link>
                  </h5>
                  <p className="text-muted small mb-2">Đăng bởi: <strong>TechCorp Inc.</strong> • 2 giờ trước</p>
                  <div className="d-flex gap-2">
                    <span className="badge bg-light text-dark border">ReactJS</span>
                    <span className="badge bg-light text-dark border">Spring Boot</span>
                    <span className="badge bg-light text-dark border">MongoDB</span>
                  </div>
                </div>
                <div className="text-end">
                  <span className="fs-5 fw-bold text-success">15,000,000 VNĐ</span>
                  <br />
                  <small className="text-muted">Ngân sách cố định</small>
                </div>
              </div>
            </div>
          </div>

          {/* Sample Job Item 2 */}
          <div className="col-12">
            <div className="card border-0 shadow-sm p-3">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h5 className="fw-bold text-primary mb-1">
                    <Link to="/jobs/2" className="text-decoration-none text-dark">
                      Thiết kế UI/UX Mobile App Quản lý Chi tiêu
                    </Link>
                  </h5>
                  <p className="text-muted small mb-2">Đăng bởi: <strong>Fintech Startup</strong> • 5 giờ trước</p>
                  <div className="d-flex gap-2">
                    <span className="badge bg-light text-dark border">Figma</span>
                    <span className="badge bg-light text-dark border">UI/UX</span>
                    <span className="badge bg-light text-dark border">Mobile App</span>
                  </div>
                </div>
                <div className="text-end">
                  <span className="fs-5 fw-bold text-success">8,000,000 VNĐ</span>
                  <br />
                  <small className="text-muted">Ngân sách cố định</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;