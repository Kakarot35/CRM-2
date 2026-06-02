# Support CRM — Datastraw Assessment

Full-stack Customer Support Ticketing CRM built with React and FastAPI featuring role-based access control, ticket management, and admin analytics.

## 🔑 Demo Accounts

| Role     | Email                | Password    |
| -------- | -------------------- | ----------- |
| Admin    | `admin@datastraw.in` | `Admin@123` |
| Customer | `demo@customer.com`  | `Demo@123`  |

---

## 🛠️ Tech Stack

### Frontend

* React.js
* React Router
* Context API
* Axios

### Backend

* FastAPI
* SQLAlchemy
* SQLite
* JWT Authentication
* Pydantic

---

## 📂 Project Structure

```text
CRM-FULL-PROJECT/
│
├── crm-backend/
│   ├── app/
│   ├── requirements.txt
│   └── .env.example
│
├── crm-frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── package-lock.json
│   └── .env.example
│
├── README.md
└── .gitignore
```

---

## 🚀 Running Locally

### Backend

```bash
cd crm-backend

python -m venv venv

# Windows
venv\Scripts\activate

# Mac/Linux
source venv/bin/activate

pip install -r requirements.txt

uvicorn app.main:app --reload
```

API runs at:

```text
http://localhost:8000
```

Swagger Docs:

```text
http://localhost:8000/docs
```

---

### Frontend

```bash
cd crm-frontend

npm install

npm start
```

Application runs at:

```text
http://localhost:3000
```

---

## ✨ Features

### Authentication

* JWT-based Login & Registration
* Role-Based Access Control
* Secure Protected Routes
* Demo Accounts Seeded Automatically

### Customer Portal

* Create Support Tickets
* View Personal Tickets
* Track Ticket Status
* Read Public Notes from Admin

### Admin Dashboard

* Dashboard Statistics
* View All Tickets
* Search and Filter Tickets
* Update Ticket Status
* Add Public/Internal Notes
* Delete Tickets
* Manage Customer Requests

---

## 🗄 Database Schema

```text
users
 ├── id
 ├── name
 ├── email
 ├── password_hash
 └── role

tickets
 ├── id
 ├── ticket_id
 ├── customer_name
 ├── customer_email
 ├── customer_id
 ├── subject
 ├── description
 ├── status
 ├── priority
 ├── created_at
 └── updated_at

notes
 ├── id
 ├── ticket_ref
 ├── note_text
 ├── author
 ├── is_internal
 └── created_at
```

---

## 📡 API Endpoints

| Method | Endpoint                    | Access        |
| ------ | --------------------------- | ------------- |
| POST   | `/api/auth/register`        | Public        |
| POST   | `/api/auth/login`           | Public        |
| GET    | `/api/auth/me`              | Authenticated |
| POST   | `/api/customer/tickets`     | Customer      |
| GET    | `/api/customer/tickets`     | Customer      |
| GET    | `/api/customer/tickets/:id` | Customer      |
| GET    | `/api/admin/tickets`        | Admin         |
| GET    | `/api/admin/tickets/stats`  | Admin         |
| GET    | `/api/admin/tickets/:id`    | Admin         |
| PUT    | `/api/admin/tickets/:id`    | Admin         |
| DELETE | `/api/admin/tickets/:id`    | Admin         |

---

## 🌐 Deployment

The application can be deployed on Render using:

* FastAPI Web Service for Backend
* React Static Site for Frontend

Environment variables:

```env
SECRET_KEY=your-secret-key
DATABASE_URL=sqlite:///support_crm.db
REACT_APP_API_URL=https://your-backend-url.onrender.com
```

---

## 👨‍💻 Author

**Karan**

Artificial Intelligence & Data Science Engineer

GitHub: https://github.com/Kakarot35
