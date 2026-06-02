import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api';
import { StatusBadge } from '../../components/UI';

const emptyCreate = {
  customer_name: '',
  customer_email: '',
  subject: '',
  description: '',
  priority: 'Medium',
};

export default function CustomerPortal() {
  const [tab, setTab] = useState('create');
  const [createForm, setCreateForm] = useState(emptyCreate);
  const [lookupForm, setLookupForm] = useState({ ticket_id: '', customer_email: '' });
  const [createdTicketId, setCreatedTicketId] = useState('');
  const [lookupResult, setLookupResult] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const updateCreate = (key, value) => setCreateForm((form) => ({ ...form, [key]: value }));
  const updateLookup = (key, value) => setLookupForm((form) => ({ ...form, [key]: value }));

  const submitTicket = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const response = await api.publicCreateTicket(createForm);
      setCreatedTicketId(response.ticket_id);
      setCreateForm(emptyCreate);
      setMessage({ type: 'success', text: `Ticket created successfully: ${response.ticket_id}` });
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  const lookupTicket = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const result = await api.publicLookupTicket(lookupForm);
      setLookupResult(result);
      setMessage({ type: 'success', text: 'Ticket found.' });
    } catch (error) {
      setLookupResult(null);
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="site-shell">
      <section className="hero hero-small hero-customer">
        <div className="hero-overlay" />
        <Link to="/" className="hero-home">Support CRM</Link>
        <div className="hero-content">
          <h1>Support Center</h1>
          <p>Submit and track your support tickets</p>
        </div>
      </section>

      <main className="container portal-wrap narrow">
        <div className="tabs">
          <button className={tab === 'create' ? 'active' : ''} onClick={() => setTab('create')}>Create Ticket</button>
          <button className={tab === 'lookup' ? 'active' : ''} onClick={() => setTab('lookup')}>Look Up Ticket</button>
        </div>

        {message && <div className={`alert alert-${message.type}`}>{message.text}</div>}

        {tab === 'create' && (
          createdTicketId ? (
            <section className="soft-card success-card">
              <h2>Ticket Created Successfully</h2>
              <div className="ticket-id-box">
                <span>Your Ticket ID</span>
                <strong>{createdTicketId}</strong>
              </div>
              <p>Save this ID to look up your ticket status later. We will respond to your email as soon as possible.</p>
              <button
                className="btn btn-secondary btn-full"
                onClick={() => {
                  setLookupForm((form) => ({ ...form, ticket_id: createdTicketId }));
                  setCreatedTicketId('');
                  setTab('lookup');
                }}
              >
                Look Up This Ticket
              </button>
            </section>
          ) : (
            <section className="soft-card">
              <h2>Submit a New Ticket</h2>
              <p className="section-subtitle">Tell us about your issue and we will get back to you shortly.</p>
              <form className="form-stack" onSubmit={submitTicket}>
                <label>Your Name<input required value={createForm.customer_name} onChange={(e) => updateCreate('customer_name', e.target.value)} placeholder="John Doe" /></label>
                <label>Email Address<input required type="email" value={createForm.customer_email} onChange={(e) => updateCreate('customer_email', e.target.value)} placeholder="you@example.com" /></label>
                <label>Subject<input required value={createForm.subject} onChange={(e) => updateCreate('subject', e.target.value)} placeholder="Brief description of your issue" /></label>
                <label>Description<textarea required value={createForm.description} onChange={(e) => updateCreate('description', e.target.value)} placeholder="Please provide as much detail as possible..." /></label>
                <button className="btn btn-primary btn-full" disabled={loading}>{loading ? 'Submitting...' : 'Submit Ticket'}</button>
              </form>
            </section>
          )
        )}

        {tab === 'lookup' && (
          <>
            <section className="soft-card">
              <h2>Look Up Your Ticket</h2>
              <p className="section-subtitle">Enter your ticket ID and email to view the status.</p>
              <form className="form-stack" onSubmit={lookupTicket}>
                <label>Ticket ID<input required value={lookupForm.ticket_id} onChange={(e) => updateLookup('ticket_id', e.target.value)} placeholder="e.g. TKT-123456" /></label>
                <label>Email Address<input required type="email" value={lookupForm.customer_email} onChange={(e) => updateLookup('customer_email', e.target.value)} placeholder="you@example.com" /></label>
                <button className="btn btn-primary btn-full" disabled={loading}>{loading ? 'Searching...' : 'Search'}</button>
              </form>
            </section>

            {lookupResult && <TicketDetailCard ticket={lookupResult} />}
          </>
        )}
      </main>
    </div>
  );
}

function TicketDetailCard({ ticket }) {
  const publicNotes = ticket.notes?.filter((note) => !note.is_internal) || [];

  return (
    <section className="soft-card ticket-detail-card">
      <div className="detail-heading">
        <div>
          <h2>{ticket.subject}</h2>
          <p className="mono">ID: {ticket.ticket_id}</p>
        </div>
        <StatusBadge status={ticket.status} />
      </div>
      <div className="info-grid">
        <Info label="Created" value={new Date(ticket.created_at).toLocaleString()} />
        <Info label="Last Updated" value={new Date(ticket.updated_at).toLocaleString()} />
      </div>
      <div className="divider-line" />
      <h3>Description</h3>
      <p className="preserve-lines">{ticket.description}</p>
      {publicNotes.length > 0 && (
        <>
          <div className="divider-line" />
          <h3>Support Notes</h3>
          <div className="notes-list">
            {publicNotes.map((note) => (
              <article className="note-card public" key={note.id}>
                <div className="note-time">{new Date(note.created_at).toLocaleString()}</div>
                <p>{note.note_text}</p>
              </article>
            ))}
          </div>
        </>
      )}
    </section>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <span className="info-label">{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
