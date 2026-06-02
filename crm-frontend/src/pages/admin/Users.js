import { useEffect, useState } from 'react';
import { api } from '../../api';
import { Spinner, EmptyState } from '../../components/UI';
import Sidebar from '../../components/Sidebar';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    // We'll fetch all tickets to derive customer list since we don't have a /users endpoint
    // But we'll use the /api/auth/me and build from tickets — or simply show a note
    // For a complete solution, add GET /api/admin/users to backend
    api.adminListTickets({})
      .then(tickets => {
        const map = {};
        tickets.forEach(t => {
          if (!map[t.customer_email]) {
            map[t.customer_email] = {
              name: t.customer_name,
              email: t.customer_email,
              tickets: 0,
              open: 0,
              last_seen: t.created_at,
            };
          }
          map[t.customer_email].tickets++;
          if (t.status !== 'Closed') map[t.customer_email].open++;
          if (t.created_at > map[t.customer_email].last_seen) {
            map[t.customer_email].last_seen = t.created_at;
          }
        });
        setUsers(Object.values(map));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main-content">
        <div className="page-header">
          <div className="page-header-left">
            <h2>Customers</h2>
            <p>{filtered.length} customer{filtered.length !== 1 ? 's' : ''} found</p>
          </div>
        </div>

        <div className="page-body">
          <div className="toolbar">
            <div className="search-box">
              <span className="search-icon">🔍</span>
              <input className="search-input"
                placeholder="Search by name or email…"
                value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </div>

          {loading ? <Spinner /> : filtered.length === 0 ? (
            <EmptyState icon="👥" title="No customers yet"
              desc="Customers will appear here once they submit tickets." />
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Email</th>
                    <th>Total Tickets</th>
                    <th>Open Tickets</th>
                    <th>Last Activity</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(u => (
                    <tr key={u.email}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{
                            width: 30, height: 30, borderRadius: '50%',
                            background: 'var(--accent-glow)', color: 'var(--accent)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 12, fontWeight: 700, flexShrink: 0,
                          }}>
                            {u.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)}
                          </div>
                          <span style={{ fontWeight: 500 }}>{u.name}</span>
                        </div>
                      </td>
                      <td style={{ color: 'var(--text2)' }}>{u.email}</td>
                      <td>
                        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 600 }}>
                          {u.tickets}
                        </span>
                      </td>
                      <td>
                        {u.open > 0
                          ? <span className="badge badge-open">{u.open} open</span>
                          : <span className="badge badge-closed">All closed</span>
                        }
                      </td>
                      <td style={{ color: 'var(--text2)', fontSize: 12 }}>
                        {new Date(u.last_seen).toLocaleDateString()}
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
