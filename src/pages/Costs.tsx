import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import { costsApi } from '../services/api';
import { format } from 'date-fns';

interface Cost {
  id?: number;
  entry_date: string;
  main_category: string;
  subcategory: string;
  amount: number;
  payment_date: string;
  cost_paid: boolean;
  cost_category: string;
  comments: string;
}

const Costs = () => {
  const [costs, setCosts] = useState<Cost[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingCost, setEditingCost] = useState<Cost | null>(null);
  const [formData, setFormData] = useState<Cost>({
    entry_date: format(new Date(), 'yyyy-MM-dd'),
    main_category: 'Fixed',
    subcategory: '',
    amount: 0,
    payment_date: format(new Date(), 'yyyy-MM-dd'),
    cost_paid: false,
    cost_category: 'Cash',
    comments: '',
  });

  useEffect(() => {
    fetchCosts();
  }, []);

  const fetchCosts = async () => {
    try {
      const response = await costsApi.getAll();
      setCosts(response.data);
    } catch (error) {
      console.error('Error fetching costs:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (type === 'number' ? parseFloat(value) || 0 : value)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCost?.id) {
        await costsApi.update(editingCost.id, formData);
      } else {
        await costsApi.create(formData);
      }
      fetchCosts();
      closeModal();
    } catch (error) {
      console.error('Error saving cost:', error);
      alert('Failed to save cost');
    }
  };

  const handleEdit = (cost: Cost) => {
    setEditingCost(cost);
    setFormData(cost);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this cost entry?')) {
      try {
        await costsApi.delete(id);
        fetchCosts();
      } catch (error) {
        console.error('Error deleting cost:', error);
      }
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingCost(null);
    setFormData({
      entry_date: format(new Date(), 'yyyy-MM-dd'),
      main_category: 'Fixed',
      subcategory: '',
      amount: 0,
      payment_date: format(new Date(), 'yyyy-MM-dd'),
      cost_paid: false,
      cost_category: 'Cash',
      comments: '',
    });
  };

  const totalCosts = costs.reduce((sum, item) => sum + (item.amount || 0), 0);
  const fixedCosts = costs.filter(c => c.main_category === 'Fixed').reduce((sum, item) => sum + (item.amount || 0), 0);
  const variableCosts = costs.filter(c => c.main_category === 'Variable').reduce((sum, item) => sum + (item.amount || 0), 0);
  const otherCosts = costs.filter(c => c.main_category === 'Other').reduce((sum, item) => sum + (item.amount || 0), 0);

  return (
    <div>
      <div className="page-header">
        <h1>Costs & Expenses</h1>
        <p>Track fixed, variable, and other business expenses</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Costs</div>
          <div className="stat-value" style={{ color: '#dc2626' }}>€{totalCosts.toFixed(2)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Fixed Costs</div>
          <div className="stat-value">€{fixedCosts.toFixed(2)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Variable Costs</div>
          <div className="stat-value">€{variableCosts.toFixed(2)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Other Costs</div>
          <div className="stat-value">€{otherCosts.toFixed(2)}</div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">All Expenses</h2>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={18} /> New Expense
          </button>
        </div>

        {costs.length === 0 ? (
          <div className="empty-state">
            <div>No expenses yet. Click "New Expense" to get started.</div>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Entry Date</th>
                <th>Category</th>
                <th>Subcategory</th>
                <th>Amount</th>
                <th>Payment Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {costs.map((cost) => (
                <tr key={cost.id}>
                  <td>{cost.entry_date}</td>
                  <td>
                    <span className={`badge ${
                      cost.main_category === 'Fixed' ? 'badge-danger' :
                      cost.main_category === 'Variable' ? 'badge-warning' : 'badge-info'
                    }`}>
                      {cost.main_category}
                    </span>
                  </td>
                  <td>{cost.subcategory}</td>
                  <td style={{ fontWeight: 600, color: '#dc2626' }}>€{cost.amount?.toFixed(2)}</td>
                  <td>{cost.payment_date}</td>
                  <td>
                    {cost.cost_paid ? (
                      <span className="badge badge-success">Paid</span>
                    ) : (
                      <span className="badge badge-danger">Unpaid</span>
                    )}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className="btn btn-secondary" onClick={() => handleEdit(cost)} style={{ padding: '0.25rem 0.5rem' }}>
                        <Edit size={16} />
                      </button>
                      <button className="btn btn-danger" onClick={() => handleDelete(cost.id!)} style={{ padding: '0.25rem 0.5rem' }}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2 className="modal-title">{editingCost ? 'Edit Expense' : 'New Expense'}</h2>
              <button onClick={closeModal} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Entry Date *</label>
                  <input type="date" name="entry_date" value={formData.entry_date} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label>Main Category *</label>
                  <select name="main_category" value={formData.main_category} onChange={handleInputChange} required>
                    <option value="Fixed">Fixed Expenses</option>
                    <option value="Variable">Variable Expenses</option>
                    <option value="Other">Other Expenses</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Amount (€) *</label>
                  <input type="number" name="amount" value={formData.amount} onChange={handleInputChange} step="0.01" required />
                </div>
              </div>

              <div className="form-group">
                <label>Subcategory</label>
                <select name="subcategory" value={formData.subcategory} onChange={handleInputChange}>
                  <option value="">Select subcategory...</option>
                  {formData.main_category === 'Fixed' && (
                    <>
                      <option>Rent</option>
                      <option>Salaries</option>
                      <option>Insurance</option>
                      <option>Utilities</option>
                      <option>Other</option>
                    </>
                  )}
                  {formData.main_category === 'Variable' && (
                    <>
                      <option>Supplies</option>
                      <option>Maintenance</option>
                      <option>Marketing</option>
                      <option>Fuel</option>
                      <option>Other</option>
                    </>
                  )}
                  {formData.main_category === 'Other' && (
                    <>
                      <option>One-time Expense</option>
                      <option>Miscellaneous</option>
                      <option>Other</option>
                    </>
                  )}
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Payment Date</label>
                  <input type="date" name="payment_date" value={formData.payment_date} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label>Payment Category</label>
                  <select name="cost_category" value={formData.cost_category} onChange={handleInputChange}>
                    <option>Cash</option>
                    <option>Bank</option>
                    <option>Credit Card</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>
                    <input type="checkbox" name="cost_paid" checked={formData.cost_paid} onChange={handleInputChange} style={{ marginRight: '0.5rem' }} />
                    Cost Paid
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label>Comments</label>
                <textarea name="comments" value={formData.comments} onChange={handleInputChange} rows={3} placeholder="Additional notes..." />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingCost ? 'Update Expense' : 'Create Expense'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Costs;
