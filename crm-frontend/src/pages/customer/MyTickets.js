import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../api';
import { StatusBadge, PriorityBadge, Spinner, EmptyState } from '../../components/UI';
import Sidebar from '../../components/Sidebar';

export default function MyTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const navigate = useNavigate();

  const load = useCallback(() => {
    setLoading(true);
    api.customerListTickets({ status })
      .then(setTickets)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [status]);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main-content">
        <div className="page-header">
          <div className="page-header-left">
            <h2>My Tickets</h2>
            <p>{tickets.length} ticket{tickets.length !== 1 ? 's' : ''} found</p>
          </div>
          <button className="btn btn-primary" onClick={() => navigate('/my-tickets/new')}>
            + New Ticket
          </button>
        </div>

        <div className="page-body">
          <div className="toolbar">
            <select className="form-input" style={{ width: 150 }} value={status} onChange={e => setStatus(e.target.value)}>
              <option value="">All Status</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          {loading ? <Spinner /> : tickets.length === 0 ? (
            <EmptyState icon="🎫" title="No tickets yet"
              desc="Submit a support request and we'll get back to you."
              action={<button className="btn btn-primary" onClick={() => navigate('/my-tickets/new')}>Create First Ticket</button>}
            />
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Ticket ID</th>
                    <th>Subject</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Created</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map(t => (
                    <tr key={t.ticket_id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/my-tickets/${t.ticket_id}`)}>
                      <td><span className="tid">{t.ticket_id}</span></td>
                      <td style={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.subject}</td>
                      <td><PriorityBadge priority={t.priority} /></td>
                      <td><StatusBadge status={t.status} /></td>
                      <td style={{ color: 'var(--text2)', fontSize: 12 }}>{new Date(t.created_at).toLocaleDateString()}</td>
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
