import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import { otherIncomeApi } from '../services/api';
import { format } from 'date-fns';

interface OtherIncome {
  id?: number;
  date: string;
  description: string;
  income: number;
  payment_date: string;
  income_category: string;
}

const OtherIncome = () => {
  const [incomeList, setIncomeList] = useState<OtherIncome[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingIncome, setEditingIncome] = useState<OtherIncome | null>(null);
  const [formData, setFormData] = useState<OtherIncome>({
    date: format(new Date(), 'yyyy-MM-dd'),
    description: '',
    income: 0,
    payment_date: format(new Date(), 'yyyy-MM-dd'),
    income_category: 'Cash',
  });

  useEffect(() => {
    fetchIncome();
  }, []);

  const fetchIncome = async () => {
    try {
      const response = await otherIncomeApi.getAll();
      setIncomeList(response.data);
    } catch (error) {
      console.error('Error fetching income:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingIncome?.id) {
        await otherIncomeApi.update(editingIncome.id, formData);
      } else {
        await otherIncomeApi.create(formData);
      }
      fetchIncome();
      closeModal();
    } catch (error) {
      console.error('Error saving income:', error);
      alert('Failed to save income');
    }
  };

  const handleEdit = (income: OtherIncome) => {
    setEditingIncome(income);
    setFormData(income);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this income entry?')) {
      try {
        await otherIncomeApi.delete(id);
        fetchIncome();
      } catch (error) {
        console.error('Error deleting income:', error);
      }
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingIncome(null);
    setFormData({
      date: format(new Date(), 'yyyy-MM-dd'),
      description: '',
      income: 0,
      payment_date: format(new Date(), 'yyyy-MM-dd'),
      income_category: 'Cash',
    });
  };

  const totalIncome = incomeList.reduce((sum, item) => sum + (item.income || 0), 0);

  return (
    <div>
      <div className="page-header">
        <h1>Other Income</h1>
        <p>Track additional income sources</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Other Income</div>
          <div className="stat-value">€{totalIncome.toFixed(2)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Number of Entries</div>
          <div className="stat-value">{incomeList.length}</div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Other Income</h2>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={18} /> New Income
          </button>
        </div>

        {incomeList.length === 0 ? (
          <div className="empty-state">
            <div>No other income yet. Click "New Income" to get started.</div>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Income</th>
                <th>Payment Date</th>
                <th>Category</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {incomeList.map((income) => (
                <tr key={income.id}>
                  <td>{income.date}</td>
                  <td>{income.description}</td>
                  <td style={{ fontWeight: 600, color: '#16a34a' }}>€{income.income?.toFixed(2)}</td>
                  <td>{income.payment_date}</td>
                  <td><span className="badge badge-info">{income.income_category}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className="btn btn-secondary" onClick={() => handleEdit(income)} style={{ padding: '0.25rem 0.5rem' }}>
                        <Edit size={16} />
                      </button>
                      <button className="btn btn-danger" onClick={() => handleDelete(income.id!)} style={{ padding: '0.25rem 0.5rem' }}>
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
              <h2 className="modal-title">{editingIncome ? 'Edit Income' : 'New Other Income'}</h2>
              <button onClick={closeModal} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Date *</label>
                  <input type="date" name="date" value={formData.date} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label>Income (€) *</label>
                  <input type="number" name="income" value={formData.income} onChange={handleInputChange} step="0.01" required />
                </div>
              </div>

              <div className="form-group">
                <label>Description *</label>
                <textarea name="description" value={formData.description} onChange={handleInputChange} rows={3} required placeholder="Describe the income source..." />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Payment Date</label>
                  <input type="date" name="payment_date" value={formData.payment_date} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label>Income Category</label>
                  <select name="income_category" value={formData.income_category} onChange={handleInputChange}>
                    <option>Cash</option>
                    <option>Bank</option>
                    <option>Payoneer</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingIncome ? 'Update Income' : 'Create Income'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OtherIncome;
