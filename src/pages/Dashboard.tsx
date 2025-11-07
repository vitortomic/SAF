const Dashboard = () => {
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

export default Dashboard;