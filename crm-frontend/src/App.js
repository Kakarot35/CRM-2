import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { RedirectIfAuth, RequireAuth } from './components/ProtectedRoute';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

import MyTickets from './pages/customer/MyTickets';
import NewTicket from './pages/customer/NewTicket';
import CustomerTicketDetail from './pages/customer/TicketDetail';

import AdminDashboard from './pages/admin/Dashboard';
import AdminTickets from './pages/admin/AllTickets';
import AdminTicketDetail from './pages/admin/TicketDetail';
import AdminUsers from './pages/admin/Users';

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            {/* Root → always go to login (RedirectIfAuth will send logged-in users to their dashboard) */}
            <Route path="/" element={<RedirectIfAuth><Login /></RedirectIfAuth>} />
            <Route path="/login" element={<RedirectIfAuth><Login /></RedirectIfAuth>} />
            <Route path="/register" element={<RedirectIfAuth><Register /></RedirectIfAuth>} />

            <Route path="/my-tickets" element={<RequireAuth role="customer"><MyTickets /></RequireAuth>} />
            <Route path="/my-tickets/new" element={<RequireAuth role="customer"><NewTicket /></RequireAuth>} />
            <Route path="/my-tickets/:id" element={<RequireAuth role="customer"><CustomerTicketDetail /></RequireAuth>} />

            <Route path="/admin/dashboard" element={<RequireAuth role="admin"><AdminDashboard /></RequireAuth>} />
            <Route path="/admin/tickets" element={<RequireAuth role="admin"><AdminTickets /></RequireAuth>} />
            <Route path="/admin/tickets/:id" element={<RequireAuth role="admin"><AdminTicketDetail /></RequireAuth>} />
            <Route path="/admin/users" element={<RequireAuth role="admin"><AdminUsers /></RequireAuth>} />

            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}

