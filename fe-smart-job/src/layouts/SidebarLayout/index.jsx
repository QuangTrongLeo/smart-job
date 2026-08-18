import Header from '~/components/Header';
import Sidebar from '~/components/Sidebar';
import Footer from '~/components/Footer';

function SidebarLayout({ children }) {
  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <Header />
      <div className="container-fluid flex-grow-1">
        <div className="row h-100">
          <aside className="col-md-3 col-lg-2 p-0 bg-white border-end shadow-sm">
            <Sidebar />
          </aside>
          <main className="col-md-9 col-lg-10 p-4">
            {children}
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default SidebarLayout;