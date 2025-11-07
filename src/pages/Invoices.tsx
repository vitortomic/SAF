import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, FileText } from 'lucide-react';
import { invoicesApi, clientsApi } from '../services/api';
import { format } from 'date-fns';

interface Invoice {
  id?: number;
  invoice_number: string;
  client_id: number | null;
  date: string;
  due_date: string;
  type: string;
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  total: number;
  status: string;
  notes: string;
  client_name?: string;
}

const Invoices = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [formData, setFormData] = useState<Invoice>({
    invoice_number: `INV-${Date.now()}`,
    client_id: null,
    date: format(new Date(), 'yyyy-MM-dd'),
    due_date: format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'), // 30 days from now
    type: 'domestic',
    subtotal: 0,
    tax_rate: 20,
    tax_amount: 0,
    total: 0,
    status: 'draft',
    notes: '',
  });

  useEffect(() => {
    fetchInvoices();
    fetchClients();
  }, []);

  const fetchInvoices = async () => {
    try {
      const response = await invoicesApi.getAll();
      setInvoices(response.data);
    } catch (error) {
      console.error('Error fetching invoices:', error);
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

    setFormData(prev => {
      const updated = {
        ...prev,
        [name]: type === 'number' ? parseFloat(value) || 0 : value
      };

      // Recalculate totals when subtotal or tax_rate changes
      if (name === 'subtotal' || name === 'tax_rate') {
        updated.tax_amount = updated.subtotal * (updated.tax_rate / 100);
        updated.total = updated.subtotal + updated.tax_amount;
      }

      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingInvoice?.id) {
        await invoicesApi.update(editingInvoice.id, formData);
      } else {
        await invoicesApi.create(formData);
      }
      fetchInvoices();
      closeModal();
    } catch (error) {
      console.error('Error saving invoice:', error);
      alert('Failed to save invoice');
    }
  };

  const handleEdit = (invoice: Invoice) => {
    setEditingInvoice(invoice);
    setFormData(invoice);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      try {
        await invoicesApi.delete(id);
        fetchInvoices();
      } catch (error) {
        console.error('Error deleting invoice:', error);
      }
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingInvoice(null);
    setFormData({
      invoice_number: `INV-${Date.now()}`,
      client_id: null,
      date: format(new Date(), 'yyyy-MM-dd'),
      due_date: format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
      type: 'domestic',
      subtotal: 0,
      tax_rate: 20,
      tax_amount: 0,
      total: 0,
      status: 'draft',
      notes: '',
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <span className="badge badge-success">Paid</span>;
      case 'sent':
        return <span className="badge badge-info">Sent</span>;
      case 'overdue':
        return <span className="badge badge-danger">Overdue</span>;
      default:
        return <span className="badge badge-warning">Draft</span>;
    }
  };

  const totalRevenue = invoices.filter(i => i.status === 'paid').reduce((sum, inv) => sum + (inv.total || 0), 0);
  const pendingRevenue = invoices.filter(i => i.status === 'sent').reduce((sum, inv) => sum + (inv.total || 0), 0);

  return (
    <div>
      <div className="page-header">
        <h1>Invoices</h1>
        <p>Generate and manage invoices</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Invoices</div>
          <div className="stat-value">{invoices.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Paid Invoices</div>
          <div className="stat-value" style={{ color: '#16a34a' }}>€{totalRevenue.toFixed(2)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Pending Payment</div>
          <div className="stat-value" style={{ color: '#f59e0b' }}>€{pendingRevenue.toFixed(2)}</div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">All Invoices</h2>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={18} /> New Invoice
          </button>
        </div>

        {invoices.length === 0 ? (
          <div className="empty-state">
            <FileText size={48} style={{ color: '#9ca3af', marginBottom: '1rem' }} />
            <div>No invoices yet. Click "New Invoice" to get started.</div>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Client</th>
                <th>Date</th>
                <th>Due Date</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice.id}>
                  <td style={{ fontWeight: 600 }}>{invoice.invoice_number}</td>
                  <td>{invoice.client_name || 'N/A'}</td>
                  <td>{invoice.date}</td>
                  <td>{invoice.due_date}</td>
                  <td style={{ fontWeight: 600, color: '#16a34a' }}>€{invoice.total?.toFixed(2)}</td>
                  <td>{getStatusBadge(invoice.status)}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className="btn btn-secondary" onClick={() => handleEdit(invoice)} style={{ padding: '0.25rem 0.5rem' }}>
                        <Edit size={16} />
                      </button>
                      <button className="btn btn-danger" onClick={() => handleDelete(invoice.id!)} style={{ padding: '0.25rem 0.5rem' }}>
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
              <h2 className="modal-title">{editingInvoice ? 'Edit Invoice' : 'New Invoice'}</h2>
              <button onClick={closeModal} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Invoice Number *</label>
                  <input
                    type="text"
                    name="invoice_number"
                    value={formData.invoice_number}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Client</label>
                  <select name="client_id" value={formData.client_id || ''} onChange={handleInputChange}>
                    <option value="">Select Client</option>
                    {clients.map(client => (
                      <option key={client.id} value={client.id}>{client.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Invoice Date *</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Due Date *</label>
                  <input
                    type="date"
                    name="due_date"
                    value={formData.due_date}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Type</label>
                  <select name="type" value={formData.type} onChange={handleInputChange}>
                    <option value="domestic">Domestic</option>
                    <option value="foreign">Foreign</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Subtotal (€) *</label>
                  <input
                    type="number"
                    name="subtotal"
                    value={formData.subtotal}
                    onChange={handleInputChange}
                    step="0.01"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Tax Rate (%)</label>
                  <input
                    type="number"
                    name="tax_rate"
                    value={formData.tax_rate}
                    onChange={handleInputChange}
                    step="0.01"
                  />
                </div>
                <div className="form-group">
                  <label>Tax Amount (€)</label>
                  <input
                    type="number"
                    value={formData.tax_amount}
                    readOnly
                    style={{ backgroundColor: '#f3f4f6' }}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Total (€)</label>
                  <input
                    type="number"
                    value={formData.total}
                    readOnly
                    style={{ backgroundColor: '#f3f4f6', fontWeight: 600, fontSize: '1.125rem' }}
                  />
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select name="status" value={formData.status} onChange={handleInputChange}>
                    <option value="draft">Draft</option>
                    <option value="sent">Sent</option>
                    <option value="paid">Paid</option>
                    <option value="overdue">Overdue</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Additional notes or payment terms..."
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingInvoice ? 'Update Invoice' : 'Create Invoice'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Invoices;
