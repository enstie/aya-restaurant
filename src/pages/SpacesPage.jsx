import { SPACES } from '../data/spacesData';
import { Link } from 'react-router-dom';
import './SpacesPage.css';

export default function SpacesPage() {
  return (
    <div className="spaces-page">

      {/* ── PAGE HEADER ── */}
      <header className="page-header">
        <div className="page-wrapper">
          <span className="section-label">Architecture & Atmosphere</span>
          <h1 className="page-header__title">Our Spaces</h1>
          <p className="page-header__subtitle">
            Every space at AYA is a considered act of hospitality — designed for
            a distinct kind of evening, from intimate celebrations to private events.
          </p>
        </div>
      </header>

      {/* ── MASONRY GALLERY ── */}
      <section className="spaces-gallery page-section" aria-label="Spaces gallery">
        <div className="page-wrapper">
          <div className="spaces-grid">
            {SPACES.map((space) => (
              <article
                key={space.id}
                className={`space-item space-item--${space.span}`}
              >
                <div className="space-item__image-wrap">
                  <img
                    src={space.image}
                    alt={space.alt}
                    className="space-item__image"
                    loading="lazy"
                  />
                </div>
                <div className="space-item__caption">
                  <h2 className="space-item__title">{space.title}</h2>
                  <span className="space-item__subtitle">{space.subtitle}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRIVATE EVENTS STRIP ── */}
      <section className="spaces-events" aria-labelledby="events-heading">
        <div className="page-wrapper spaces-events__inner">
          <div>
            <span className="section-label">Private Events</span>
            <h2 id="events-heading" className="spaces-events__title">
              Host your event at AYA.
            </h2>
            <p className="spaces-events__body">
              Our Private Dining Room accommodates 8–20 guests exclusively. Full
              menu customisation, dedicated sommelier, and private entrance available.
              Contact our events team to begin planning.
            </p>
          </div>
          <div className="spaces-events__actions">
            <a
              href="mailto:events@ayarestaurant.com"
              className="btn btn-lg btn-primary"
            >
              Enquire About Events
            </a>
            <Link to="/reservations" className="btn btn-lg btn-outline">
              Book a Table
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
