import { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import './NavBar.css';

const NAV_LINKS = [
  { to: '/',             label: 'Home' },
  { to: '/menu',         label: 'Menu' },
  { to: '/spaces',       label: 'Spaces' },
  { to: '/reservations', label: 'Reservations' },
];

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => { setMobileOpen(false); }, [location]);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <header className={`navbar${scrolled ? ' navbar--scrolled' : ''}`} role="banner">
      <div className="navbar__inner page-wrapper">
        <Link to="/" className="navbar__logo" aria-label="AYA Restaurant — Home">
          AYA
        </Link>

        <nav className="navbar__nav" aria-label="Primary navigation">
          <ul className="navbar__links">
            {NAV_LINKS.map(({ to, label }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={to === '/'}
                  className={({ isActive }) =>
                    `navbar__link${isActive ? ' navbar__link--active' : ''}`
                  }
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="navbar__actions">
          <Link to="/walk-in" className="btn btn-sm btn-outline">
            Table Order
          </Link>
          <Link to="/reservations" className="btn btn-sm btn-primary">
            Reserve
          </Link>
        </div>

        <button
          className="navbar__hamburger"
          onClick={() => setMobileOpen(o => !o)}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        >
          <span className={`hamburger-icon${mobileOpen ? ' open' : ''}`}>
            <span /><span /><span />
          </span>
        </button>
      </div>

      <div
        id="mobile-menu"
        className={`navbar__mobile${mobileOpen ? ' navbar__mobile--open' : ''}`}
        aria-hidden={!mobileOpen}
      >
        <nav aria-label="Mobile navigation">
          <ul className="navbar__mobile-links">
            {NAV_LINKS.map(({ to, label }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={to === '/'}
                  className={({ isActive }) =>
                    `navbar__mobile-link${isActive ? ' navbar__mobile-link--active' : ''}`
                  }
                >
                  {label}
                </NavLink>
              </li>
            ))}
            <li>
              <Link to="/walk-in" className="navbar__mobile-link">Table Order</Link>
            </li>
          </ul>
        </nav>
        <div className="navbar__mobile-actions">
          <Link to="/reservations" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
            Reserve a Table
          </Link>
        </div>
      </div>
    </header>
  );
}
