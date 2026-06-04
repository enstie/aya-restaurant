import { useReducer, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { MENU_CATEGORIES } from '../data/menuData';
import { useMenuStore } from '../hooks/useMenuStore';
import { useOrderStore } from '../hooks/useOrderStore';
import './WalkInPage.css';

/* ══════════════════════════
   CART REDUCER
══════════════════════════ */
const SERVICE_CHARGE_RATE = 0.125;

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.find(i => i.id === action.item.id);
      if (existing) {
        return state.map(i =>
          i.id === action.item.id ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...state, { ...action.item, qty: 1 }];
    }
    case 'REMOVE_ITEM':
      return state.filter(i => i.id !== action.id);
    case 'UPDATE_QTY': {
      if (action.qty <= 0) return state.filter(i => i.id !== action.id);
      return state.map(i => i.id === action.id ? { ...i, qty: action.qty } : i);
    }
    case 'CLEAR_CART':
      return [];
    default:
      return state;
  }
}

/* ══════════════════════════
   GUEST SETUP SCREEN — split screen
   Left: cinematic image + branding
   Right: spacious form
══════════════════════════ */
function GuestSetupScreen({ onConfirm }) {
  const [form, setForm] = useState({
    tableNumber: '',
    guestName: '',
    mobile: '',
    allergies: '',
  });
  const [errors, setErrors] = useState({});

  const set = (field) => (e) =>
    setForm(f => ({ ...f, [field]: e.target.value }));

  const validate = () => {
    const errs = {};
    if (!form.tableNumber.trim()) errs.tableNumber = true;
    if (!form.guestName.trim())   errs.guestName   = true;
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onConfirm(form);
  };

  return (
    <div className="gs-page">

      {/* ── LEFT PANEL — image + brand ── */}
      <div className="gs-panel gs-panel--image" aria-hidden="true">
        <img
          src="/main-dining.jpg"
          alt=""
          className="gs-panel__image"
        />
        <div className="gs-panel__overlay" />
        <div className="gs-panel__content">
          <span className="gs-panel__logo">AYA</span>
          <div className="gs-panel__tagline">
            <p>Two Michelin Stars.</p>
            <p>One unforgettable evening.</p>
          </div>
          <div className="gs-panel__address">
            12 Bruton Place · Mayfair · London
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL — form ── */}
      <div className="gs-panel gs-panel--form">
        <div className="gs-form-scroll">

          {/* Mobile-only logo */}
          <span className="gs-mobile-logo">AYA</span>

          <header className="gs-form-header">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h1 id="guest-setup-title" className="gs-form-title">
                Your table is ready.
              </h1>
              <Link to="/" className="btn btn-sm btn-outline" style={{ flexShrink: 0 }} aria-label="Return to website">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
                </svg>
                Return
              </Link>
            </div>
            <p className="gs-form-subtitle">
              Let us know where you're sitting and we'll take care of the rest.
            </p>
          </header>

          <form onSubmit={handleSubmit} noValidate className="gs-form">

            {/* ── TABLE NUMBER — hero field ── */}
            <div className={`gs-table-field${errors.tableNumber ? ' gs-table-field--error' : ''}`}>
              <label htmlFor="gs-table" className="gs-table-field__label">
                Table Number
              </label>
              <input
                id="gs-table"
                type="text"
                inputMode="numeric"
                className="gs-table-field__input"
                placeholder="—"
                value={form.tableNumber}
                onChange={set('tableNumber')}
                autoFocus
                aria-required="true"
                aria-invalid={!!errors.tableNumber}
                aria-describedby={errors.tableNumber ? 'gs-table-err' : undefined}
              />
              {errors.tableNumber && (
                <span id="gs-table-err" className="gs-field-error" role="alert">
                  Enter your table number to continue
                </span>
              )}
            </div>

            {/* ── SECONDARY FIELDS ── */}
            <div className="gs-fields">

              <div className={`form-group${errors.guestName ? ' form-group--error' : ''}`}>
                <label className="form-label" htmlFor="gs-name">
                  Your Name
                </label>
                <input
                  id="gs-name"
                  type="text"
                  className="form-input"
                  placeholder="e.g. Elara Voss"
                  value={form.guestName}
                  onChange={set('guestName')}
                  autoComplete="given-name"
                  aria-required="true"
                  aria-invalid={!!errors.guestName}
                />
                {errors.guestName && (
                  <span className="form-error" role="alert">Please enter your name</span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="gs-mobile">
                  Mobile Number
                  <span className="gs-optional-tag">optional</span>
                </label>
                <input
                  id="gs-mobile"
                  type="tel"
                  inputMode="tel"
                  className="form-input"
                  placeholder="+44 7700 000 000"
                  value={form.mobile}
                  onChange={set('mobile')}
                  autoComplete="tel"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="gs-allergies">
                  Dietary Needs &amp; Allergies
                  <span className="gs-optional-tag">optional</span>
                </label>
                <textarea
                  id="gs-allergies"
                  className="form-textarea"
                  placeholder="Nut allergy, vegetarian, no dairy…"
                  value={form.allergies}
                  onChange={set('allergies')}
                  rows={2}
                />
              </div>

            </div>

            <button type="submit" className="btn btn-primary gs-submit-btn">
              Begin Ordering
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
              </svg>
            </button>

          </form>

          <p className="gs-allergy-notice">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            Severe allergy? Please speak to a member of staff before ordering.
          </p>

        </div>
      </div>
    </div>
  );
}


/* ══════════════════════════
   GUEST INFO BAR
   Shown in the page header once guest details are set.
══════════════════════════ */
function GuestInfoBar({ guest, onEdit }) {
  return (
    <div className="guest-info-bar">
      <div className="guest-info-bar__details">
        <div className="guest-info-bar__chip guest-info-bar__chip--table">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            <line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/>
            <line x1="9" y1="9" x2="9" y2="21"/><line x1="15" y1="9" x2="15" y2="21"/>
          </svg>
          Table {guest.tableNumber}
        </div>
        <div className="guest-info-bar__chip">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
          </svg>
          {guest.guestName}
        </div>
        {guest.mobile && (
          <div className="guest-info-bar__chip">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 014.69 9.5a19.79 19.79 0 01-3-8.55A2 2 0 013.62 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
            </svg>
            {guest.mobile}
          </div>
        )}
        {guest.allergies && (
          <div className="guest-info-bar__chip guest-info-bar__chip--allergy">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            {guest.allergies.length > 28 ? guest.allergies.slice(0, 28) + '…' : guest.allergies}
          </div>
        )}
      </div>
      <button
        className="guest-info-bar__edit-btn"
        onClick={onEdit}
        aria-label="Edit guest details"
      >
        Edit Details
      </button>
    </div>
  );
}

/* ══════════════════════════
   ORDER REVIEW MODAL
══════════════════════════ */
function OrderModal({ guest, cart, subtotal, serviceCharge, total, onClose, onConfirm }) {
  const orderNum = useRef(
    `AYA-${Math.floor(1000 + Math.random() * 9000)}`
  ).current;

  return (
    <div className="pos-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="pos-modal">
        <div className="pos-modal__header">
          <h2 id="modal-title" className="pos-modal__title">Review Your Order</h2>
          <button className="pos-modal__close" onClick={onClose} aria-label="Close order review">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Guest summary inside modal */}
        <div className="pos-modal__guest">
          <div className="pos-modal__guest-row">
            <span className="pos-modal__guest-label">Table</span>
            <span className="pos-modal__guest-value">{guest.tableNumber}</span>
          </div>
          <div className="pos-modal__guest-row">
            <span className="pos-modal__guest-label">Name</span>
            <span className="pos-modal__guest-value">{guest.guestName}</span>
          </div>
          {guest.mobile && (
            <div className="pos-modal__guest-row">
              <span className="pos-modal__guest-label">Mobile</span>
              <span className="pos-modal__guest-value">{guest.mobile}</span>
            </div>
          )}
          {guest.allergies && (
            <div className="pos-modal__guest-row pos-modal__guest-row--allergy">
              <span className="pos-modal__guest-label">⚠ Allergies</span>
              <span className="pos-modal__guest-value">{guest.allergies}</span>
            </div>
          )}
        </div>

        <div className="pos-modal__items">
          {cart.map(item => (
            <div className="pos-modal__item" key={item.id}>
              <span className="pos-modal__item-qty">{item.qty}×</span>
              <span className="pos-modal__item-name">{item.name}</span>
              <span className="pos-modal__item-price">£{(item.price * item.qty).toFixed(2)}</span>
            </div>
          ))}
        </div>

        <div className="pos-modal__totals">
          <div className="pos-modal__total-row">
            <span>Subtotal</span>
            <span>£{subtotal.toFixed(2)}</span>
          </div>
          <div className="pos-modal__total-row">
            <span>Service Charge (12.5%)</span>
            <span>£{serviceCharge.toFixed(2)}</span>
          </div>
          <div className="pos-modal__total-row pos-modal__total-row--grand">
            <span>Total</span>
            <span>£{total.toFixed(2)}</span>
          </div>
        </div>

        <div className="pos-modal__actions">
          <button className="btn btn-outline" onClick={onClose}>
            Edit Order
          </button>
          <button className="btn btn-amber btn-lg" onClick={() => onConfirm(orderNum)}>
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════
   SUCCESS STATE
══════════════════════════ */
function OrderSuccess({ orderNum, total, guest, onNewOrder }) {
  return (
    <div className="pos-success">
      <div className="pos-success__icon" aria-hidden="true">✓</div>
      <h1 className="pos-success__title">Order Placed</h1>
      <p className="pos-success__order-num">{orderNum}</p>
      <p className="pos-success__body">
        Thank you, <strong>{guest.guestName}</strong>. Your order for Table{' '}
        <strong>{guest.tableNumber}</strong> has been sent to the kitchen.
        A member of our team will be with you shortly.
      </p>
      {guest.allergies && (
        <div className="pos-success__allergy-note">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
          We've noted: <em>{guest.allergies}</em>
        </div>
      )}
      <p className="pos-success__total">
        Total: <strong>£{total.toFixed(2)}</strong> incl. 12.5% service charge
      </p>
      <div className="pos-success__actions">
        <button className="btn btn-lg btn-primary" onClick={onNewOrder}>
          Add Another Order
        </button>
        <Link to="/" className="btn btn-lg btn-outline">
          Return to Site
        </Link>
      </div>
    </div>
  );
}

/* ══════════════════════════
   MAIN PAGE
══════════════════════════ */
export default function WalkInPage() {
  const [cart, dispatch] = useReducer(cartReducer, []);
  const [activeCategory, setActiveCategory] = useState('starters');
  const [showModal, setShowModal] = useState(false);
  const [orderResult, setOrderResult] = useState(null);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  // Guest details — null means the setup screen is shown
  const [guest, setGuest] = useState(null);
  const { placeOrder } = useOrderStore();
  const { menuItems, loading } = useMenuStore();

  const filtered = menuItems
    .filter(i => i.category === activeCategory)
    .filter(i => i.is_available !== false);

  const subtotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const serviceCharge = subtotal * SERVICE_CHARGE_RATE;
  const total = subtotal + serviceCharge;
  const itemCount = cart.reduce((sum, i) => sum + i.qty, 0);

  const handleConfirmOrder = (orderNum) => {
    placeOrder({
      id: orderNum,
      items: cart.map(({ id, name, price, qty }) => ({ id, name, price, qty })),
      subtotal,
      serviceCharge,
      total,
      // Guest details attached to every order
      tableNumber: guest.tableNumber,
      guestName:   guest.guestName,
      mobile:      guest.mobile,
      allergies:   guest.allergies,
    });
    setShowModal(false);
    setOrderResult({ orderNum, total });
    dispatch({ type: 'CLEAR_CART' });
    setCartDrawerOpen(false);
  };

  // ── GUEST SETUP SCREEN ──
  if (!guest) {
    return <GuestSetupScreen onConfirm={setGuest} />;
  }

  // ── ORDER SUCCESS ──
  if (orderResult) {
    return (
      <div className="pos-page">
        <div className="pos-page__header">
          <Link to="/" className="pos-page__logo">AYA</Link>
          <span className="pos-page__subtitle">Table Ordering</span>
        </div>
        <OrderSuccess
          orderNum={orderResult.orderNum}
          total={orderResult.total}
          guest={guest}
          onNewOrder={() => setOrderResult(null)}
        />
      </div>
    );
  }

  // ── MAIN POS INTERFACE ──
  return (
    <div className="pos-page">
      {/* ── TOP BAR ── */}
      <div className="pos-page__header">
        <Link to="/" className="pos-page__logo">AYA</Link>
        <span className="pos-page__subtitle">Table Ordering</span>
        {/* Mobile cart toggle */}
        <button
          className="pos-cart-toggle"
          onClick={() => setCartDrawerOpen(o => !o)}
          aria-label={`View cart — ${itemCount} items`}
          aria-expanded={cartDrawerOpen}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 01-8 0"/>
          </svg>
          {itemCount > 0 && (
            <span className="badge pos-cart-toggle__badge">{itemCount}</span>
          )}
        </button>
      </div>

      {/* ── GUEST INFO BAR ── */}
      <GuestInfoBar guest={guest} onEdit={() => setGuest(null)} />

      <div className="pos-layout">
        {/* ══ LEFT: ITEM BROWSER ══ */}
        <div className="pos-browser">
          {/* Category tabs */}
          <nav className="pos-tabs" aria-label="Menu categories">
            {MENU_CATEGORIES.map(({ id, label }) => (
              <button
                key={id}
                className={`pos-tab${activeCategory === id ? ' pos-tab--active' : ''}`}
                onClick={() => setActiveCategory(id)}
                aria-pressed={activeCategory === id}
              >
                {label}
              </button>
            ))}
          </nav>

          {/* Item grid */}
          <div className="pos-items-grid" role="list">
            {filtered.map(item => {
              const inCart = cart.find(c => c.id === item.id);
              return (
                <article
                  key={item.id}
                  className={`pos-item${inCart ? ' pos-item--in-cart' : ''}`}
                  role="listitem"
                >
                  <div className="pos-item__image-wrap">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="pos-item__image"
                      loading="lazy"
                    />
                    {inCart && (
                      <div className="pos-item__cart-badge" aria-label={`${inCart.qty} in cart`}>
                        {inCart.qty}
                      </div>
                    )}
                  </div>
                  <div className="pos-item__body">
                    <div className="pos-item__info">
                      <h3 className="pos-item__name">{item.name}</h3>
                      <span className="pos-item__price">£{item.price}</span>
                    </div>
                    <p className="pos-item__desc">{item.description}</p>
                    <button
                      className={`btn pos-item__add-btn${inCart ? ' btn-amber' : ' btn-outline'}`}
                      onClick={() => dispatch({ type: 'ADD_ITEM', item })}
                      aria-label={`Add ${item.name} to order — £${item.price}`}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                      </svg>
                      {inCart ? `Add Another` : 'Add to Order'}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        {/* ══ RIGHT: CART SIDEBAR ══ */}
        <aside
          className={`pos-cart${cartDrawerOpen ? ' pos-cart--open' : ''}`}
          aria-label="Your order"
        >
          {/* Mobile drawer header */}
          <div className="pos-cart__mobile-header">
            <h2 className="pos-cart__title">Your Order</h2>
            <button
              className="pos-cart__close"
              onClick={() => setCartDrawerOpen(false)}
              aria-label="Close cart"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          <h2 className="pos-cart__title pos-cart__title--desktop">Your Order</h2>

          {cart.length === 0 ? (
            <div className="pos-cart__empty">
              <div className="pos-cart__empty-icon" aria-hidden="true">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/>
                  <path d="M16 10a4 4 0 01-8 0"/>
                </svg>
              </div>
              <p>Your order is empty.</p>
              <p>Select items from the menu to begin.</p>
            </div>
          ) : (
            <>
              <div className="pos-cart__items">
                {cart.map(item => (
                  <div className="pos-cart-item" key={item.id}>
                    <div className="pos-cart-item__info">
                      <span className="pos-cart-item__name">{item.name}</span>
                      <span className="pos-cart-item__unit-price">£{item.price} each</span>
                    </div>
                    <div className="pos-cart-item__controls">
                      <button
                        className="pos-qty-btn"
                        onClick={() => dispatch({ type: 'UPDATE_QTY', id: item.id, qty: item.qty - 1 })}
                        aria-label={`Decrease quantity of ${item.name}`}
                      >−</button>
                      <span className="pos-qty-value" aria-label={`Quantity: ${item.qty}`}>{item.qty}</span>
                      <button
                        className="pos-qty-btn"
                        onClick={() => dispatch({ type: 'UPDATE_QTY', id: item.id, qty: item.qty + 1 })}
                        aria-label={`Increase quantity of ${item.name}`}
                      >+</button>
                    </div>
                    <div className="pos-cart-item__right">
                      <span className="pos-cart-item__line-price">£{(item.price * item.qty).toFixed(2)}</span>
                      <button
                        className="pos-cart-item__remove"
                        onClick={() => dispatch({ type: 'REMOVE_ITEM', id: item.id })}
                        aria-label={`Remove ${item.name} from order`}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pos-cart__summary">
                <div className="pos-cart__summary-row">
                  <span>Subtotal</span>
                  <span>£{subtotal.toFixed(2)}</span>
                </div>
                <div className="pos-cart__summary-row">
                  <span>Service (12.5%)</span>
                  <span>£{serviceCharge.toFixed(2)}</span>
                </div>
                <div className="pos-cart__summary-row pos-cart__summary-row--total">
                  <span>Total</span>
                  <span>£{total.toFixed(2)}</span>
                </div>
              </div>

              <div className="pos-cart__actions">
                <button
                  className="btn btn-amber btn-lg pos-cart__checkout-btn"
                  onClick={() => { setShowModal(true); setCartDrawerOpen(false); }}
                >
                  Review &amp; Place Order
                </button>
                <button
                  className="btn btn-outline btn-sm pos-cart__clear-btn"
                  onClick={() => dispatch({ type: 'CLEAR_CART' })}
                >
                  Clear Order
                </button>
              </div>
            </>
          )}
        </aside>

        {/* Mobile cart drawer backdrop */}
        {cartDrawerOpen && (
          <div
            className="pos-cart-backdrop"
            onClick={() => setCartDrawerOpen(false)}
            aria-hidden="true"
          />
        )}
      </div>

      {/* ── ORDER REVIEW MODAL ── */}
      {showModal && (
        <OrderModal
          guest={guest}
          cart={cart}
          subtotal={subtotal}
          serviceCharge={serviceCharge}
          total={total}
          onClose={() => setShowModal(false)}
          onConfirm={handleConfirmOrder}
        />
      )}
    </div>
  );
}
