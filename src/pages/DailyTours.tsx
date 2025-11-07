import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import { dailyToursApi, clientsApi } from '../services/api';
import { format } from 'date-fns';

interface DailyTour {
  id?: number;
  date: string;
  product_category: string;
  product_subcategory: string;
  num_pax: number;
  price_per_pax: number;
  income: number;
  other_income: number;
  commission_fee_percent: number;
  total_income: number;
  guide1_name: string;
  guide1_cost: number;
  guide2_name: string;
  guide2_cost: number;
  guide3_name: string;
  guide3_cost: number;
  guide4_name: string;
  guide4_cost: number;
  total_guide_cost: number;
  fb_tickets_cost: number;
  transportation_cost: number;
  other_cost: number;
  total_cost: number;
  total_profit: number;
  income_paid: boolean;
  income_paid_date: string;
  income_paid_category: string;
  cost_paid: boolean;
  cost_paid_category: string;
  booking_platform: string;
  client_id: number | null;
  comments: string;
  client_name?: string;
}

const DailyTours = () => {
  const [tours, setTours] = useState<DailyTour[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingTour, setEditingTour] = useState<DailyTour | null>(null);
  const [formData, setFormData] = useState<DailyTour>({
    date: format(new Date(), 'yyyy-MM-dd'),
    product_category: 'Walking Tour',
    product_subcategory: 'History Tour',
    num_pax: 1,
    price_per_pax: 0,
    income: 0,
    other_income: 0,
    commission_fee_percent: 0,
    total_income: 0,
    guide1_name: '',
    guide1_cost: 0,
    guide2_name: '',
    guide2_cost: 0,
    guide3_name: '',
    guide3_cost: 0,
    guide4_name: '',
    guide4_cost: 0,
    total_guide_cost: 0,
    fb_tickets_cost: 0,
    transportation_cost: 0,
    other_cost: 0,
    total_cost: 0,
    total_profit: 0,
    income_paid: false,
    income_paid_date: '',
    income_paid_category: 'Cash',
    cost_paid: false,
    cost_paid_category: 'Cash',
    booking_platform: 'Direct',
    client_id: null,
    comments: '',
  });

  useEffect(() => {
    fetchTours();
    fetchClients();
  }, []);

  const fetchTours = async () => {
    try {
      const response = await dailyToursApi.getAll();
      setTours(response.data);
    } catch (error) {
      console.error('Error fetching tours:', error);
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

      // Auto-calculate income based on pax and price
      if (name === 'num_pax' || name === 'price_per_pax') {
        updated.income = updated.num_pax * updated.price_per_pax;
      }

      // Calculate total income
      const commissionAmount = updated.income * (updated.commission_fee_percent / 100);
      updated.total_income = updated.income + updated.other_income - commissionAmount;

      // Calculate total guide cost
      updated.total_guide_cost = updated.guide1_cost + updated.guide2_cost + updated.guide3_cost + updated.guide4_cost;

      // Calculate total cost
      updated.total_cost = updated.total_guide_cost + updated.fb_tickets_cost + updated.transportation_cost + updated.other_cost;

      // Calculate profit
      updated.total_profit = updated.total_income - updated.total_cost;

      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingTour?.id) {
        await dailyToursApi.update(editingTour.id, formData);
      } else {
        await dailyToursApi.create(formData);
      }
      fetchTours();
      closeModal();
    } catch (error) {
      console.error('Error saving tour:', error);
      alert('Failed to save tour');
    }
  };

  const handleEdit = (tour: DailyTour) => {
    setEditingTour(tour);
    setFormData(tour);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this tour?')) {
      try {
        await dailyToursApi.delete(id);
        fetchTours();
      } catch (error) {
        console.error('Error deleting tour:', error);
      }
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingTour(null);
    setFormData({
      date: format(new Date(), 'yyyy-MM-dd'),
      product_category: 'Walking Tour',
      product_subcategory: 'History Tour',
      num_pax: 1,
      price_per_pax: 0,
      income: 0,
      other_income: 0,
      commission_fee_percent: 0,
      total_income: 0,
      guide1_name: '',
      guide1_cost: 0,
      guide2_name: '',
      guide2_cost: 0,
      guide3_name: '',
      guide3_cost: 0,
      guide4_name: '',
      guide4_cost: 0,
      total_guide_cost: 0,
      fb_tickets_cost: 0,
      transportation_cost: 0,
      other_cost: 0,
      total_cost: 0,
      total_profit: 0,
      income_paid: false,
      income_paid_date: '',
      income_paid_category: 'Cash',
      cost_paid: false,
      cost_paid_category: 'Cash',
      booking_platform: 'Direct',
      client_id: null,
      comments: '',
    });
  };

  return (
    <div>
      <div className="page-header">
        <h1>Daily Tours</h1>
        <p>Manage your daily tour bookings and track performance</p>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Daily Tours</h2>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={18} /> New Tour
          </button>
        </div>

        {tours.length === 0 ? (
          <div className="empty-state">
            <div>No daily tours yet. Click "New Tour" to get started.</div>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Category</th>
                  <th>PAX</th>
                  <th>Income</th>
                  <th>Total Cost</th>
                  <th>Profit</th>
                  <th>Paid</th>
                  <th>Platform</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tours.map((tour) => (
                  <tr key={tour.id}>
                    <td>{tour.date}</td>
                    <td>{tour.product_category} - {tour.product_subcategory}</td>
                    <td>{tour.num_pax}</td>
                    <td>€{tour.total_income?.toFixed(2)}</td>
                    <td>€{tour.total_cost?.toFixed(2)}</td>
                    <td style={{ color: (tour.total_profit || 0) >= 0 ? '#16a34a' : '#dc2626', fontWeight: 600 }}>
                      €{tour.total_profit?.toFixed(2)}
                    </td>
                    <td>
                      {tour.income_paid ? (
                        <span className="badge badge-success">Paid</span>
                      ) : (
                        <span className="badge badge-danger">Unpaid</span>
                      )}
                    </td>
                    <td>{tour.booking_platform}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="btn btn-secondary" onClick={() => handleEdit(tour)} style={{ padding: '0.25rem 0.5rem' }}>
                          <Edit size={16} />
                        </button>
                        <button className="btn btn-danger" onClick={() => handleDelete(tour.id!)} style={{ padding: '0.25rem 0.5rem' }}>
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
              <h2 className="modal-title">{editingTour ? 'Edit Tour' : 'New Daily Tour'}</h2>
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
                    <option>Walking Tour</option>
                    <option>Bike Tour</option>
                    <option>Food Tour</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Product Subcategory</label>
                  <select name="product_subcategory" value={formData.product_subcategory} onChange={handleInputChange}>
                    <option>History Tour</option>
                    <option>Urban & Alternative Tour</option>
                    <option>Pub Tour</option>
                    <option>Ultras Tour</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Number of PAX *</label>
                  <input type="number" name="num_pax" value={formData.num_pax} onChange={handleInputChange} required min="1" />
                </div>
                <div className="form-group">
                  <label>Price per PAX (€)</label>
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
                  <label>Commission Fee (%)</label>
                  <input type="number" name="commission_fee_percent" value={formData.commission_fee_percent} onChange={handleInputChange} step="0.1" />
                </div>
                <div className="form-group">
                  <label>Total Income (€)</label>
                  <input type="number" name="total_income" value={formData.total_income} readOnly style={{ backgroundColor: '#f3f4f6' }} />
                </div>
              </div>

              <h3 style={{ marginTop: '1.5rem', marginBottom: '1rem' }}>Guide Costs</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Guide 1 Name</label>
                  <input type="text" name="guide1_name" value={formData.guide1_name} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label>Guide 1 Cost (€)</label>
                  <input type="number" name="guide1_cost" value={formData.guide1_cost} onChange={handleInputChange} step="0.01" />
                </div>
                <div className="form-group">
                  <label>Guide 2 Name</label>
                  <input type="text" name="guide2_name" value={formData.guide2_name} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label>Guide 2 Cost (€)</label>
                  <input type="number" name="guide2_cost" value={formData.guide2_cost} onChange={handleInputChange} step="0.01" />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Guide 3 Name</label>
                  <input type="text" name="guide3_name" value={formData.guide3_name} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label>Guide 3 Cost (€)</label>
                  <input type="number" name="guide3_cost" value={formData.guide3_cost} onChange={handleInputChange} step="0.01" />
                </div>
                <div className="form-group">
                  <label>Guide 4 Name</label>
                  <input type="text" name="guide4_name" value={formData.guide4_name} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label>Guide 4 Cost (€)</label>
                  <input type="number" name="guide4_cost" value={formData.guide4_cost} onChange={handleInputChange} step="0.01" />
                </div>
              </div>

              <h3 style={{ marginTop: '1.5rem', marginBottom: '1rem' }}>Other Costs</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>F&B & Tickets Cost (€)</label>
                  <input type="number" name="fb_tickets_cost" value={formData.fb_tickets_cost} onChange={handleInputChange} step="0.01" />
                </div>
                <div className="form-group">
                  <label>Transportation Cost (€)</label>
                  <input type="number" name="transportation_cost" value={formData.transportation_cost} onChange={handleInputChange} step="0.01" />
                </div>
                <div className="form-group">
                  <label>Other Cost (€)</label>
                  <input type="number" name="other_cost" value={formData.other_cost} onChange={handleInputChange} step="0.01" />
                </div>
                <div className="form-group">
                  <label>Total Cost (€)</label>
                  <input type="number" name="total_cost" value={formData.total_cost} readOnly style={{ backgroundColor: '#f3f4f6' }} />
                </div>
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
                  <select name="income_paid_category" value={formData.income_paid_category} onChange={handleInputChange}>
                    <option>Cash</option>
                    <option>Bank</option>
                    <option>Payoneer</option>
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
                  <select name="cost_paid_category" value={formData.cost_paid_category} onChange={handleInputChange}>
                    <option>Cash</option>
                    <option>Bank</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>

              <h3 style={{ marginTop: '1.5rem', marginBottom: '1rem' }}>Additional Information</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Booking Platform</label>
                  <select name="booking_platform" value={formData.booking_platform} onChange={handleInputChange}>
                    <option>Direct</option>
                    <option>Airbnb</option>
                    <option>Get Your Guide</option>
                    <option>Viator</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Client</label>
                  <select name="client_id" value={formData.client_id || ''} onChange={handleInputChange}>
                    <option value="">No Client</option>
                    {clients.map(client => (
                      <option key={client.id} value={client.id}>{client.name}</option>
                    ))}
                  </select>
                </div>
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
                  {editingTour ? 'Update Tour' : 'Create Tour'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DailyTours;
