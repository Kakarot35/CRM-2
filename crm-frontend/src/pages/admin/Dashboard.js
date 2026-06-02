import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../api';
import { StatusBadge, PriorityBadge, Spinner } from '../../components/UI';
import Sidebar from '../../components/Sidebar';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([api.adminGetStats(), api.adminListTickets({ limit: 6 })])
      .then(([s, t]) => { setStats(s); setRecent(t); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main-content">
        <div className="page-header">
          <div className="page-header-left">
            <h2>{greeting}, {user?.name?.split(' ')[0]} 👋</h2>
            <p>Here's what's happening with your support queue</p>
          </div>
          <button className="btn btn-primary" onClick={() => navigate('/admin/tickets')}>
            View All Tickets →
          </button>
        </div>

        <div className="page-body">
          {loading ? <Spinner /> : (
            <>
              <div className="stats-row">
                <div className="stat-card blue">
                  <div className="stat-label">Total Tickets</div>
                  <div className="stat-value blue">{stats?.total ?? 0}</div>
                  <div className="stat-sub">All time</div>
                </div>
                <div className="stat-card amber">
                  <div className="stat-label">Open</div>
                  <div className="stat-value amber">{stats?.open ?? 0}</div>
                  <div className="stat-sub">Needs attention</div>
                </div>
                <div className="stat-card blue">
                  <div className="stat-label">In Progress</div>
                  <div className="stat-value blue">{stats?.in_progress ?? 0}</div>
                  <div className="stat-sub">Being handled</div>
                </div>
                <div className="stat-card green">
                  <div className="stat-label">Closed</div>
                  <div className="stat-value green">{stats?.closed ?? 0}</div>
                  <div className="stat-sub">Resolved</div>
                </div>
              </div>

              <div className="table-wrap">
                <div className="card-header" style={{ padding: '14px 18px' }}>
                  <span className="card-title">Recent Tickets</span>
                  <button className="btn btn-ghost btn-sm" onClick={() => navigate('/admin/tickets')}>See all →</button>
                </div>
                {recent.length === 0 ? (
                  <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text2)' }}>No tickets yet.</div>
                ) : (
                  <table>
                    <thead>
                      <tr>
                        <th>ID</th><th>Customer</th><th>Subject</th><th>Priority</th><th>Status</th><th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recent.map(t => (
                        <tr key={t.ticket_id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/admin/tickets/${t.ticket_id}`)}>
                          <td><span className="tid">{t.ticket_id}</span></td>
                          <td>
                            <div style={{ fontWeight: 500 }}>{t.customer_name}</div>
                            <div style={{ fontSize: 11, color: 'var(--text2)' }}>{t.customer_email}</div>
                          </td>
                          <td style={{ maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.subject}</td>
                          <td><PriorityBadge priority={t.priority} /></td>
                          <td><StatusBadge status={t.status} /></td>
                          <td style={{ color: 'var(--text2)', fontSize: 12 }}>{new Date(t.created_at).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
