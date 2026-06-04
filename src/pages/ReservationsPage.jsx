import { useState } from 'react';
import './ReservationsPage.css';

const OCCASIONS = [
  { value: '', label: 'No special occasion' },
  { value: 'birthday', label: 'Birthday' },
  { value: 'anniversary', label: 'Anniversary' },
  { value: 'proposal', label: 'Proposal' },
  { value: 'business', label: 'Business Dinner' },
  { value: 'celebration', label: 'General Celebration' },
  { value: 'other', label: 'Other' },
];

const GUESTS = [1,2,3,4,5,6,7,8];

export default function ReservationsPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    date: '', seating: '18:30', guests: '2',
    occasion: '', dietary: '', notes: '',
    deposit: false,
  });

  const set = (field) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm(f => ({ ...f, [field]: val }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="res-page">
        <header className="page-header">
          <div className="page-wrapper">
            <span className="section-label">Thank You</span>
            <h1 className="page-header__title">Request Received</h1>
          </div>
        </header>
        <div className="res-confirm page-wrapper page-section">
          <div className="res-confirm__card">
            <div className="res-confirm__icon" aria-hidden="true">✓</div>
            <h2 className="res-confirm__title">We'll be in touch shortly.</h2>
            <p className="res-confirm__body">
              Your reservation request for <strong>{form.guests} {form.guests === '1' ? 'guest' : 'guests'}</strong> on{' '}
              <strong>{form.date}</strong> at <strong>{form.seating}</strong> has been received.
              Our team will confirm within 4 hours by email to <strong>{form.email}</strong>.
            </p>
            <p className="res-confirm__deposit-note">
              A deposit of £75 per person will be collected upon confirmation.
              Deposits are fully refundable with 48 hours' notice.
            </p>
            <button
              className="btn btn-outline"
              onClick={() => { setSubmitted(false); setForm(f => ({ ...f, date: '', dietary: '', notes: '' })); }}
            >
              Make Another Reservation
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="res-page">

      {/* ── PAGE HEADER ── */}
      <header className="page-header">
        <div className="page-wrapper">
          <span className="section-label">Secure Your Evening</span>
          <h1 className="page-header__title">Reservations</h1>
          <p className="page-header__subtitle">
            AYA seats 98 guests each evening, Thursday through Sunday.
            Two seatings available: 18:30 and 21:00.
          </p>
        </div>
      </header>

      {/* ── FORM + SIDEBAR ── */}
      <section className="res-section page-section">
        <div className="page-wrapper res-grid">

          {/* Form */}
          <form
            className="res-form"
            onSubmit={handleSubmit}
            noValidate
            aria-label="Reservation request form"
          >
            <fieldset className="res-fieldset">
              <legend className="res-legend">Your Details</legend>
              <div className="res-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="res-first">First Name <span aria-label="required">*</span></label>
                  <input
                    id="res-first" type="text" className="form-input"
                    placeholder="Elara" required
                    value={form.firstName} onChange={set('firstName')}
                    autoComplete="given-name"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="res-last">Last Name <span aria-label="required">*</span></label>
                  <input
                    id="res-last" type="text" className="form-input"
                    placeholder="Voss" required
                    value={form.lastName} onChange={set('lastName')}
                    autoComplete="family-name"
                  />
                </div>
              </div>
              <div className="res-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="res-email">Email Address <span aria-label="required">*</span></label>
                  <input
                    id="res-email" type="email" className="form-input"
                    placeholder="elara@example.com" required
                    value={form.email} onChange={set('email')}
                    autoComplete="email"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="res-phone">Phone Number</label>
                  <input
                    id="res-phone" type="tel" className="form-input"
                    placeholder="+44 7700 000 000"
                    value={form.phone} onChange={set('phone')}
                    autoComplete="tel"
                  />
                </div>
              </div>
            </fieldset>

            <div className="res-divider" />

            <fieldset className="res-fieldset">
              <legend className="res-legend">Booking Details</legend>
              <div className="res-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="res-date">Preferred Date <span aria-label="required">*</span></label>
                  <input
                    id="res-date" type="date" className="form-input"
                    required min={new Date().toISOString().split('T')[0]}
                    value={form.date} onChange={set('date')}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="res-seating">Seating Time <span aria-label="required">*</span></label>
                  <select id="res-seating" className="form-select" value={form.seating} onChange={set('seating')}>
                    <option value="18:30">18:30 — First Sitting</option>
                    <option value="21:00">21:00 — Second Sitting</option>
                  </select>
                </div>
              </div>
              <div className="res-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="res-guests">Number of Guests <span aria-label="required">*</span></label>
                  <select id="res-guests" className="form-select" value={form.guests} onChange={set('guests')}>
                    {GUESTS.map(n => (
                      <option key={n} value={n}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="res-occasion">Occasion</label>
                  <select id="res-occasion" className="form-select" value={form.occasion} onChange={set('occasion')}>
                    {OCCASIONS.map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </fieldset>

            <div className="res-divider" />

            <fieldset className="res-fieldset">
              <legend className="res-legend">Additional Information</legend>
              <div className="form-group">
                <label className="form-label" htmlFor="res-dietary">Dietary Requirements & Allergies</label>
                <input
                  id="res-dietary" type="text" className="form-input"
                  placeholder="e.g. vegetarian, nut allergy, lactose intolerant…"
                  value={form.dietary} onChange={set('dietary')}
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="res-notes">Special Requests</label>
                <textarea
                  id="res-notes" className="form-textarea"
                  placeholder="Celebration cake, specific seating preferences, accessibility needs…"
                  value={form.notes} onChange={set('notes')}
                  rows={4}
                />
              </div>
            </fieldset>

            <div className="res-divider" />

            {/* Deposit notice */}
            <div className="res-deposit-notice">
              <label className="res-checkbox-label">
                <input
                  type="checkbox" required
                  checked={form.deposit} onChange={set('deposit')}
                  className="res-checkbox"
                  id="res-deposit"
                />
                <span>
                  I understand that a deposit of <strong>£75 per person</strong> is
                  required to confirm this reservation, and is refundable with 48 hours' notice.
                </span>
              </label>
            </div>

            <div className="res-submit">
              <button type="submit" className="btn btn-lg btn-primary">
                Request Reservation
              </button>
              <p className="res-submit__note">
                We'll confirm availability and send a deposit link within 4 hours.
              </p>
            </div>
          </form>

          {/* Sidebar */}
          <aside className="res-sidebar" aria-label="Reservation information">
            <div className="res-info-card">
              <h3 className="res-info-card__title">Opening Hours</h3>
              <ul className="res-info-list">
                <li>
                  <span className="res-info-list__day">Thursday – Sunday</span>
                  <span className="res-info-list__time">18:30 & 21:00</span>
                </li>
                <li>
                  <span className="res-info-list__day">Monday – Wednesday</span>
                  <span className="res-info-list__time">Closed</span>
                </li>
              </ul>
            </div>

            <div className="res-info-card">
              <h3 className="res-info-card__title">Location</h3>
              <address className="res-address">
                12 Bruton Place<br />
                Mayfair, London<br />
                W1J 6LX
              </address>
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noreferrer"
                className="btn btn-outline btn-sm"
                style={{ marginTop: 'var(--space-4)', display: 'inline-flex' }}
              >
                Get Directions
              </a>
            </div>

            <div className="res-info-card">
              <h3 className="res-info-card__title">Contact Us Directly</h3>
              <p className="res-info-card__body">
                For same-day reservations or group bookings (9+), please call or email
                our reservations team directly.
              </p>
              <ul className="res-info-list res-info-list--contact">
                <li>
                  <a href="tel:+442071234567">+44 (0)20 7123 4567</a>
                </li>
                <li>
                  <a href="mailto:reservations@ayarestaurant.com">
                    reservations@ayarestaurant.com
                  </a>
                </li>
              </ul>
            </div>
          </aside>

        </div>
      </section>

    </div>
  );
}
