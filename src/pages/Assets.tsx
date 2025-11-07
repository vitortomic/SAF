import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import { assetsApi } from '../services/api';
import { format } from 'date-fns';

interface Asset {
  id?: number;
  entry_date: string;
  main_category: string;
  subcategory: string;
  amount: number;
  payment_date: string;
  paid: boolean;
  category: string;
}

const Assets = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [formData, setFormData] = useState<Asset>({
    entry_date: format(new Date(), 'yyyy-MM-dd'),
    main_category: 'Equipment',
    subcategory: '',
    amount: 0,
    payment_date: format(new Date(), 'yyyy-MM-dd'),
    paid: false,
    category: 'Cash',
  });

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    try {
      const response = await assetsApi.getAll();
      setAssets(response.data);
    } catch (error) {
      console.error('Error fetching assets:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
      if (editingAsset?.id) {
        await assetsApi.update(editingAsset.id, formData);
      } else {
        await assetsApi.create(formData);
      }
      fetchAssets();
      closeModal();
    } catch (error) {
      console.error('Error saving asset:', error);
      alert('Failed to save asset');
    }
  };

  const handleEdit = (asset: Asset) => {
    setEditingAsset(asset);
    setFormData(asset);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this asset?')) {
      try {
        await assetsApi.delete(id);
        fetchAssets();
      } catch (error) {
        console.error('Error deleting asset:', error);
      }
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingAsset(null);
    setFormData({
      entry_date: format(new Date(), 'yyyy-MM-dd'),
      main_category: 'Equipment',
      subcategory: '',
      amount: 0,
      payment_date: format(new Date(), 'yyyy-MM-dd'),
      paid: false,
      category: 'Cash',
    });
  };

  const totalAssets = assets.reduce((sum, item) => sum + (item.amount || 0), 0);

  return (
    <div>
      <div className="page-header">
        <h1>Assets</h1>
        <p>Manage business assets and equipment</p>
      </div>

      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
        <div className="stat-card">
          <div className="stat-label">Total Assets Value</div>
          <div className="stat-value">€{totalAssets.toFixed(2)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Number of Assets</div>
          <div className="stat-value">{assets.length}</div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Assets</h2>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={18} /> New Asset
          </button>
        </div>

        {assets.length === 0 ? (
          <div className="empty-state">
            <div>No assets yet. Click "New Asset" to get started.</div>
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
              {assets.map((asset) => (
                <tr key={asset.id}>
                  <td>{asset.entry_date}</td>
                  <td><span className="badge badge-info">{asset.main_category}</span></td>
                  <td>{asset.subcategory}</td>
                  <td style={{ fontWeight: 600 }}>€{asset.amount?.toFixed(2)}</td>
                  <td>{asset.payment_date}</td>
                  <td>
                    {asset.paid ? (
                      <span className="badge badge-success">Paid</span>
                    ) : (
                      <span className="badge badge-warning">Unpaid</span>
                    )}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className="btn btn-secondary" onClick={() => handleEdit(asset)} style={{ padding: '0.25rem 0.5rem' }}>
                        <Edit size={16} />
                      </button>
                      <button className="btn btn-danger" onClick={() => handleDelete(asset.id!)} style={{ padding: '0.25rem 0.5rem' }}>
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
              <h2 className="modal-title">{editingAsset ? 'Edit Asset' : 'New Asset'}</h2>
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
                  <label>Main Category</label>
                  <select name="main_category" value={formData.main_category} onChange={handleInputChange}>
                    <option>Equipment</option>
                    <option>Bikes</option>
                    <option>Vehicles</option>
                    <option>Property</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Amount (€) *</label>
                  <input type="number" name="amount" value={formData.amount} onChange={handleInputChange} step="0.01" required />
                </div>
              </div>

              <div className="form-group">
                <label>Subcategory</label>
                <input type="text" name="subcategory" value={formData.subcategory} onChange={handleInputChange} placeholder="e.g., Mountain Bike, Van, etc." />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Payment Date</label>
                  <input type="date" name="payment_date" value={formData.payment_date} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label>Payment Category</label>
                  <select name="category" value={formData.category} onChange={handleInputChange}>
                    <option>Cash</option>
                    <option>Bank</option>
                    <option>Loan</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>
                    <input type="checkbox" name="paid" checked={formData.paid} onChange={handleInputChange} style={{ marginRight: '0.5rem' }} />
                    Paid
                  </label>
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingAsset ? 'Update Asset' : 'Create Asset'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Assets;
