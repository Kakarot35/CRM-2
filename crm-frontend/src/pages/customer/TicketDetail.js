import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../api';
import { StatusBadge, PriorityBadge, Spinner } from '../../components/UI';
import Sidebar from '../../components/Sidebar';

export default function CustomerTicketDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.customerGetTicket(id)
      .then(setTicket)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="app-shell"><Sidebar /><main className="main-content"><Spinner /></main></div>;

  if (error) return (
    <div className="app-shell">
      <Sidebar />
      <main className="main-content">
        <div className="page-body">
          <div className="alert alert-error">⚠ {error}</div>
          <button className="btn btn-secondary" onClick={() => navigate('/my-tickets')}>← Back</button>
        </div>
      </main>
    </div>
  );

  const publicNotes = ticket.notes?.filter(n => !n.is_internal) || [];

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main-content">
        <div className="page-header">
          <div className="page-header-left">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <h2 className="mono">{ticket.ticket_id}</h2>
              <StatusBadge status={ticket.status} />
              <PriorityBadge priority={ticket.priority} />
            </div>
            <p>{ticket.subject}</p>
          </div>
          <button className="btn btn-secondary" onClick={() => navigate('/my-tickets')}>← Back</button>
        </div>

        <div className="page-body">
          <div style={{ maxWidth: 720 }}>
            <div className="card" style={{ marginBottom: 16 }}>
              <div className="card-header"><span className="card-title">Ticket Information</span></div>
              <div className="card-body">
                <div className="form-row">
                  <div className="detail-field">
                    <div className="detail-label">Submitted By</div>
                    <div className="detail-value">{ticket.customer_name}</div>
                  </div>
                  <div className="detail-field">
                    <div className="detail-label">Email</div>
                    <div className="detail-value">{ticket.customer_email}</div>
                  </div>
                  <div className="detail-field">
                    <div className="detail-label">Created</div>
                    <div className="detail-value">{new Date(ticket.created_at).toLocaleString()}</div>
                  </div>
                  <div className="detail-field">
                    <div className="detail-label">Last Updated</div>
                    <div className="detail-value">{new Date(ticket.updated_at).toLocaleString()}</div>
                  </div>
                </div>
                <div className="detail-field">
                  <div className="detail-label">Description</div>
                  <div className="detail-desc">{ticket.description}</div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <span className="card-title">Agent Responses ({publicNotes.length})</span>
              </div>
              <div className="card-body">
                {publicNotes.length === 0 ? (
                  <div style={{ color: 'var(--text2)', fontSize: 13, textAlign: 'center', padding: '20px 0' }}>
                    No responses yet. Our team will get back to you soon.
                  </div>
                ) : (
                  <div className="notes-list">
                    {publicNotes.map(n => (
                      <div key={n.id} className="note-card public">
                        <div className="note-meta">
                          <span className="note-author">👤 {n.author}</span>
                          <span className="note-time">{new Date(n.created_at).toLocaleString()}</span>
                        </div>
                        <div className="note-text">{n.note_text}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
