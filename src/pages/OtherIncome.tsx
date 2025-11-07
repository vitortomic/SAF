const OtherIncome = () => {
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

export default OtherIncome;