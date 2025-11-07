import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  DollarSign,
  Receipt,
  BarChart3,
  Package,
  Users,
  FileText,
  Settings as SettingsIcon,
  ChevronDown,
  ChevronRight,
  Bike
} from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
  const location = useLocation();
  const [incomeOpen, setIncomeOpen] = useState(true);
  const [costsOpen, setCostsOpen] = useState(false);
  const [reportsOpen, setReportsOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <Bike size={32} className="sidebar-logo" />
        <h1 className="sidebar-title">SAF Tours</h1>
      </div>

      <nav className="sidebar-nav">
        <Link to="/dashboard" className={`nav-item ${isActive('/dashboard') ? 'active' : ''}`}>
          <Home size={20} />
          <span>Dashboard</span>
        </Link>

        <div className="nav-section">
          <button className="nav-section-header" onClick={() => setIncomeOpen(!incomeOpen)}>
            <div className="nav-section-title">
              <DollarSign size={20} />
              <span>Income</span>
            </div>
            {incomeOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
          </button>
          {incomeOpen && (
            <div className="nav-section-items">
              <Link
                to="/income/daily-tours"
                className={`nav-subitem ${isActive('/income/daily-tours') ? 'active' : ''}`}
              >
                Daily Tours
              </Link>
              <Link
                to="/income/multi-day-tours"
                className={`nav-subitem ${isActive('/income/multi-day-tours') ? 'active' : ''}`}
              >
                Multi-day Tours
              </Link>
              <Link
                to="/income/renting-services"
                className={`nav-subitem ${isActive('/income/renting-services') ? 'active' : ''}`}
              >
                Renting Services
              </Link>
              <Link
                to="/income/custom-tours"
                className={`nav-subitem ${isActive('/income/custom-tours') ? 'active' : ''}`}
              >
                Custom Made Tours
              </Link>
              <Link
                to="/income/other"
                className={`nav-subitem ${isActive('/income/other') ? 'active' : ''}`}
              >
                Other Income
              </Link>
            </div>
          )}
        </div>

        <div className="nav-section">
          <button className="nav-section-header" onClick={() => setCostsOpen(!costsOpen)}>
            <div className="nav-section-title">
              <Receipt size={20} />
              <span>Costs</span>
            </div>
            {costsOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
          </button>
          {costsOpen && (
            <div className="nav-section-items">
              <Link to="/costs" className={`nav-subitem ${isActive('/costs') ? 'active' : ''}`}>
                All Expenses
              </Link>
            </div>
          )}
        </div>

        <div className="nav-section">
          <button className="nav-section-header" onClick={() => setReportsOpen(!reportsOpen)}>
            <div className="nav-section-title">
              <BarChart3 size={20} />
              <span>Reports</span>
            </div>
            {reportsOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
          </button>
          {reportsOpen && (
            <div className="nav-section-items">
              <Link to="/reports" className={`nav-subitem ${isActive('/reports') ? 'active' : ''}`}>
                All Reports
              </Link>
            </div>
          )}
        </div>

        <Link to="/assets" className={`nav-item ${isActive('/assets') ? 'active' : ''}`}>
          <Package size={20} />
          <span>Assets</span>
        </Link>

        <Link to="/clients" className={`nav-item ${isActive('/clients') ? 'active' : ''}`}>
          <Users size={20} />
          <span>Clients</span>
        </Link>

        <Link to="/invoices" className={`nav-item ${isActive('/invoices') ? 'active' : ''}`}>
          <FileText size={20} />
          <span>Invoices</span>
        </Link>

        <Link to="/settings" className={`nav-item ${isActive('/settings') ? 'active' : ''}`}>
          <SettingsIcon size={20} />
          <span>Settings</span>
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;
