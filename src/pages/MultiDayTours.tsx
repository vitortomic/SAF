const MultiDayTours = () => {
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

export default MultiDayTours;