# Carbon.ezz

A full-stack e-commerce platform for custom steering wheels and automotive parts. Supports bilingual content (English / Bosnian), a visual wheel configurator, and a full admin panel.

---

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | React 18, Vite, React Router v7, Tailwind CSS, Lucide Icons |
| Backend | Node.js, Express |
| Database | PostgreSQL |
| Auth | JWT (7-day tokens), Google OAuth 2.0 (Passport.js) |
| Email | Nodemailer (Gmail SMTP) |

---

## Features

- **Shop** — Browse products, image galleries, and category filtering
- **Product Details** — Full product page with gallery carousel
- **Shopping Cart** — Add/remove items
- **Checkout** — Order placement with server-side price validation 
- **Wheel Configurator** — Interactive visual configurator for custom steering wheel options (material, ring, etc.)
- **User Auth** — Register/login with email+password or Google OAuth; JWT-based sessions
- **User Dashboard** — Order history and personal message thread
- **Contact Form** — Users can submit inquiries; admins can reply directly from the panel (reply sent via email)
- **Admin Panel** — Full CRUD for products, order status management (Pending / Approved / Declined), and message inbox with reply
- **Gallery** — Standalone gallery page

---

## Project Structure

```
carbon.ezz/
├── client/               # React frontend (Vite)
│   └── src/
│       ├── components/   # Navbar, Footer, ProductCard, Configurator components
│       ├── context/      # Auth, Language, Shop, Configurator contexts
│       ├── data/         # Categories, configurator constants, translations
│       └── pages/        # Home, Shop, Cart, ProductDetails, Admin, Dashboard, ...
└── server/               # Express backend
    ├── server.js         # All API routes
    ├── db.js             # PostgreSQL connection pool
    └── config/           # Passport (Google OAuth) config
```

---

## Database Schema

| Table | Key Columns |
|-------|-------------|
| `users` | id, name, email, password (bcrypt), role (`customer` / `admin`) |
| `products` | id, name, name_bs, price, category, image, description |
| `product_images` | id, product_id, image_url |
| `orders` | id, user_email, total, shipping fields, status, created_at |
| `order_items` | id, order_id, product_name, price, quantity, image |
| `messages` | id, name, email, phone, message, reply, created_at |

A full schema dump is available at `server/dump.sql`.

---

## API Reference

### Products
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/products` | — | List all products |
| GET | `/api/products/:id` | — | Get single product |
| POST | `/api/products` | Admin | Create product |
| PUT | `/api/products/:id` | Admin | Update product |
| DELETE | `/api/products/:id` | Admin | Delete product |

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Email/password login → JWT |
| POST | `/api/auth/register` | Create account → JWT |
| POST | `/api/auth/change-password` | Change password |
| GET | `/api/auth/google` | Initiate Google OAuth |
| GET | `/api/auth/google/callback` | Google OAuth callback |

### Orders
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/orders` | — | Place an order |
| GET | `/api/orders/user/:email` | User | Get orders for a user |
| GET | `/api/admin/orders` | Admin | Get all orders |
| PATCH | `/api/orders/:id/status` | Admin | Update order status |

### Contact / Messages
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/contact` | — | Submit contact message |
| GET | `/api/admin/messages` | Admin | Get all messages |
| GET | `/api/messages/user/:email` | User | Get messages by user |
| PATCH | `/api/messages/:id/reply` | Admin | Reply to message (sends email) |

---

## Local Setup

### Prerequisites

- Node.js 18+
- PostgreSQL 14+

### 1. Clone & install

```bash
git clone <repo-url>
cd carbon.ezz

# Install client deps
cd client && npm install

# Install server deps
cd ../server && npm install
```

### 2. Configure environment

Create `server/.env`:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=carbonezz
DB_USER=your_db_user
DB_PASSWORD=your_db_password

# Auth
JWT_SECRET=your_jwt_secret_here
SESSION_SECRET=your_session_secret_here

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Email (Gmail SMTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM="Carbon.ezz <your_gmail@gmail.com>"
```

### 3. Set up the database

```bash
psql -U your_db_user -d carbonezz -f server/dump.sql
```

### 4. Run

```bash
# Terminal 1 — backend (port 5001)
cd server && npm run dev

# Terminal 2 — frontend (port 5173)
cd client && npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

---

## User Roles

| Role | Access |
|------|--------|
| Guest | Browse products, contact form, place orders |
| `customer` | + Dashboard (orders, messages), change password |
| `admin` | + Admin panel (products, orders, messages + reply) |

Password requirements: minimum 8 characters, must include uppercase, lowercase, number, and one of `!@#$%^&*`.

---

## Input Validation

- Server-side price resolution on every order (client-submitted prices are ignored)
- Name validation: 2–50 characters, letters only (including Bosnian characters)
- Password strength enforced at registration
- Order status restricted to `Pending`, `Approved`, `Declined`
