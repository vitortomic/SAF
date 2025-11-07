const Invoices = () => {
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

export default Invoices;