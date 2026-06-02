import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../api';
import { StatusBadge, PriorityBadge, Spinner, EmptyState } from '../../components/UI';
import Sidebar from '../../components/Sidebar';

export default function AdminTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const navigate = useNavigate();

  const load = useCallback(() => {
    setLoading(true);
    api.adminListTickets({ search, status })
      .then(setTickets)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [search, status]);

  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [load]);

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main-content">
        <div className="page-header">
          <div className="page-header-left">
            <h2>All Tickets</h2>
            <p>{tickets.length} ticket{tickets.length !== 1 ? 's' : ''} found</p>
          </div>
        </div>

        <div className="page-body">
          <div className="toolbar">
            <div className="search-box">
              <span className="search-icon">🔍</span>
              <input className="search-input"
                placeholder="Search name, email, ID, subject…"
                value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <select className="form-input" style={{ width: 155 }} value={status} onChange={e => setStatus(e.target.value)}>
              <option value="">All Status</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          {loading ? <Spinner /> : tickets.length === 0 ? (
            <EmptyState icon="🔎" title="No tickets found" desc="Try adjusting your search or filters." />
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>ID</th><th>Customer</th><th>Subject</th><th>Priority</th><th>Status</th><th>Created</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map(t => (
                    <tr key={t.ticket_id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/admin/tickets/${t.ticket_id}`)}>
                      <td><span className="tid">{t.ticket_id}</span></td>
                      <td>
                        <div style={{ fontWeight: 500 }}>{t.customer_name}</div>
                        <div style={{ fontSize: 11, color: 'var(--text2)' }}>{t.customer_email}</div>
                      </td>
                      <td style={{ maxWidth: 260, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.subject}</td>
                      <td><PriorityBadge priority={t.priority} /></td>
                      <td><StatusBadge status={t.status} /></td>
                      <td style={{ color: 'var(--text2)', fontSize: 12 }}>
                        {new Date(t.created_at).toLocaleDateString()}<br />
                        <span style={{ fontSize: 11 }}>{new Date(t.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
