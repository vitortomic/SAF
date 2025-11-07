import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import DailyTours from './pages/DailyTours';
import MultiDayTours from './pages/MultiDayTours';
import RentingServices from './pages/RentingServices';
import CustomTours from './pages/CustomTours';
import OtherIncome from './pages/OtherIncome';
import Costs from './pages/Costs';
import Assets from './pages/Assets';
import Clients from './pages/Clients';
import Invoices from './pages/Invoices';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Sidebar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/income/daily-tours" element={<DailyTours />} />
            <Route path="/income/multi-day-tours" element={<MultiDayTours />} />
            <Route path="/income/renting-services" element={<RentingServices />} />
            <Route path="/income/custom-tours" element={<CustomTours />} />
            <Route path="/income/other" element={<OtherIncome />} />
            <Route path="/costs" element={<Costs />} />
            <Route path="/assets" element={<Assets />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/invoices" element={<Invoices />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
