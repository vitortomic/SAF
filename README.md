# SAF Tours - Bike Rental & Tour Management System

A comprehensive business management application for bicycle rental and tour operations. Track tours, rentals, income, expenses, invoices, and generate financial reports - all in one place.

## 📋 Table of Contents
- [Setup Instructions](#setup-instructions)
- [Seeding the Database](#seeding-the-database)
- [Features](#features)
- [Usage](#usage)
- [Tech Stack](#tech-stack)

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository** (if not already done)
   ```bash
   git clone <repository-url>
   cd bike-rental-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the application**
   ```bash
   npm run dev
   ```

The app will be running at:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001

The SQLite database will be automatically created on first run at `server/database.sqlite`.

## 🌱 Seeding the Database

To populate the database with demo data for testing:

```bash
npm run seed
```

This will create:
- 5 sample clients (hotels, tour operators)
- 5 daily tours with realistic data
- 2 multi-day tours
- 1 custom tour
- 3 bike rental services
- 3 other income entries
- 8 cost entries (fixed and variable costs)
- 5 assets (bikes, equipment, vehicles)
- Company settings

**⚠️ Warning:** This command clears all existing data before seeding. Use only for demo/testing purposes.

## ✨ Features

### ✅ Fully Implemented

#### Daily Tours Management
- **Complete data entry form** with all required fields:
  - Date, Product Category & Subcategory
  - Number of PAX with automatic calculations
  - Price per PAX ↔ Total Income (bidirectional calculation)
  - Commission fee calculation (percentage-based deduction)
  - Multiple guide support (up to 4 guides with individual costs)
  - F&B, Tickets, Transportation, and Other costs tracking
  - **Automatic profit calculation** (Total Income - Total Costs)
  - Payment tracking (Income & Cost paid status)
  - Booking platform selection (Airbnb, Get Your Guide, Viator, etc.)
  - Client association
  - Comments field

- **Data table view** showing:
  - All tours with key metrics
  - Visual profit indicators (green for profit, red for loss)
  - Payment status badges
  - Edit and delete actions

#### Client Management
- Add, edit, and delete clients
- Store contact information (email, phone, address)
- Notes field for additional client information
- Client selection in tour bookings

#### Navigation & UI
- **Professional sidebar navigation** similar to pausal.app
- Collapsible sections for Income, Costs, and Reports
- Clean, modern design with responsive layout
- Modal-based forms for data entry

### 🔧 Backend Infrastructure (Ready for Frontend Integration)

The following modules have complete backend APIs ready to use:

#### Multi-day Tours
- Same comprehensive tracking as Daily Tours
- Extended duration support
- All calculations and cost tracking

#### Renting Services
- Bicycle rental tracking
- Simplified cost structure
- Payment management

#### Custom Made Tours
- Flexible tour configuration
- Full cost and income tracking
- Client management

#### Other Income
- Miscellaneous income tracking
- Payment categorization

#### Cost Management
- Fixed, Variable, and Other expense categories
- Payment tracking
- Category management

#### Assets
- Equipment and asset tracking
- Depreciation support
- Payment monitoring

#### Invoices
- Domestic and foreign invoice types
- Line item support
- Tax calculations
- Status tracking (Draft, Sent, Paid)

#### Reports & Analytics
- **Cash Flow Report**: Income vs expenses over time
- **Profit & Loss Report**: Revenue, costs, and net profit
- **Tour Analysis**: Performance metrics by tour type
- Date range filtering

## 💻 Development Commands

```bash
# Start both frontend and backend
npm run dev

# Start only backend server
npm run server:dev

# Seed database with demo data
npm run seed

# Build for production
npm run build

# Run linter
npm run lint
```

## 📊 Usage

### Adding a Daily Tour

1. Navigate to **Income > Daily Tours**
2. Click **"+ New Tour"** button
3. Fill in the form:
   - **Basic Info**: Date, Category, Subcategory
   - **Revenue**: Number of PAX and Price per PAX (automatically calculates income)
   - **Additional Income**: Add other income sources
   - **Commission**: Enter percentage if applicable (auto-deducts from total)
   - **Guide Costs**: Add up to 4 guides with their costs
   - **Other Costs**: F&B, Transportation, etc.
   - **Payment Info**: Mark as paid and select payment method
   - **Platform**: Choose booking platform
   - **Client**: Select from client list (or add new client first)
4. Click **"Create Tour"**

**✨ All calculations happen automatically!**
- Income = PAX × Price per PAX
- Total Income = Income + Other Income - Commission
- Total Cost = Guide Costs + F&B + Transportation + Other
- **Profit = Total Income - Total Cost**

### Managing Clients

1. Navigate to **Clients**
2. Click **"+ New Client"**
3. Enter client details
4. Save - Client will now appear in tour dropdowns

## 🏗️ Tech Stack

**Frontend:**
- React 19 with TypeScript
- React Router for navigation
- Axios for API calls
- Lucide React for icons
- date-fns for date formatting
- Vite as build tool

**Backend:**
- Node.js with Express
- TypeScript
- SQLite3 database (automatically created on first run)
- RESTful API design

**Database:**
- SQLite stored at `server/database.sqlite`
- Automatically created and initialized on first run
- No external database setup required
- All data persists between sessions

### Project Structure

```
bike-rental-app/
├── src/                      # Frontend React application
│   ├── components/          # Reusable UI components
│   │   └── Sidebar.tsx     # Navigation sidebar
│   ├── pages/              # Page components
│   │   ├── Dashboard.tsx
│   │   ├── DailyTours.tsx  # ✅ Fully functional
│   │   ├── Clients.tsx      # ✅ Fully functional
│   │   ├── MultiDayTours.tsx
│   │   ├── RentingServices.tsx
│   │   ├── CustomTours.tsx
│   │   ├── OtherIncome.tsx
│   │   ├── Costs.tsx
│   │   ├── Assets.tsx
│   │   ├── Invoices.tsx
│   │   ├── Reports.tsx
│   │   └── Settings.tsx
│   ├── services/           # API service layer
│   │   └── api.ts         # API client configuration
│   ├── App.tsx            # Main application component
│   └── App.css            # Global styles
│
├── server/                 # Backend Node.js/Express server
│   └── src/
│       ├── database.ts    # Database configuration & schema
│       ├── index.ts       # Express server setup
│       └── routes/        # API route handlers
│           ├── clients.ts
│           ├── dailyTours.ts
│           ├── multiDayTours.ts
│           ├── rentingServices.ts
│           ├── customTours.ts
│           ├── otherIncome.ts
│           ├── costs.ts
│           ├── assets.ts
│           ├── invoices.ts
│           ├── categories.ts
│           ├── reports.ts
│           └── settings.ts
│
└── package.json           # Dependencies and scripts
```

## 📝 API Endpoints

All endpoints are available at `http://localhost:3001/api`

### Clients
- `GET /clients` - List all clients
- `POST /clients` - Create client
- `PUT /clients/:id` - Update client
- `DELETE /clients/:id` - Delete client

### Daily Tours
- `GET /daily-tours` - List all daily tours
- `POST /daily-tours` - Create tour
- `PUT /daily-tours/:id` - Update tour
- `DELETE /daily-tours/:id` - Delete tour

### Reports
- `GET /reports/cash-flow?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD`
- `GET /reports/profit-loss?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD`
- `GET /reports/tour-analysis?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD`

*(Similar endpoints exist for all other modules)*

---

Built for SAF Tours business operations.
