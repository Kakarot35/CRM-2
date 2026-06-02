# Support CRM — Datastraw Assessment

Full-stack Customer Support Ticketing CRM with role-based access control.

## 🔑 Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@datastraw.in` | `Admin@123` |
| Customer | `demo@customer.com` | `Demo@123` |

---

## 🚀 Running Locally

### Backend

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate
# Mac/Linux
source venv/bin/activate

pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload
```

API runs at: `http://localhost:8000`
Swagger docs: `http://localhost:8000/docs`

### Frontend (new terminal)

```bash
cd frontend
npm install
npm start
```

App runs at: `http://localhost:3000`

---

## 🌐 Deploy on Render.com

### Step 1 — Deploy Backend

1. Push repo to GitHub
2. Go to [render.com](https://render.com) → **New → Web Service**
3. Connect your GitHub repo
4. Settings:
   - **Root Directory**: `backend`
   - **Runtime**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Add environment variables:
   - `SECRET_KEY` = any long random string
   - `DATABASE_URL` = `sqlite:///support_crm.db`
6. Click **Deploy** — copy the live URL e.g. `https://crm-api.onrender.com`

### Step 2 — Deploy Frontend

1. Go to Render → **New → Static Site**
2. Connect same GitHub repo
3. Settings:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `build`
4. Add environment variable:
   - `REACT_APP_API_URL` = your backend URL from Step 1
5. Click **Deploy**

---

## ✨ Features

**Auth**
- JWT-based login / register
- Role-based access: Admin and Customer
- Demo accounts auto-created on startup

**Customer Portal**
- Submit new support tickets with priority
- View only their own tickets
- Read agent responses (public notes)

**Admin Panel**
- Dashboard with live stats (total, open, in-progress, closed)
- View and search all tickets
- Filter by status
- Update ticket status
- Add internal (hidden) or public notes
- Delete tickets
- Customer list derived from ticket data

---

## 🗄 Database Schema

```
users         — id, name, email, password_hash, role
tickets       — id, ticket_id, customer_name, customer_email, customer_id,
                subject, description, status, priority, created_at, updated_at
notes         — id, ticket_ref, note_text, author, is_internal, created_at
```

## 📡 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | None | Register customer |
| POST | `/api/auth/login` | None | Login, get JWT |
| GET | `/api/auth/me` | Any | Own profile |
| POST | `/api/customer/tickets` | Customer | Create ticket |
| GET | `/api/customer/tickets` | Customer | Own tickets |
| GET | `/api/customer/tickets/:id` | Customer | Ticket detail |
| GET | `/api/admin/tickets` | Admin | All tickets |
| GET | `/api/admin/tickets/stats` | Admin | Dashboard stats |
| GET | `/api/admin/tickets/:id` | Admin | Ticket detail |
| PUT | `/api/admin/tickets/:id` | Admin | Update + note |
| DELETE | `/api/admin/tickets/:id` | Admin | Delete ticket |
