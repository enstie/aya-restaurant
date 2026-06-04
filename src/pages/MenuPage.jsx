import { useState } from 'react';
import SEO from '../components/SEO';
import { MENU_CATEGORIES } from '../data/menuData';
import { useMenuStore } from '../hooks/useMenuStore';
import './MenuPage.css';

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState('starters');
  const { menuItems, loading } = useMenuStore();

  const filtered = menuItems
    .filter(i => i.category === activeCategory)
    .filter(i => i.is_available !== false); // Only show available items

  const menuJsonLd = {
    "@context": "https://schema.org",
    "@type": "Menu",
    "name": "AYA Restaurant Menu",
    "description": "Seasonal à la carte and tasting menus.",
    "hasMenuItem": menuItems.map(item => ({
      "@type": "MenuItem",
      "name": item.name,
      "description": item.description,
      "offers": {
        "@type": "Offer",
        "price": item.price,
        "priceCurrency": "GBP"
      }
    }))
  };

  return (
    <div className="menu-page">
      <SEO 
        title="Menu"
        description="Explore the seasonal à la carte menu at AYA Restaurant. Dishes designed with structural precision."
        url="https://aya.london/menu"
        image="https://aya.london/dish-hero.jpg"
        jsonLd={menuJsonLd}
      />

      {/* ── PAGE HEADER ── */}
      <header className="page-header">
        <div className="page-wrapper">
          <span className="section-label">Seasonal · Market Driven</span>
          <h1 className="page-header__title">The Menu</h1>
          <p className="page-header__subtitle">
            All dishes are available à la carte. A seven-course tasting menu is
            offered exclusively for the full table and must be pre-arranged.
          </p>
        </div>
      </header>

      {/* ── CATEGORY TABS ── */}
      <div className="menu-tabs-wrap" role="navigation" aria-label="Menu categories">
        <div className="page-wrapper">
          <ul className="menu-tabs" role="list">
            {MENU_CATEGORIES.map(({ id, label }) => (
              <li key={id}>
                <button
                  className={`menu-tab${activeCategory === id ? ' menu-tab--active' : ''}`}
                  onClick={() => setActiveCategory(id)}
                  aria-pressed={activeCategory === id}
                  aria-controls="menu-items-grid"
                  id={`tab-${id}`}
                >
                  {label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── ITEMS GRID ── */}
      <section
        className="menu-items-section page-section"
        id="menu-items-grid"
        aria-labelledby={`tab-${activeCategory}`}
      >
        <div className="page-wrapper">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--stone)' }}>
              Loading seasonal selections...
            </div>
          ) : (
            <div className="menu-grid">
              {filtered.length > 0 ? (
                filtered.map((item) => (
                  <article className="menu-card" key={item.id}>
                    <div className="menu-card__image-wrap">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="menu-card__image"
                        loading="lazy"
                      />
                    </div>
                    <div className="menu-card__body">
                      <div className="menu-card__top">
                        <h2 className="menu-card__name">{item.name}</h2>
                        <span className="menu-card__price">£{item.price}</span>
                      </div>
                      <p className="menu-card__desc">{item.description}</p>
                    </div>
                  </article>
                ))
              ) : (
                <div style={{ padding: '2rem 0', color: 'var(--stone)' }}>
                  No items currently available in this category.
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ── ALLERGEN NOTICE ── */}
      <div className="menu-allergen page-wrapper">
        <div className="menu-allergen__inner">
          <p>
            <strong>Allergen Information:</strong> Please inform your server of any dietary
            requirements or allergies. A full allergen menu is available on request.
            All prices include VAT. A 12.5% discretionary service charge will be added to your bill.
          </p>
        </div>
      </div>

    </div>
  );
}
