const RentingServices = () => {
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

export default RentingServices;