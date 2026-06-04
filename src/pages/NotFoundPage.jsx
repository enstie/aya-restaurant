import { Link } from 'react-router-dom';
import './NotFoundPage.css';

export default function NotFoundPage() {
  return (
    <main className="nf-page" aria-labelledby="nf-heading">

      {/* ── Background architectural grid ── */}
      <div className="nf-grid" aria-hidden="true">
        <svg
          className="nf-grid__svg"
          viewBox="0 0 1200 800"
          preserveAspectRatio="xMidYMid slice"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Horizontal rules */}
          <line x1="0" y1="160" x2="1200" y2="160" stroke="#E0DDD8" strokeWidth="0.75"/>
          <line x1="0" y1="320" x2="1200" y2="320" stroke="#E0DDD8" strokeWidth="0.75"/>
          <line x1="0" y1="480" x2="1200" y2="480" stroke="#E0DDD8" strokeWidth="0.75"/>
          <line x1="0" y1="640" x2="1200" y2="640" stroke="#E0DDD8" strokeWidth="0.75"/>

          {/* Vertical rules */}
          <line x1="200"  y1="0" x2="200"  y2="800" stroke="#E0DDD8" strokeWidth="0.75"/>
          <line x1="400"  y1="0" x2="400"  y2="800" stroke="#E0DDD8" strokeWidth="0.75"/>
          <line x1="600"  y1="0" x2="600"  y2="800" stroke="#E0DDD8" strokeWidth="0.75"/>
          <line x1="800"  y1="0" x2="800"  y2="800" stroke="#E0DDD8" strokeWidth="0.75"/>
          <line x1="1000" y1="0" x2="1000" y2="800" stroke="#E0DDD8" strokeWidth="0.75"/>

          {/* Accent diagonal — architectural feel */}
          <line x1="0" y1="800" x2="1200" y2="0" stroke="#D8D3C8" strokeWidth="0.5"/>

          {/* Fine cross-hairs at intersections — editorial detail */}
          {[200, 400, 600, 800, 1000].map(x =>
            [160, 320, 480, 640].map(y => (
              <g key={`${x}-${y}`}>
                <line x1={x - 6} y1={y} x2={x + 6} y2={y} stroke="#C8C3B8" strokeWidth="1"/>
                <line x1={x} y1={y - 6} x2={x} y2={y + 6} stroke="#C8C3B8" strokeWidth="1"/>
              </g>
            ))
          )}
        </svg>
      </div>

      {/* ── Ghost 404 numerals ── */}
      <div className="nf-numerals" aria-hidden="true">404</div>

      {/* ── Foreground content ── */}
      <div className="nf-content">

        {/* Fine-line plate / dish SVG illustration */}
        <div className="nf-illustration" aria-hidden="true">
          <svg
            width="120"
            height="120"
            viewBox="0 0 120 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Outer plate rim */}
            <circle cx="60" cy="60" r="54" stroke="#1A1A1A" strokeWidth="1.2"/>
            {/* Inner plate well */}
            <circle cx="60" cy="60" r="42" stroke="#1A1A1A" strokeWidth="0.7"/>
            {/* Decorative band */}
            <circle cx="60" cy="60" r="48" stroke="#1A1A1A" strokeWidth="0.35" strokeDasharray="2 4"/>
            {/* Empty fork silhouette — minimalist, 3 tines */}
            <g transform="translate(45, 32)">
              {/* Handle */}
              <line x1="15" y1="38" x2="15" y2="56" stroke="#1A1A1A" strokeWidth="1.3" strokeLinecap="round"/>
              {/* Shoulder */}
              <line x1="10" y1="37" x2="20" y2="37" stroke="#1A1A1A" strokeWidth="1" strokeLinecap="round"/>
              {/* Tines */}
              <line x1="11" y1="22" x2="11" y2="37" stroke="#1A1A1A" strokeWidth="1" strokeLinecap="round"/>
              <line x1="15" y1="20" x2="15" y2="37" stroke="#1A1A1A" strokeWidth="1" strokeLinecap="round"/>
              <line x1="19" y1="22" x2="19" y2="37" stroke="#1A1A1A" strokeWidth="1" strokeLinecap="round"/>
            </g>
            {/* Empty knife silhouette */}
            <g transform="translate(59, 28)">
              {/* Blade */}
              <path d="M7 4 C7 4 13 10 13 22 L7 22 Z" stroke="#1A1A1A" strokeWidth="1" strokeLinejoin="round" fill="none"/>
              {/* Handle */}
              <line x1="10" y1="22" x2="10" y2="60" stroke="#1A1A1A" strokeWidth="1.3" strokeLinecap="round"/>
            </g>
          </svg>
        </div>

        <div className="nf-badge">Page Not Found</div>

        <h1 id="nf-heading" className="nf-title">
          This table<br/>doesn't exist.
        </h1>

        <p className="nf-body">
          The page you're looking for has moved, been removed,<br className="nf-br"/>
          or perhaps never been on our menu.
        </p>

        <div className="nf-divider" aria-hidden="true">
          <span/>
          <span className="nf-divider__mark">✦</span>
          <span/>
        </div>

        <nav className="nf-actions" aria-label="Recovery navigation">
          <Link to="/" className="btn btn-primary nf-cta">
            Return to Aya
          </Link>
          <Link to="/menu" className="btn btn-outline nf-cta">
            View the Menu
          </Link>
          <Link to="/reservations" className="btn btn-outline nf-cta">
            Make a Reservation
          </Link>
        </nav>

      </div>

      {/* ── Bottom rule with route hint ── */}
      <div className="nf-footer" aria-hidden="true">
        <span className="nf-footer__rule"/>
        <span className="nf-footer__text">AYA · London</span>
        <span className="nf-footer__rule"/>
      </div>

    </main>
  );
}
