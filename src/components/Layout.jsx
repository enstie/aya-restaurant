import { Outlet, ScrollRestoration } from 'react-router-dom';
import NavBar from './NavBar';
import Footer from './Footer';

export default function Layout() {
  return (
    <>
      <ScrollRestoration />
      <NavBar />
      <main id="main-content" style={{ paddingTop: 'var(--nav-height)' }}>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
