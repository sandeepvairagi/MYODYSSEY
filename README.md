# My-Odyssey ✈

A production-ready **MERN stack** travel platform for discovering destinations, booking trips, and managing travel experiences. Built with a modern, premium UI inspired by Airbnb and MakeMyTrip.

![Tech Stack](https://img.shields.io/badge/React-18-blue) ![Node](https://img.shields.io/badge/Node-Express-green) ![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-green)

## Features

### User Features
- 🔐 JWT Authentication (Register/Login)
- 🌍 Explore & search destinations with filters
- ❤️ Wishlist functionality
- 📅 Trip booking with dynamic pricing
- 💳 Razorpay payment integration
- 🤖 AI itinerary generator
- 🗺️ Google Maps embed
- 🌙 Dark/Light mode
- 📱 Mobile-first responsive design

### Admin Features
- 📊 Analytics dashboard
- 🏝️ CRUD destinations
- 👥 User management
- 📋 Booking management

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | React, Vite, Tailwind CSS, Redux Toolkit, React Router, Axios, Framer Motion |
| Backend | Node.js, Express.js, Mongoose |
| Database | MongoDB |
| Auth | JWT + bcrypt |
| Storage | Cloudinary |
| Payments | Razorpay |

## Project Structure

```
my-odyssey/
├── client/                 # React frontend
│   └── src/
│       ├── components/     # Reusable UI components
│       ├── pages/          # Route pages
│       ├── layouts/        # Layout wrappers
│       ├── redux/          # State management
│       ├── services/       # API services
│       ├── hooks/          # Custom hooks
│       ├── context/        # Theme context
│       ├── routes/         # Routing config
│       └── utils/          # Helpers
├── server/                 # Express backend
│   ├── config/             # DB, Cloudinary, Razorpay
│   ├── controllers/        # Route handlers
│   ├── models/             # Mongoose schemas
│   ├── routes/             # API routes
│       ├── middleware/     # Auth, upload, errors
│       ├── services/       # Business logic
│       ├── validators/     # Request validation
│       ├── utils/          # Helpers
│       └── seed/           # Seed data
└── README.md
```

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Razorpay account (test keys)
- Cloudinary account (optional, for image uploads)
- Google Maps API key (optional)

### Installation

```bash
# Clone and install dependencies
npm run install:all

# Setup environment variables
cp server/.env.example server/.env
cp client/.env.example client/.env
# Edit .env files with your credentials

# Seed the database
npm run seed

# Run development servers
npm run dev
```

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000/api

### Demo Credentials

| Role  | Email               | Password  |
|-------|---------------------|-----------|
| Admin | admin@myodyssey.com | admin123  |
| User  | user@myodyssey.com  | user123   |

## Environment Variables

### Server (`server/.env`)
```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/my-odyssey
JWT_SECRET=your_secret
CLIENT_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
GOOGLE_MAPS_API_KEY=
OPENAI_API_KEY=
```

### Client (`client/.env`)
```env
VITE_API_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY_ID=
VITE_GOOGLE_MAPS_API_KEY=
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login |
| GET | `/api/destinations` | List destinations |
| GET | `/api/destinations/:id` | Destination details |
| POST | `/api/bookings` | Create booking |
| POST | `/api/payments/create-order` | Razorpay order |
| POST | `/api/payments/verify` | Verify payment |
| GET | `/api/wishlist` | Get wishlist |
| POST | `/api/wishlist/:id` | Toggle wishlist |
| GET | `/api/admin/stats` | Dashboard stats |

## Database Collections

- **Users** – Authentication, profiles, preferences
- **Destinations** – Travel packages with itineraries
- **Bookings** – Trip reservations
- **Reviews** – Ratings and comments
- **Wishlist** – Saved destinations
- **Payments** – Razorpay transactions
- **Notifications** – User alerts

## Scripts

```bash
npm run dev          # Run client + server
npm run seed         # Seed database
npm run build        # Build frontend
npm start            # Production server
```

## License

MIT — Built for portfolio and learning purposes.
