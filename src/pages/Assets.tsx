const Assets = () => {
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

export default Assets;