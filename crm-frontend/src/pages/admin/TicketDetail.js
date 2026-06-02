import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../api';
import { StatusBadge, PriorityBadge, Spinner } from '../../components/UI';
import { useToast } from '../../context/ToastContext';
import Sidebar from '../../components/Sidebar';

export default function AdminTicketDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [note, setNote] = useState('');
  const [author, setAuthor] = useState('Agent');
  const [isInternal, setIsInternal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const load = () => {
    setLoading(true);
    api.adminGetTicket(id)
      .then(t => { setTicket(t); setStatus(t.status); })
      .catch(err => { toast(err.message, 'error'); navigate('/admin/tickets'); })
      .finally(() => setLoading(false));
  };

  useEffect(load, [id]); // eslint-disable-line

  const handleUpdate = async () => {
    if (!note.trim() && status === ticket.status) {
      toast('No changes to save', 'error'); return;
    }
    setSaving(true);
    try {
      await api.adminUpdateTicket(id, {
        status,
        notes: note.trim() || null,
        author,
        is_internal: isInternal,
      });
      setNote('');
      toast('Ticket updated!', 'success');
      load();
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete ${id}? This cannot be undone.`)) return;
    setDeleting(true);
    try {
      await api.adminDeleteTicket(id);
      toast(`Ticket ${id} deleted`, 'success');
      navigate('/admin/tickets');
    } catch (err) {
      toast(err.message, 'error');
      setDeleting(false);
    }
  };

  if (loading) return <div className="app-shell"><Sidebar /><main className="main-content"><Spinner /></main></div>;
  if (!ticket) return null;

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
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-secondary" onClick={() => navigate('/admin/tickets')}>← Back</button>
            <button className="btn btn-danger btn-sm" onClick={handleDelete} disabled={deleting}>
              {deleting ? '…' : '🗑 Delete'}
            </button>
          </div>
        </div>

        <div className="page-body">
          <div className="detail-grid">
            {/* Left column */}
            <div>
              {/* Ticket info */}
              <div className="card" style={{ marginBottom: 16 }}>
                <div className="card-header"><span className="card-title">Customer Information</span></div>
                <div className="card-body">
                  <div className="form-row">
                    <div className="detail-field">
                      <div className="detail-label">Name</div>
                      <div className="detail-value" style={{ fontWeight: 500 }}>{ticket.customer_name}</div>
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

              {/* Notes */}
              <div className="card">
                <div className="card-header">
                  <span className="card-title">Notes & Activity ({ticket.notes?.length || 0})</span>
                </div>
                <div className="card-body">
                  {ticket.notes?.length === 0 ? (
                    <div style={{ color: 'var(--text2)', fontSize: 13, textAlign: 'center', padding: '16px 0' }}>
                      No notes yet. Add one using the panel on the right.
                    </div>
                  ) : (
                    <div className="notes-list">
                      {ticket.notes.map(n => (
                        <div key={n.id} className={`note-card ${n.is_internal ? 'internal' : 'public'}`}>
                          <div className="note-meta">
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              <span className="note-author">👤 {n.author}</span>
                              {n.is_internal ? <span className="note-internal-tag">Internal</span> : <span style={{ fontSize: 10, background: 'var(--accent-glow)', color: 'var(--accent)', padding: '1px 6px', borderRadius: 99, fontWeight: 600 }}>Public</span>}
                            </div>
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

            {/* Right column — update panel */}
            <div>
              <div className="card">
                <div className="card-header"><span className="card-title">✏️ Update Ticket</span></div>
                <div className="card-body">
                  <div className="form-group">
                    <label className="form-label">Status</label>
                    <select className="form-input" value={status} onChange={e => setStatus(e.target.value)}>
                      <option value="Open">Open</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Agent Name</label>
                    <input className="form-input" placeholder="Your name"
                      value={author} onChange={e => setAuthor(e.target.value)} />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Add Note</label>
                    <textarea className="form-input" rows={4}
                      placeholder="Write a note or update…"
                      value={note} onChange={e => setNote(e.target.value)} />
                  </div>

                  {/* Internal toggle */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                    <div
                      onClick={() => setIsInternal(v => !v)}
                      style={{
                        width: 36, height: 20, borderRadius: 99,
                        background: isInternal ? 'var(--purple)' : 'var(--border2)',
                        cursor: 'pointer', position: 'relative', transition: 'background 0.2s',
                        flexShrink: 0,
                      }}
                    >
                      <div style={{
                        position: 'absolute', top: 2,
                        left: isInternal ? 18 : 2,
                        width: 16, height: 16,
                        borderRadius: '50%', background: '#fff',
                        transition: 'left 0.2s',
                      }} />
                    </div>
                    <span style={{ fontSize: 12.5, color: isInternal ? 'var(--purple)' : 'var(--text2)' }}>
                      {isInternal ? '🔒 Internal note (hidden from customer)' : '🌐 Public note (visible to customer)'}
                    </span>
                  </div>

                  <button className="btn btn-primary" style={{ width: '100%' }}
                    onClick={handleUpdate} disabled={saving}>
                    {saving
                      ? <><div className="spinner" style={{ width: 14, height: 14 }} /> Saving…</>
                      : '✓ Save Changes'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
