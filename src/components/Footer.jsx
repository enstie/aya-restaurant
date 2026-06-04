import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__top page-wrapper">
        <div className="footer__brand">
          <span className="footer__logo">AYA</span>
          <p className="footer__tagline">
            Two Michelin Stars. Seasonal tasting menus<br />
            and à la carte in the heart of Mayfair.
          </p>
        </div>

        <nav className="footer__col" aria-label="Explore links">
          <h3 className="footer__col-title">Explore</h3>
          <ul className="footer__list">
            <li><Link to="/">Our Story</Link></li>
            <li><Link to="/menu">The Menu</Link></li>
            <li><Link to="/spaces">Our Spaces</Link></li>
            <li><Link to="/reservations">Reservations</Link></li>
            <li><Link to="/walk-in">Table Ordering</Link></li>
          </ul>
        </nav>

        <div className="footer__col">
          <h3 className="footer__col-title">Visit</h3>
          <ul className="footer__list footer__list--no-link">
            <li>12 Bruton Place</li>
            <li>Mayfair, London W1J 6LX</li>
            <li style={{ marginTop: '0.75rem' }}>Thursday – Sunday</li>
            <li>18:30 &amp; 21:00 seatings</li>
          </ul>
        </div>

        <div className="footer__col">
          <h3 className="footer__col-title">Contact</h3>
          <ul className="footer__list footer__list--no-link">
            <li>reservations@ayarestaurant.com</li>
            <li>+44 (0)20 7123 4567</li>
            <li style={{ marginTop: '0.75rem' }}>
              <a href="#" aria-label="AYA on Instagram">Instagram</a>
            </li>
            <li><a href="#" aria-label="AYA Newsletter">Newsletter</a></li>
          </ul>
        </div>
      </div>

      <div className="footer__bottom">
        <div className="page-wrapper footer__bottom-inner">
          <p className="footer__copy">
            &copy; {new Date().getFullYear()} AYA Restaurant Ltd. All rights reserved.
          </p>
          <ul className="footer__legal">
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms & Conditions</a></li>
            <li><a href="#">Accessibility</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
