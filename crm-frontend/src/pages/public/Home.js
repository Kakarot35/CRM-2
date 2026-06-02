import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Home() {
  const { user, loading } = useAuth();

  // If already logged in, send to the right place
  if (loading) return null;
  if (user) return <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/my-tickets'} replace />;

  return (
    <div className="landing-shell">
      {/* ── Nav ── */}
      <nav className="landing-nav">
        <div className="landing-nav-inner">
          <div className="landing-brand">
            <div className="landing-brand-icon">🎧</div>
            <span className="landing-brand-name">SupportCRM</span>
          </div>
          <div className="landing-nav-actions">
            <Link to="/login" className="btn btn-ghost btn-sm">Sign In</Link>
            <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="landing-hero">
        <div className="landing-hero-glow" />
        <div className="landing-hero-content">
          <div className="landing-eyebrow">Datastraw Technologies</div>
          <h1 className="landing-headline">
            Support that scales<br />
            <span className="landing-headline-accent">with your business</span>
          </h1>
          <p className="landing-subheadline">
            A role-based customer support platform. Admins manage tickets. Customers track issues. Everyone gets clarity.
          </p>
          <div className="landing-hero-cta">
            <Link to="/register" className="btn btn-primary landing-cta-primary">
              Create Free Account
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </Link>
            <Link to="/login" className="btn btn-secondary landing-cta-secondary">
              Sign In to Dashboard
            </Link>
          </div>

          {/* Demo accounts callout */}
          <div className="landing-demo-strip">
            <span className="landing-demo-label">Try demo accounts:</span>
            <code>admin@datastraw.in</code>
            <span className="landing-demo-sep">·</span>
            <code>demo@customer.com</code>
          </div>
        </div>
      </section>

      {/* ── Roles ── */}
      <section className="landing-roles">
        <div className="landing-section-inner">
          <div className="landing-section-label">Who it's for</div>
          <h2 className="landing-section-title">Two portals. One platform.</h2>
          <div className="landing-roles-grid">
            <div className="landing-role-card landing-role-admin">
              <div className="landing-role-icon">🛡️</div>
              <h3>Admin Portal</h3>
              <p>Full visibility across all tickets. Update status, add internal notes, and manage your support queue.</p>
              <ul className="landing-role-list">
                <li>View & search all tickets</li>
                <li>Update ticket status</li>
                <li>Add agent notes</li>
                <li>Dashboard analytics</li>
              </ul>
              <Link to="/login" className="btn btn-primary btn-sm landing-role-btn">Admin Sign In →</Link>
            </div>
            <div className="landing-role-card landing-role-customer">
              <div className="landing-role-icon">👤</div>
              <h3>Customer Portal</h3>
              <p>Submit support requests and track their progress. Get notified when your ticket status changes.</p>
              <ul className="landing-role-list">
                <li>Submit new tickets</li>
                <li>Track ticket status</li>
                <li>View support responses</li>
                <li>Full ticket history</li>
              </ul>
              <Link to="/register" className="btn btn-primary btn-sm landing-role-btn">Create Account →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="landing-features">
        <div className="landing-section-inner">
          <div className="landing-section-label">Built for teams</div>
          <h2 className="landing-section-title">Everything you need</h2>
          <div className="landing-features-grid">
            {FEATURES.map(f => (
              <div key={f.title} className="landing-feature-card">
                <div className="landing-feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer CTA ── */}
      <section className="landing-footer-cta">
        <div className="landing-section-inner landing-footer-cta-inner">
          <h2>Ready to get started?</h2>
          <p>Create your free account or sign in to your existing dashboard.</p>
          <div className="landing-hero-cta">
            <Link to="/register" className="btn btn-primary landing-cta-primary">Create Free Account</Link>
            <Link to="/login" className="btn btn-secondary landing-cta-secondary">Sign In</Link>
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <span>© 2025 Datastraw Technologies · SupportCRM v2.0</span>
      </footer>
    </div>
  );
}

const FEATURES = [
  { icon: '🔐', title: 'JWT Auth', desc: 'Secure login with role-based access. Admins and customers see only what they should.' },
  { icon: '🎫', title: 'Ticket Management', desc: 'Create, track and resolve tickets with priority levels and status updates.' },
  { icon: '🔍', title: 'Search & Filter', desc: 'Quickly find tickets by status, keyword, or customer email with instant results.' },
  { icon: '📝', title: 'Agent Notes', desc: 'Add internal or public notes to any ticket with a timestamped audit trail.' },
  { icon: '📊', title: 'Live Stats', desc: 'Admin dashboard shows real-time ticket counts across all status categories.' },
  { icon: '⚡', title: 'FastAPI Backend', desc: 'Built on FastAPI + SQLite with bcrypt passwords and HS256 JWT tokens.' },
];
