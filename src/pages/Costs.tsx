const Costs = () => {
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

export default Costs;