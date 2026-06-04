import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useOrderStore, STATUS_CONFIG, STATUS_ORDER } from '../hooks/useOrderStore';
import MenuAdmin from '../components/MenuAdmin';
import './KitchenPage.css';
import './AdminPage.css';

/* ── Helpers ── */
function getAgeLabel(isoTimestamp) {
  const diff = Math.floor((Date.now() - new Date(isoTimestamp).getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  const mins = Math.floor(diff / 60);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  return `${hrs}h ${mins % 60}m ago`;
}

function getAgeMinutes(isoTimestamp) {
  return Math.floor((Date.now() - new Date(isoTimestamp).getTime()) / 60000);
}

function formatTime(isoTimestamp) {
  return new Date(isoTimestamp).toLocaleTimeString('en-GB', {
    hour: '2-digit', minute: '2-digit',
  });
}

/* ── Age urgency badge ── */
function AgeBadge({ placedAt }) {
  const mins = getAgeMinutes(placedAt);
  const urgent = mins >= 20;
  const warning = mins >= 10 && mins < 20;
  return (
    <span
      className={`kds-age-badge${urgent ? ' kds-age-badge--urgent' : warning ? ' kds-age-badge--warning' : ''}`}
      aria-label={`Order placed ${getAgeLabel(placedAt)}`}
    >
      {getAgeLabel(placedAt)}
    </span>
  );
}

/* ── Order card ── */
function OrderCard({ order, onAdvance, onDelete }) {
  const cfg = STATUS_CONFIG[order.status];
  const [confirming, setConfirming] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleAdvance = (e) => {
    e.stopPropagation();
    if (!cfg.next) return;
    onAdvance(order.id, cfg.next);
  };

  return (
    <article
      className={`kds-card ${isExpanded ? 'kds-card--expanded' : ''}`}
      style={{ '--card-border': cfg.border, '--card-bg': cfg.bg }}
    >
      {/* Card header — clickable to expand/contract */}
      <div 
        className="kds-card__header" 
        onClick={() => setIsExpanded(!isExpanded)}
        style={{ cursor: 'pointer', position: 'relative' }}
        role="button"
        aria-expanded={isExpanded}
      >
        <div className="kds-card__id-row">
          {order.tableNumber ? (
            <span className="kds-card__table-badge">
              Table {order.tableNumber}
            </span>
          ) : (
            <span className="kds-card__id">{order.id}</span>
          )}
          <AgeBadge placedAt={order.placedAt} />
        </div>

        {/* Guest name + mobile */}
        <div className="kds-card__guest-row">
          <span className="kds-card__guest-name">
            {order.guestName || 'Walk-In Guest'}
          </span>
          {order.mobile && (
            <a href={`tel:${order.mobile}`} className="kds-card__guest-mobile" onClick={(e) => e.stopPropagation()}>
              {order.mobile}
            </a>
          )}
        </div>

        <div className="kds-card__meta-row">
          {order.tableNumber && (
            <span className="kds-card__id kds-card__id--small">{order.id}</span>
          )}
          <span className="kds-card__time">Placed {formatTime(order.placedAt)}</span>
          <span
            className="kds-card__status-pill"
            style={{ background: cfg.bg, color: cfg.color, borderColor: cfg.border }}
          >
            {cfg.label}
          </span>
        </div>

        {/* Chevron indicator */}
        <div style={{ position: 'absolute', top: 'var(--space-4)', right: 'var(--space-4)', color: 'var(--stone-light)', transition: 'transform 0.2s', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>
      </div>

      {/* Expandable content */}
      {isExpanded && (
        <>
          {/* Allergy / dietary warning */}
          {order.allergies && (
            <div className="kds-card__allergy">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
              <span>{order.allergies}</span>
            </div>
          )}

          {/* Items list */}
          <ul className="kds-card__items" aria-label="Order items">
            {order.items.map((item, i) => (
              <li key={`${item.id}-${i}`} className="kds-card__item">
                <span className="kds-card__item-qty">{item.qty}×</span>
                <span className="kds-card__item-name">{item.name}</span>
                <span className="kds-card__item-price">£{(item.price * item.qty).toFixed(2)}</span>
              </li>
            ))}
          </ul>

          {/* Total */}
          <div className="kds-card__total">
            <span>Total</span>
            <span className="kds-card__total-value">£{order.total.toFixed(2)}</span>
          </div>

          {/* Actions */}
          <div className="kds-card__actions">
            {cfg.next && (
              <button
                className="btn kds-card__advance-btn"
                style={{ background: cfg.color, borderColor: cfg.color, color: '#fff' }}
                onClick={handleAdvance}
                aria-label={`${cfg.nextLabel} for order ${order.id}`}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
                {cfg.nextLabel}
              </button>
            )}
            {order.status === 'served' && (
              confirming ? (
                <div className="kds-card__confirm-row">
                  <span className="kds-card__confirm-label">Remove this order?</span>
                  <button className="btn btn-sm btn-outline" onClick={() => setConfirming(false)}>Cancel</button>
                  <button
                    className="btn btn-sm"
                    style={{ background: '#DC2626', borderColor: '#DC2626', color: '#fff' }}
                    onClick={() => onDelete(order.id)}
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <button
                  className="btn btn-sm kds-card__dismiss-btn"
                  onClick={() => setConfirming(true)}
                  aria-label={`Dismiss order ${order.id}`}
                >
                  Dismiss
                </button>
              )
            )}
          </div>
        </>
      )}
    </article>
  );
}

/* ── Column ── */
function KanbanColumn({ status, orders, onAdvance, onDelete }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <section
      className="kds-column"
      aria-labelledby={`col-${status}`}
    >
      <div className="kds-column__header" style={{ '--col-accent': cfg.color }}>
        <div className="kds-column__title-row">
          <h2 id={`col-${status}`} className="kds-column__title">{cfg.label}</h2>
          <span className="kds-column__count" style={{ background: cfg.color }}>
            {orders.length}
          </span>
        </div>
      </div>

      <div className="kds-column__body">
        {orders.length === 0 ? (
          <div className="kds-column__empty">
            <span>No {cfg.label.toLowerCase()} orders</span>
          </div>
        ) : (
          orders.map(order => (
            <OrderCard
              key={order.id}
              order={order}
              onAdvance={onAdvance}
              onDelete={onDelete}
            />
          ))
        )}
      </div>
    </section>
  );
}

/* ══════════════════════════
   MAIN KITCHEN PAGE
══════════════════════════ */
export default function KitchenPage() {
  const { orders, updateStatus, deleteOrder, clearServed } = useOrderStore();
  const [filter, setFilter] = useState('active'); // 'active' | 'all'
  const [now, setNow] = useState(Date.now());
  const [confirmClearAll, setConfirmClearAll] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const view = searchParams.get('view') === 'menu' ? 'menu' : 'kds';
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Track network status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const toggleView = () => {
    setSearchParams({ view: view === 'kds' ? 'menu' : 'kds' }, { replace: true });
  };

  // Tick every 30s so age labels update
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(t);
  }, []);

  const activeOrders = filter === 'active'
    ? orders.filter(o => o.status !== 'served')
    : orders;

  const byStatus = STATUS_ORDER.reduce((acc, s) => {
    acc[s] = activeOrders.filter(o => o.status === s);
    return acc;
  }, {});

  const totalActive = orders.filter(o => o.status !== 'served').length;
  const totalServed = orders.filter(o => o.status === 'served').length;

  return (
    <div className="kds-page">

      {/* ── TOP BAR ── */}
      <header className="kds-header" role="banner">
        <div className="kds-header__left">
          <Link to="/" className="kds-logo">AYA</Link>
          <span className="kds-header__title">
            {view === 'menu' ? 'Menu Management' : 'Kitchen Display'}
          </span>
        </div>

        {view === 'kds' && (
          <div className="kds-header__stats">
            <div className="kds-stat">
              <span className="kds-stat__value">{totalActive}</span>
              <span className="kds-stat__label">Active</span>
            </div>
            <div className="kds-stat">
              <span className="kds-stat__value">{totalServed}</span>
              <span className="kds-stat__label">Served Today</span>
            </div>
            <div className="kds-stat">
              <span className="kds-stat__value">{orders.length}</span>
              <span className="kds-stat__label">Total Orders</span>
            </div>
          </div>
        )}

        <div className="kds-header__actions">
          {view === 'kds' ? (
            <>
              {/* Active / All filter */}
              <div className="kds-filter-toggle" role="group" aria-label="Order filter">
                <button
                  className={`kds-filter-btn${filter === 'active' ? ' kds-filter-btn--active' : ''}`}
                  onClick={() => setFilter('active')}
                  aria-pressed={filter === 'active'}
                >
                  Active Only
                </button>
                <button
                  className={`kds-filter-btn${filter === 'all' ? ' kds-filter-btn--active' : ''}`}
                  onClick={() => setFilter('all')}
                  aria-pressed={filter === 'all'}
                >
                  All Orders
                </button>
              </div>

              {/* Clear served */}
              {totalServed > 0 && (
                confirmClearAll ? (
                  <div className="kds-confirm-clear">
                    <span>Clear {totalServed} served?</span>
                    <button className="btn btn-sm btn-outline" onClick={() => setConfirmClearAll(false)}>Cancel</button>
                    <button
                      className="btn btn-sm"
                      style={{ background: '#DC2626', borderColor: '#DC2626', color: '#fff' }}
                      onClick={() => {
                        clearServed();
                        setConfirmClearAll(false);
                      }}
                    >
                      Confirm
                    </button>
                  </div>
                ) : (
                  <button
                    className="btn btn-sm btn-outline kds-clear-served-btn"
                    onClick={() => setConfirmClearAll(true)}
                  >
                    Clear Served ({totalServed})
                  </button>
                )
              )}
            </>
          ) : null}

          {/* View Toggle */}
          <button 
            className="btn btn-sm btn-outline" 
            onClick={toggleView}
          >
            {view === 'kds' ? 'Manage Menu' : '← Back to Orders'}
          </button>

          {/* Network Status Indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', color: isOnline ? '#10B981' : '#DC2626', background: isOnline ? '#D1FAE5' : '#FEE2E2', padding: '4px 10px', borderRadius: '999px' }}>
            <span style={{ display: 'block', width: '6px', height: '6px', borderRadius: '50%', background: isOnline ? '#10B981' : '#DC2626', boxShadow: isOnline ? '0 0 0 2px rgba(16, 185, 129, 0.2)' : '0 0 0 2px rgba(220, 38, 38, 0.2)' }}></span>
            {isOnline ? 'Online' : 'Offline'}
          </div>
        </div>
      </header>

      {/* ── MAIN CONTENT ── */}
      {view === 'kds' ? (
        <>
          {/* ── EMPTY STATE ── */}
          {orders.length === 0 && (
            <div className="kds-empty-state">
              <div className="kds-empty-state__icon" aria-hidden="true">
                <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                </svg>
              </div>
              <h2 className="kds-empty-state__title">No Orders Yet</h2>
              <p className="kds-empty-state__body">
                Orders placed via the Walk-In POS will appear here instantly.
                This display auto-syncs across all devices on the same browser.
              </p>
              <Link to="/walk-in" className="btn btn-primary">
                Open Walk-In POS
              </Link>
            </div>
          )}

          {/* ── KANBAN BOARD ── */}
          {orders.length > 0 && (
            <div className="kds-board">
              {STATUS_ORDER.map(status => (
                // Hide 'served' column in active-only mode unless there are served orders to show
                (filter === 'all' || status !== 'served') && (
                  <KanbanColumn
                    key={status}
                    status={status}
                    orders={byStatus[status]}
                    onAdvance={updateStatus}
                    onDelete={deleteOrder}
                  />
                )
              ))}
              {/* Show served column in active mode only if it has items */}
              {filter === 'active' && byStatus['served'].length > 0 && (
                <KanbanColumn
                  status="served"
                  orders={byStatus['served']}
                  onAdvance={updateStatus}
                  onDelete={deleteOrder}
                />
              )}
            </div>
          )}
        </>
      ) : (
        <div style={{ flex: 1, padding: 'var(--space-6)', overflow: 'hidden' }}>
          <MenuAdmin />
        </div>
      )}

    </div>
  );
}
