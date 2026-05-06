# Meridian — SaaS Admin Dashboard

A complete, production-ready SaaS admin dashboard with a Node.js/Express/MongoDB backend and a React/Vite frontend. Editorial dark UI inspired by financial dashboards and design publications.

## Features

### Backend (Node.js + Express + MongoDB)
- **JWT authentication** with bcrypt password hashing
- **Role-based access control** — admin, manager, user
- **6 Mongoose models** — User, Subscription, Transaction, Activity, Notification, Settings
- **Full CRUD APIs** for users, subscriptions, transactions
- **Bulk actions** — suspend/activate/delete users in batch
- **Analytics endpoints** — overview stats, MRR, revenue trends, user growth, plan distribution
- **Activity audit log** — every admin action recorded with IP, user agent, timestamp
- **Notifications system** — per-user notifications with mark-as-read
- **App-wide settings** — branding, plans, feature toggles
- **Rate limiting**, **Helmet** security headers, **CORS**, **compression**
- **Database seeder** — generates 80+ realistic users, subscriptions, and 12 months of transactions

### Frontend (React + Vite + Tailwind + Recharts)
- **Editorial dark theme** — Fraunces serif display + Inter + JetBrains Mono
- **Login + Register** pages with split editorial hero
- **Dashboard overview** — 4 stat cards, revenue area chart, plan pie chart, user growth bars, recent activity feed
- **Users management** — paginated table, search, filter (role/status/plan), create, edit, delete, bulk actions
- **Subscriptions** — list, filter, cancel, delete
- **Transactions/Ledger** — list, filter, refund
- **Activity log** — full audit trail with action badges
- **Settings** — branding, system toggles, plan editor
- **Profile** — personal info + password change
- **Notifications dropdown** with unread badges and mark-as-read
- **Mobile-responsive** with drawer navigation
- **Toast notifications** via react-hot-toast
- **Protected routes** with role-based gating

## Prerequisites
- **Node.js** 18 or newer
- **MongoDB** running locally on `mongodb://localhost:27017`, or a connection string for MongoDB Atlas

## Quick start

### 1. Backend setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env and set MONGO_URI + JWT_SECRET if needed
npm run seed     # Populates demo data
npm run dev      # Starts API on http://localhost:5000
```

### 2. Frontend setup (in a second terminal)
```bash
cd frontend
npm install
npm run dev      # Starts UI on http://localhost:5173
```

### 3. Open and log in
Navigate to **http://localhost:5173** and use any of the seeded accounts:

| Role     | Email                  | Password     |
|----------|------------------------|--------------|
| Admin    | admin@example.com      | password123  |
| Manager  | manager@example.com    | password123  |
| User     | user@example.com       | password123  |

## Project structure
```
saas-admin/
├── backend/
│   ├── src/
│   │   ├── config/         # DB connection
│   │   ├── models/         # Mongoose schemas (User, Subscription, etc.)
│   │   ├── controllers/    # Request handlers
│   │   ├── routes/         # Express routers
│   │   ├── middleware/     # Auth, error handling
│   │   ├── utils/          # JWT, activity logger
│   │   ├── seed/           # Database seeder
│   │   └── server.js       # Entry point
│   ├── .env.example
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/     # Reusable UI (Card, Button, Modal, etc.)
    │   ├── context/        # AuthContext
    │   ├── layouts/        # Sidebar, Header, MobileNav, AppLayout
    │   ├── pages/          # Route-level components
    │   ├── utils/          # API client, formatters
    │   ├── App.jsx         # Router
    │   ├── main.jsx        # Entry
    │   └── index.css       # Tailwind + theme
    ├── index.html
    ├── tailwind.config.js
    ├── vite.config.js
    └── package.json
```

## API endpoints

### Auth
- `POST /api/auth/register` — register new user
- `POST /api/auth/login` — login, returns JWT
- `GET /api/auth/me` — current user profile
- `PUT /api/auth/me` — update own profile
- `PUT /api/auth/password` — change password

### Users (admin/manager)
- `GET /api/users` — list with `?page=1&limit=10&search=&role=&status=&plan=&sort=`
- `GET /api/users/:id`
- `POST /api/users` (admin)
- `PUT /api/users/:id` (admin)
- `DELETE /api/users/:id` (admin)
- `POST /api/users/bulk` — `{ ids: [], action: 'suspend' | 'activate' | 'delete' }` (admin)

### Subscriptions
- `GET /api/subscriptions`
- `POST /api/subscriptions` (admin)
- `PUT /api/subscriptions/:id` (admin)
- `POST /api/subscriptions/:id/cancel` (admin)
- `DELETE /api/subscriptions/:id` (admin)

### Transactions
- `GET /api/transactions`
- `POST /api/transactions` (admin)
- `GET /api/transactions/:id`
- `POST /api/transactions/:id/refund` (admin)

### Analytics (admin/manager)
- `GET /api/analytics/overview` — KPI stats
- `GET /api/analytics/revenue?months=12`
- `GET /api/analytics/user-growth?months=12`
- `GET /api/analytics/plan-distribution`
- `GET /api/analytics/activity?limit=10`

### Notifications (private)
- `GET /api/notifications`
- `PUT /api/notifications/:id/read`
- `PUT /api/notifications/read-all`
- `DELETE /api/notifications/:id`

### Settings (admin)
- `GET /api/settings`
- `PUT /api/settings`
- `GET /api/settings/activity` — paginated audit log

## Production notes
- Set `NODE_ENV=production` and a strong `JWT_SECRET` in production.
- Build the frontend with `npm run build` and serve the `dist/` folder behind a reverse proxy.
- Configure CORS `CLIENT_URL` to match your deployed frontend origin.
- MongoDB indexes are defined on commonly-queried fields (email, user+createdAt, etc.) — review and tune for your scale.
- Replace the in-app notifications with a real-time mechanism (SSE/WebSocket) if you need push delivery.

## License
MIT — use freely.
