import Header from '~/components/Header';
import Footer from '~/components/Footer';

function DefaultLayout({ children }) {
  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <Header />
      <main className="container flex-grow-1 py-4">
        {children}
      </main>
      <Footer />
    </div>
  );
}

export default DefaultLayout;