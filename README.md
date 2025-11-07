# SAF Tours - Bike Rental & Tour Management System

A comprehensive business management application for bicycle rental and tour operations, built to replace Excel-based workflows with a modern, user-friendly interface.

## 🚀 Features

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

## 🏃 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

The application is already set up and running! The dependencies are installed and servers are active.

### Running the Application

The app is currently running at:
- **Frontend**: http://localhost:5175
- **Backend API**: http://localhost:3001

To start the servers (if not already running):
```bash
npm run dev
```

This command runs both:
- Frontend (Vite dev server)
- Backend (Node.js/Express API server)

### Development Commands

```bash
# Start both frontend and backend
npm run dev

# Start only backend server
npm run server:dev

# Build for production
npm run build

# Run linter
npm run lint
```

## 📊 How to Use

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

## 🗄️ Database

The application uses **SQLite** for data storage:
- Location: `server/database.sqlite`
- Automatically created on first run
- All data persists between sessions
- No external database setup required

## 🏗️ Architecture

### Tech Stack

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
- SQLite3 database
- RESTful API design

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

## 🎯 Next Steps

To complete the full feature set from your Excel requirements, implement:

1. **Forms for remaining modules** (using DailyTours as template):
   - Multi-day Tours
   - Renting Services
   - Custom Tours
   - Other Income
   - Costs
   - Assets
   - Invoices

2. **Enhanced Dashboard**:
   - Real-time statistics
   - Quick actions
   - Payment reminders

3. **Reports with visualizations**:
   - Charts and graphs using Chart.js or Recharts
   - Export to Excel/PDF

4. **Payment Notifications**:
   - Alert system for unpaid invoices
   - Payment due date reminders

5. **Category Management UI**:
   - Add custom tour categories
   - Manage expense categories

6. **Settings Page**:
   - Company information
   - Invoice templates
   - Language preferences

## 🔒 Data Models

### Daily Tour
```typescript
{
  date: string;
  product_category: string;
  product_subcategory: string;
  num_pax: number;
  price_per_pax: number;
  income: number;              // Auto-calculated
  other_income: number;
  commission_fee_percent: number;
  total_income: number;        // Auto-calculated
  guide1_name: string;
  guide1_cost: number;
  // ... up to guide4
  total_guide_cost: number;    // Auto-calculated
  fb_tickets_cost: number;
  transportation_cost: number;
  other_cost: number;
  total_cost: number;          // Auto-calculated
  total_profit: number;        // Auto-calculated
  income_paid: boolean;
  income_paid_date: string;
  income_paid_category: string;
  cost_paid: boolean;
  cost_paid_category: string;
  booking_platform: string;
  client_id: number;
  comments: string;
}
```

## 🤝 Contributing

This application was built to match your specific business requirements from the Excel sheets. Feel free to customize any aspect to better fit your workflow.

## 📄 License

Private use for SAF Tours business operations.

---

**Built with ❤️ by Claude**
**Version 1.0** - Initial Implementation
