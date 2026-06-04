import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import './HomePage.css';

const STATS = [
  { value: '★★',    label: 'Michelin Stars' },
  { value: '7',      label: 'Tasting Courses' },
  { value: '98',     label: 'Seats Per Evening' },
  { value: 'Est. 22', label: 'Mayfair, London' },
];

const FEATURES = [
  {
    label: 'The Tasting Menu',
    title: 'Seven Courses of Precision',
    body: 'Our flagship seven-course journey moves through texture, temperature, and season. Each plate is a considered architectural decision — nothing is accidental.',
    link: '/menu',
    linkLabel: 'Explore the Menu',
    image: '/dish-hero.jpg',
  },
  {
    label: 'Our Spaces',
    title: 'Architecture as Hospitality',
    body: 'From the light-flooded Main Room to the private Pool Terrace and intimate Kitchen Counter, each space at AYA is designed for a distinct kind of evening.',
    link: '/spaces',
    linkLabel: 'See the Spaces',
    image: '/main-dining.jpg',
  },
  {
    label: 'Reservations',
    title: 'Reserve Your Evening',
    body: 'AYA accepts reservations Thursday through Sunday. Two seatings per evening, 98 guests maximum. Deposits required at time of booking.',
    link: '/reservations',
    linkLabel: 'Book a Table',
    image: '/aerial-table.jpg',
  },
];

const homeJsonLd = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  "name": "AYA Restaurant",
  "image": "https://aya.london/light-hero.jpg",
  "description": "Two Michelin Stars. Seven courses. A singular evening in the heart of Mayfair.",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "12 Bruton Place",
    "addressLocality": "Mayfair",
    "addressRegion": "London",
    "postalCode": "W1J 6QA",
    "addressCountry": "UK"
  },
  "servesCuisine": "Modern European",
  "priceRange": "$$$$"
};

export default function HomePage() {
  return (
    <div className="home">
      <SEO 
        title="Home"
        description="Two Michelin Stars. Seven courses. A singular evening in the heart of Mayfair, London. Discover AYA's tasting menus and structural architecture."
        url="https://aya.london/"
        image="https://aya.london/light-hero.jpg"
        jsonLd={homeJsonLd}
      />

      {/* ── HERO ── */}
      <section className="home-hero" aria-labelledby="hero-heading">
        <div className="home-hero__image-wrap">
          <img
            src="/light-hero.jpg"
            alt="AYA Restaurant exterior in Mayfair, London"
            className="home-hero__image"
            fetchpriority="high"
          />
          <div className="home-hero__image-overlay" aria-hidden="true" />
        </div>
        <div className="home-hero__content page-wrapper">
          <span className="section-label home-hero__label">Mayfair, London · Est. 2022</span>
          <h1 id="hero-heading" className="home-hero__title">
            Where precision<br />
            becomes <em>pleasure.</em>
          </h1>
          <p className="home-hero__subtitle">
            Two Michelin Stars. Seven courses. A singular
            evening in the heart of Mayfair.
          </p>
          <div className="home-hero__actions">
            <Link to="/reservations" className="btn btn-lg btn-primary">
              Reserve a Table
            </Link>
            <Link to="/menu" className="btn btn-lg btn-outline">
              View the Menu
            </Link>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section className="home-stats" aria-label="Restaurant highlights">
        <div className="page-wrapper home-stats__grid">
          {STATS.map(({ value, label }) => (
            <div className="home-stat" key={label}>
              <span className="home-stat__value">{value}</span>
              <span className="home-stat__label">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── INTRO TEXT ── */}
      <section className="home-intro page-section" aria-labelledby="intro-heading">
        <div className="page-wrapper home-intro__grid">
          <div className="home-intro__label-col">
            <span className="section-label">Our Philosophy</span>
          </div>
          <div className="home-intro__text-col">
            <h2 id="intro-heading" className="home-intro__heading">
              We don't serve food.<br />
              We construct <em>moments.</em>
            </h2>
            <p className="home-intro__body">
              Every plate at AYA is the result of a decision — a structural choice made
              by Chef Soren Malik and his team. The ingredients, the sequence, the
              temperature and silence between courses. Nothing here is incidental.
            </p>
            <p className="home-intro__body">
              AYA seats 98 guests each evening. Every reservation is a commitment.
              Every visit, unrepeatable.
            </p>
          </div>
        </div>
      </section>

      <div className="divider page-wrapper" />

      {/* ── FEATURES GRID ── */}
      <section className="home-features page-section" aria-label="Restaurant features">
        <div className="page-wrapper">
          <div className="home-features__grid">
            {FEATURES.map((feat) => (
              <article className="home-feature-card" key={feat.label}>
                <div className="home-feature-card__image-wrap">
                  <img
                    src={feat.image}
                    alt={feat.title}
                    className="home-feature-card__image"
                    loading="lazy"
                  />
                </div>
                <div className="home-feature-card__body">
                  <span className="section-label">{feat.label}</span>
                  <h3 className="home-feature-card__title">{feat.title}</h3>
                  <p className="home-feature-card__text">{feat.body}</p>
                  <Link to={feat.link} className="btn btn-outline btn-sm">
                    {feat.linkLabel}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="home-cta" aria-labelledby="cta-heading">
        <div className="page-wrapper home-cta__inner">
          <div>
            <span className="section-label home-cta__label">Join Us</span>
            <h2 id="cta-heading" className="home-cta__title">
              An evening unlike<br />any other.
            </h2>
          </div>
          <div className="home-cta__actions">
            <Link to="/reservations" className="btn btn-lg btn-amber">
              Reserve Your Table
            </Link>
            <Link to="/walk-in" className="btn btn-lg btn-outline">
              Walk-In Order
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
