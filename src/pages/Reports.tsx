const Reports = () => {
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

export default Reports;