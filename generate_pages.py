#!/usr/bin/env python3

pages = {
    'Dashboard': '''const Dashboard = () => {
  return (
    <div>
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Welcome to SAF Tours Management System</p>
      </div>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Revenue</div>
          <div className="stat-value">€0</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Costs</div>
          <div className="stat-value">€0</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Net Profit</div>
          <div className="stat-value">€0</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Tours</div>
          <div className="stat-value">0</div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;''',
    'DailyTours': '''const DailyTours = () => {
  return (
    <div>
      <div className="page-header">
        <h1>Daily Tours</h1>
        <p>Manage your daily tour bookings and track performance</p>
      </div>
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Daily Tours</h2>
          <button className="btn btn-primary">+ New Tour</button>
        </div>
        <div className="empty-state">
          <div>No daily tours yet. Click "New Tour" to get started.</div>
        </div>
      </div>
    </div>
  );
};

export default DailyTours;''',
    'MultiDayTours': '''const MultiDayTours = () => {
  return (
    <div>
      <div className="page-header">
        <h1>Multi-day Tours</h1>
        <p>Manage your multi-day tour bookings</p>
      </div>
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Multi-day Tours</h2>
          <button className="btn btn-primary">+ New Tour</button>
        </div>
        <div className="empty-state">
          <div>No multi-day tours yet. Click "New Tour" to get started.</div>
        </div>
      </div>
    </div>
  );
};

export default MultiDayTours;''',
    'RentingServices': '''const RentingServices = () => {
  return (
    <div>
      <div className="page-header">
        <h1>Renting Services</h1>
        <p>Manage bicycle rentals and related services</p>
      </div>
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Renting Services</h2>
          <button className="btn btn-primary">+ New Rental</button>
        </div>
        <div className="empty-state">
          <div>No rentals yet. Click "New Rental" to get started.</div>
        </div>
      </div>
    </div>
  );
};

export default RentingServices;''',
    'CustomTours': '''const CustomTours = () => {
  return (
    <div>
      <div className="page-header">
        <h1>Custom Made Tours</h1>
        <p>Manage custom tour requests and bookings</p>
      </div>
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Custom Tours</h2>
          <button className="btn btn-primary">+ New Custom Tour</button>
        </div>
        <div className="empty-state">
          <div>No custom tours yet. Click "New Custom Tour" to get started.</div>
        </div>
      </div>
    </div>
  );
};

export default CustomTours;''',
    'OtherIncome': '''const OtherIncome = () => {
  return (
    <div>
      <div className="page-header">
        <h1>Other Income</h1>
        <p>Track additional income sources</p>
      </div>
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Other Income</h2>
          <button className="btn btn-primary">+ New Income</button>
        </div>
        <div className="empty-state">
          <div>No other income yet. Click "New Income" to get started.</div>
        </div>
      </div>
    </div>
  );
};

export default OtherIncome;''',
    'Costs': '''const Costs = () => {
  return (
    <div>
      <div className="page-header">
        <h1>Costs & Expenses</h1>
        <p>Track fixed, variable, and other business expenses</p>
      </div>
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">All Expenses</h2>
          <button className="btn btn-primary">+ New Expense</button>
        </div>
        <div className="empty-state">
          <div>No expenses yet. Click "New Expense" to get started.</div>
        </div>
      </div>
    </div>
  );
};

export default Costs;''',
    'Assets': '''const Assets = () => {
  return (
    <div>
      <div className="page-header">
        <h1>Assets</h1>
        <p>Manage business assets and equipment</p>
      </div>
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Assets</h2>
          <button className="btn btn-primary">+ New Asset</button>
        </div>
        <div className="empty-state">
          <div>No assets yet. Click "New Asset" to get started.</div>
        </div>
      </div>
    </div>
  );
};

export default Assets;''',
    'Clients': '''const Clients = () => {
  return (
    <div>
      <div className="page-header">
        <h1>Clients</h1>
        <p>Manage your client database</p>
      </div>
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Client List</h2>
          <button className="btn btn-primary">+ New Client</button>
        </div>
        <div className="empty-state">
          <div>No clients yet. Click "New Client" to get started.</div>
        </div>
      </div>
    </div>
  );
};

export default Clients;''',
    'Invoices': '''const Invoices = () => {
  return (
    <div>
      <div className="page-header">
        <h1>Invoices</h1>
        <p>Generate and manage invoices</p>
      </div>
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Invoices</h2>
          <button className="btn btn-primary">+ New Invoice</button>
        </div>
        <div className="empty-state">
          <div>No invoices yet. Click "New Invoice" to get started.</div>
        </div>
      </div>
    </div>
  );
};

export default Invoices;''',
    'Reports': '''const Reports = () => {
  return (
    <div>
      <div className="page-header">
        <h1>Reports</h1>
        <p>View business analytics and reports</p>
      </div>
      <div className="card">
        <h2 className="card-title">Available Reports</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1rem", marginTop: "1.5rem" }}>
          <div className="card">
            <h3>Cash Flow</h3>
            <p>View income and expenses flow</p>
          </div>
          <div className="card">
            <h3>Profit & Loss</h3>
            <p>Analyze profitability</p>
          </div>
          <div className="card">
            <h3>Tour Analysis</h3>
            <p>Tour performance metrics</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;''',
    'Settings': '''const Settings = () => {
  return (
    <div>
      <div className="page-header">
        <h1>Settings</h1>
        <p>Configure your application settings</p>
      </div>
      <div className="card">
        <h2 className="card-title">Company Information</h2>
        <div className="form-group">
          <label>Company Name</label>
          <input type="text" placeholder="Enter company name" />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input type="email" placeholder="Enter email" />
        </div>
        <div className="form-group">
          <label>Phone</label>
          <input type="tel" placeholder="Enter phone" />
        </div>
        <div className="form-group">
          <label>Address</label>
          <textarea rows={3} placeholder="Enter address"></textarea>
        </div>
        <button className="btn btn-primary">Save Settings</button>
      </div>
    </div>
  );
};

export default Settings;'''
}

# Generate all page files
for name, content in pages.items():
    filename = f"src/pages/{name}.tsx"
    with open(filename, 'w') as f:
        f.write(content)
    print(f"Created {filename}")

print("\nAll pages created successfully!")
