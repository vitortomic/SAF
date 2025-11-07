const CustomTours = () => {
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

export default CustomTours;