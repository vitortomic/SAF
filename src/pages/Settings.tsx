import { useState, useEffect } from 'react';
import { Save, Building2 } from 'lucide-react';
import { settingsApi } from '../services/api';

interface SettingsData {
  company_name: string;
  email: string;
  phone: string;
  address: string;
  tax_id: string;
  website: string;
  bank_account: string;
  currency: string;
}

const Settings = () => {
  const [formData, setFormData] = useState<SettingsData>({
    company_name: '',
    email: '',
    phone: '',
    address: '',
    tax_id: '',
    website: '',
    bank_account: '',
    currency: 'EUR',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await settingsApi.get();
      if (response.data) {
        setFormData(response.data);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await settingsApi.update(formData);
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div>
        <div className="page-header">
          <h1>Settings</h1>
          <p>Configure your application settings</p>
        </div>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div>Loading settings...</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h1>Settings</h1>
        <p>Configure your application settings</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="card">
          <div className="card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Building2 size={24} />
              <h2 className="card-title">Company Information</h2>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Company Name *</label>
              <input
                type="text"
                name="company_name"
                value={formData.company_name}
                onChange={handleInputChange}
                placeholder="Enter company name"
                required
              />
            </div>
            <div className="form-group">
              <label>Tax ID / VAT Number</label>
              <input
                type="text"
                name="tax_id"
                value={formData.tax_id}
                onChange={handleInputChange}
                placeholder="Enter tax ID or VAT number"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="company@example.com"
                required
              />
            </div>
            <div className="form-group">
              <label>Phone *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+123 456 7890"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Website</label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                placeholder="https://www.example.com"
              />
            </div>
            <div className="form-group">
              <label>Currency</label>
              <select
                name="currency"
                value={formData.currency}
                onChange={handleInputChange}
              >
                <option value="EUR">EUR (€)</option>
                <option value="USD">USD ($)</option>
                <option value="GBP">GBP (£)</option>
                <option value="RSD">RSD (din)</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Address *</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              rows={3}
              placeholder="Enter company address"
              required
            />
          </div>

          <div className="form-group">
            <label>Bank Account Number</label>
            <input
              type="text"
              name="bank_account"
              value={formData.bank_account}
              onChange={handleInputChange}
              placeholder="Enter bank account number"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={saving}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <Save size={18} />
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </div>
      </form>

      <div className="card" style={{ marginTop: '2rem' }}>
        <div className="card-header">
          <h2 className="card-title">Application Information</h2>
        </div>
        <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
          <div className="stat-card">
            <div className="stat-label">Application Name</div>
            <div style={{ fontSize: '1.125rem', fontWeight: 600, marginTop: '0.5rem' }}>
              SAF Tours Management System
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Version</div>
            <div style={{ fontSize: '1.125rem', fontWeight: 600, marginTop: '0.5rem' }}>
              1.0.0
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Database</div>
            <div style={{ fontSize: '1.125rem', fontWeight: 600, marginTop: '0.5rem' }}>
              SQLite
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
