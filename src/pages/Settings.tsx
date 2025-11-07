const Settings = () => {
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

export default Settings;