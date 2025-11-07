import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import { rentingServicesApi, clientsApi } from '../services/api';
import { format } from 'date-fns';

interface RentingService {
  id?: number;
  date: string;
  product_category: string;
  product_subcategory: string;
  num_pax: number;
  price_per_pax: number;
  income: number;
  other_income: number;
  total_income: number;
  other_cost: number;
  total_cost: number;
  total_profit: number;
  income_paid: boolean;
  income_paid_date: string;
  income_category: string;
  cost_paid: boolean;
  cost_category: string;
  client_id: number | null;
  comments: string;
  client_name?: string;
}

const RentingServices = () => {
  const [services, setServices] = useState<RentingService[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState<RentingService | null>(null);
  const [formData, setFormData] = useState<RentingService>({
    date: format(new Date(), 'yyyy-MM-dd'),
    product_category: 'Bike Rent',
    product_subcategory: 'Standard Bike',
    num_pax: 1,
    price_per_pax: 0,
    income: 0,
    other_income: 0,
    total_income: 0,
    other_cost: 0,
    total_cost: 0,
    total_profit: 0,
    income_paid: false,
    income_paid_date: '',
    income_category: 'Cash',
    cost_paid: false,
    cost_category: 'Cash',
    client_id: null,
    comments: '',
  });

  useEffect(() => {
    fetchServices();
    fetchClients();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await rentingServicesApi.getAll();
      setServices(response.data);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const fetchClients = async () => {
    try {
      const response = await clientsApi.getAll();
      setClients(response.data);
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => {
      const updated = {
        ...prev,
        [name]: type === 'checkbox' ? checked : (type === 'number' ? parseFloat(value) || 0 : value)
      };

      if (name === 'num_pax' || name === 'price_per_pax') {
        updated.income = updated.num_pax * updated.price_per_pax;
      }

      updated.total_income = updated.income + updated.other_income;
      updated.total_cost = updated.other_cost;
      updated.total_profit = updated.total_income - updated.total_cost;

      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingService?.id) {
        await rentingServicesApi.update(editingService.id, formData);
      } else {
        await rentingServicesApi.create(formData);
      }
      fetchServices();
      closeModal();
    } catch (error) {
      console.error('Error saving service:', error);
      alert('Failed to save service');
    }
  };

  const handleEdit = (service: RentingService) => {
    setEditingService(service);
    setFormData(service);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this rental service?')) {
      try {
        await rentingServicesApi.delete(id);
        fetchServices();
      } catch (error) {
        console.error('Error deleting service:', error);
      }
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingService(null);
    setFormData({
      date: format(new Date(), 'yyyy-MM-dd'),
      product_category: 'Bike Rent',
      product_subcategory: 'Standard Bike',
      num_pax: 1,
      price_per_pax: 0,
      income: 0,
      other_income: 0,
      total_income: 0,
      other_cost: 0,
      total_cost: 0,
      total_profit: 0,
      income_paid: false,
      income_paid_date: '',
      income_category: 'Cash',
      cost_paid: false,
      cost_category: 'Cash',
      client_id: null,
      comments: '',
    });
  };

  return (
    <div>
      <div className="page-header">
        <h1>Renting Services</h1>
        <p>Manage bicycle rentals and related services</p>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Renting Services</h2>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={18} /> New Rental
          </button>
        </div>

        {services.length === 0 ? (
          <div className="empty-state">
            <div>No rentals yet. Click "New Rental" to get started.</div>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Category</th>
                  <th>Quantity</th>
                  <th>Income</th>
                  <th>Cost</th>
                  <th>Profit</th>
                  <th>Paid</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {services.map((service) => (
                  <tr key={service.id}>
                    <td>{service.date}</td>
                    <td>{service.product_category} - {service.product_subcategory}</td>
                    <td>{service.num_pax}</td>
                    <td>€{service.total_income?.toFixed(2)}</td>
                    <td>€{service.total_cost?.toFixed(2)}</td>
                    <td style={{ color: (service.total_profit || 0) >= 0 ? '#16a34a' : '#dc2626', fontWeight: 600 }}>
                      €{service.total_profit?.toFixed(2)}
                    </td>
                    <td>
                      {service.income_paid ? (
                        <span className="badge badge-success">Paid</span>
                      ) : (
                        <span className="badge badge-danger">Unpaid</span>
                      )}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="btn btn-secondary" onClick={() => handleEdit(service)} style={{ padding: '0.25rem 0.5rem' }}>
                          <Edit size={16} />
                        </button>
                        <button className="btn btn-danger" onClick={() => handleDelete(service.id!)} style={{ padding: '0.25rem 0.5rem' }}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2 className="modal-title">{editingService ? 'Edit Rental' : 'New Rental Service'}</h2>
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
                  <label>Product Category</label>
                  <select name="product_category" value={formData.product_category} onChange={handleInputChange}>
                    <option>Bike Rent</option>
                    <option>E-Bike Rent</option>
                    <option>Equipment Rent</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Product Subcategory</label>
                  <select name="product_subcategory" value={formData.product_subcategory} onChange={handleInputChange}>
                    <option>Standard Bike</option>
                    <option>Premium Bike</option>
                    <option>Electric Bike</option>
                    <option>Children Bike</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Quantity *</label>
                  <input type="number" name="num_pax" value={formData.num_pax} onChange={handleInputChange} required min="1" />
                </div>
                <div className="form-group">
                  <label>Price per Unit (€)</label>
                  <input type="number" name="price_per_pax" value={formData.price_per_pax} onChange={handleInputChange} step="0.01" />
                </div>
                <div className="form-group">
                  <label>Income (€)</label>
                  <input type="number" name="income" value={formData.income} onChange={handleInputChange} step="0.01" />
                </div>
                <div className="form-group">
                  <label>Other Income (€)</label>
                  <input type="number" name="other_income" value={formData.other_income} onChange={handleInputChange} step="0.01" />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Total Income (€)</label>
                  <input type="number" name="total_income" value={formData.total_income} readOnly style={{ backgroundColor: '#f3f4f6' }} />
                </div>
                <div className="form-group">
                  <label>Other Cost (€)</label>
                  <input type="number" name="other_cost" value={formData.other_cost} onChange={handleInputChange} step="0.01" />
                </div>
                <div className="form-group">
                  <label>Total Cost (€)</label>
                  <input type="number" name="total_cost" value={formData.total_cost} readOnly style={{ backgroundColor: '#f3f4f6' }} />
                </div>
                <div className="form-group">
                  <label>Total Profit (€)</label>
                  <input
                    type="number"
                    value={formData.total_profit}
                    readOnly
                    style={{
                      backgroundColor: '#f3f4f6',
                      color: formData.total_profit >= 0 ? '#16a34a' : '#dc2626',
                      fontWeight: 600
                    }}
                  />
                </div>
              </div>

              <h3 style={{ marginTop: '1.5rem', marginBottom: '1rem' }}>Payment Information</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>
                    <input type="checkbox" name="income_paid" checked={formData.income_paid} onChange={handleInputChange} />
                    Income Paid
                  </label>
                </div>
                <div className="form-group">
                  <label>Income Payment Date</label>
                  <input type="date" name="income_paid_date" value={formData.income_paid_date} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label>Income Payment Category</label>
                  <select name="income_category" value={formData.income_category} onChange={handleInputChange}>
                    <option>Cash</option>
                    <option>Bank</option>
                    <option>Card</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>
                    <input type="checkbox" name="cost_paid" checked={formData.cost_paid} onChange={handleInputChange} />
                    Cost Paid
                  </label>
                </div>
                <div className="form-group">
                  <label>Cost Payment Category</label>
                  <select name="cost_category" value={formData.cost_category} onChange={handleInputChange}>
                    <option>Cash</option>
                    <option>Bank</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>

              <h3 style={{ marginTop: '1.5rem', marginBottom: '1rem' }}>Additional Information</h3>
              <div className="form-group">
                <label>Client</label>
                <select name="client_id" value={formData.client_id || ''} onChange={handleInputChange}>
                  <option value="">No Client</option>
                  {clients.map(client => (
                    <option key={client.id} value={client.id}>{client.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Comments</label>
                <textarea name="comments" value={formData.comments} onChange={handleInputChange} rows={3} />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingService ? 'Update Rental' : 'Create Rental'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RentingServices;
