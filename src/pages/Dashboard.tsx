import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, ShoppingBag, Users, Bike } from 'lucide-react';
import {
  dailyToursApi,
  multiDayToursApi,
  customToursApi,
  rentingServicesApi,
  otherIncomeApi,
  costsApi,
  assetsApi,
  clientsApi
} from '../services/api';

interface DashboardStats {
  totalRevenue: number;
  totalCosts: number;
  netProfit: number;
  totalTours: number;
  dailyToursIncome: number;
  multiDayToursIncome: number;
  customToursIncome: number;
  rentingIncome: number;
  otherIncome: number;
  fixedCosts: number;
  variableCosts: number;
  otherCosts: number;
  totalAssets: number;
  totalClients: number;
}

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    totalCosts: 0,
    netProfit: 0,
    totalTours: 0,
    dailyToursIncome: 0,
    multiDayToursIncome: 0,
    customToursIncome: 0,
    rentingIncome: 0,
    otherIncome: 0,
    fixedCosts: 0,
    variableCosts: 0,
    otherCosts: 0,
    totalAssets: 0,
    totalClients: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch all data in parallel
      const [
        dailyTours,
        multiDayTours,
        customTours,
        rentingServices,
        otherIncome,
        costs,
        assets,
        clients
      ] = await Promise.all([
        dailyToursApi.getAll(),
        multiDayToursApi.getAll(),
        customToursApi.getAll(),
        rentingServicesApi.getAll(),
        otherIncomeApi.getAll(),
        costsApi.getAll(),
        assetsApi.getAll(),
        clientsApi.getAll()
      ]);

      // Calculate income from each source
      const dailyToursIncome = dailyTours.data.reduce((sum: number, tour: any) =>
        sum + (tour.total_income || 0), 0);

      const multiDayToursIncome = multiDayTours.data.reduce((sum: number, tour: any) =>
        sum + (tour.total_income || 0), 0);

      const customToursIncome = customTours.data.reduce((sum: number, tour: any) =>
        sum + (tour.total_income || 0), 0);

      const rentingIncome = rentingServices.data.reduce((sum: number, service: any) =>
        sum + (service.total_income || 0), 0);

      const otherIncomeTotal = otherIncome.data.reduce((sum: number, income: any) =>
        sum + (income.income || 0), 0);

      // Calculate costs from tours
      const dailyToursCosts = dailyTours.data.reduce((sum: number, tour: any) =>
        sum + (tour.total_cost || 0), 0);

      const multiDayToursCosts = multiDayTours.data.reduce((sum: number, tour: any) =>
        sum + (tour.total_cost || 0), 0);

      const customToursCosts = customTours.data.reduce((sum: number, tour: any) =>
        sum + (tour.total_cost || 0), 0);

      const rentingCosts = rentingServices.data.reduce((sum: number, service: any) =>
        sum + (service.total_cost || 0), 0);

      // Calculate costs by category
      const fixedCosts = costs.data
        .filter((c: any) => c.main_category === 'Fixed')
        .reduce((sum: number, cost: any) => sum + (cost.amount || 0), 0);

      const variableCosts = costs.data
        .filter((c: any) => c.main_category === 'Variable')
        .reduce((sum: number, cost: any) => sum + (cost.amount || 0), 0);

      const otherCosts = costs.data
        .filter((c: any) => c.main_category === 'Other')
        .reduce((sum: number, cost: any) => sum + (cost.amount || 0), 0);

      const totalAssets = assets.data.reduce((sum: number, asset: any) =>
        sum + (asset.amount || 0), 0);

      // Calculate totals
      const totalRevenue = dailyToursIncome + multiDayToursIncome + customToursIncome +
                          rentingIncome + otherIncomeTotal;

      const totalCosts = dailyToursCosts + multiDayToursCosts + customToursCosts +
                        rentingCosts + fixedCosts + variableCosts + otherCosts;

      const netProfit = totalRevenue - totalCosts;

      const totalTours = dailyTours.data.length + multiDayTours.data.length +
                        customTours.data.length + rentingServices.data.length;

      setStats({
        totalRevenue,
        totalCosts,
        netProfit,
        totalTours,
        dailyToursIncome,
        multiDayToursIncome,
        customToursIncome,
        rentingIncome,
        otherIncome: otherIncomeTotal,
        fixedCosts,
        variableCosts,
        otherCosts,
        totalAssets,
        totalClients: clients.data.length,
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div>
        <div className="page-header">
          <h1>Dashboard</h1>
          <p>Welcome to SAF Tours Management System</p>
        </div>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div>Loading dashboard data...</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Welcome to SAF Tours Management System</p>
      </div>

      {/* Main Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div className="stat-label">Total Revenue</div>
              <div className="stat-value" style={{ color: '#16a34a' }}>
                €{stats.totalRevenue.toFixed(2)}
              </div>
            </div>
            <DollarSign size={32} style={{ color: '#16a34a', opacity: 0.2 }} />
          </div>
        </div>

        <div className="stat-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div className="stat-label">Total Costs</div>
              <div className="stat-value" style={{ color: '#dc2626' }}>
                €{stats.totalCosts.toFixed(2)}
              </div>
            </div>
            <ShoppingBag size={32} style={{ color: '#dc2626', opacity: 0.2 }} />
          </div>
        </div>

        <div className="stat-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div className="stat-label">Net Profit</div>
              <div className="stat-value" style={{ color: stats.netProfit >= 0 ? '#16a34a' : '#dc2626' }}>
                €{stats.netProfit.toFixed(2)}
              </div>
            </div>
            {stats.netProfit >= 0 ? (
              <TrendingUp size={32} style={{ color: '#16a34a', opacity: 0.2 }} />
            ) : (
              <TrendingDown size={32} style={{ color: '#dc2626', opacity: 0.2 }} />
            )}
          </div>
        </div>

        <div className="stat-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div className="stat-label">Total Tours/Services</div>
              <div className="stat-value">{stats.totalTours}</div>
            </div>
            <Bike size={32} style={{ color: '#3b82f6', opacity: 0.2 }} />
          </div>
        </div>
      </div>

      {/* Income Breakdown */}
      <div className="card" style={{ marginTop: '2rem' }}>
        <div className="card-header">
          <h2 className="card-title">Income Breakdown</h2>
        </div>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">Daily Tours</div>
            <div className="stat-value" style={{ fontSize: '1.5rem', color: '#16a34a' }}>
              €{stats.dailyToursIncome.toFixed(2)}
            </div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>
              {stats.totalRevenue > 0 ? ((stats.dailyToursIncome / stats.totalRevenue) * 100).toFixed(1) : 0}% of total
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-label">Multi-day Tours</div>
            <div className="stat-value" style={{ fontSize: '1.5rem', color: '#16a34a' }}>
              €{stats.multiDayToursIncome.toFixed(2)}
            </div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>
              {stats.totalRevenue > 0 ? ((stats.multiDayToursIncome / stats.totalRevenue) * 100).toFixed(1) : 0}% of total
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-label">Custom Tours</div>
            <div className="stat-value" style={{ fontSize: '1.5rem', color: '#16a34a' }}>
              €{stats.customToursIncome.toFixed(2)}
            </div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>
              {stats.totalRevenue > 0 ? ((stats.customToursIncome / stats.totalRevenue) * 100).toFixed(1) : 0}% of total
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-label">Renting Services</div>
            <div className="stat-value" style={{ fontSize: '1.5rem', color: '#16a34a' }}>
              €{stats.rentingIncome.toFixed(2)}
            </div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>
              {stats.totalRevenue > 0 ? ((stats.rentingIncome / stats.totalRevenue) * 100).toFixed(1) : 0}% of total
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-label">Other Income</div>
            <div className="stat-value" style={{ fontSize: '1.5rem', color: '#16a34a' }}>
              €{stats.otherIncome.toFixed(2)}
            </div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>
              {stats.totalRevenue > 0 ? ((stats.otherIncome / stats.totalRevenue) * 100).toFixed(1) : 0}% of total
            </div>
          </div>
        </div>
      </div>

      {/* Cost Breakdown */}
      <div className="card" style={{ marginTop: '2rem' }}>
        <div className="card-header">
          <h2 className="card-title">Cost Breakdown</h2>
        </div>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">Fixed Costs</div>
            <div className="stat-value" style={{ fontSize: '1.5rem', color: '#dc2626' }}>
              €{stats.fixedCosts.toFixed(2)}
            </div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>
              {stats.totalCosts > 0 ? ((stats.fixedCosts / stats.totalCosts) * 100).toFixed(1) : 0}% of total
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-label">Variable Costs</div>
            <div className="stat-value" style={{ fontSize: '1.5rem', color: '#dc2626' }}>
              €{stats.variableCosts.toFixed(2)}
            </div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>
              {stats.totalCosts > 0 ? ((stats.variableCosts / stats.totalCosts) * 100).toFixed(1) : 0}% of total
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-label">Other Costs</div>
            <div className="stat-value" style={{ fontSize: '1.5rem', color: '#dc2626' }}>
              €{stats.otherCosts.toFixed(2)}
            </div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>
              {stats.totalCosts > 0 ? ((stats.otherCosts / stats.totalCosts) * 100).toFixed(1) : 0}% of total
            </div>
          </div>
        </div>
      </div>

      {/* Other Stats */}
      <div className="stats-grid" style={{ marginTop: '2rem' }}>
        <div className="stat-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div className="stat-label">Total Assets</div>
              <div className="stat-value" style={{ fontSize: '1.5rem' }}>
                €{stats.totalAssets.toFixed(2)}
              </div>
            </div>
            <ShoppingBag size={28} style={{ color: '#3b82f6', opacity: 0.2 }} />
          </div>
        </div>

        <div className="stat-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div className="stat-label">Total Clients</div>
              <div className="stat-value" style={{ fontSize: '1.5rem' }}>{stats.totalClients}</div>
            </div>
            <Users size={28} style={{ color: '#3b82f6', opacity: 0.2 }} />
          </div>
        </div>

        <div className="stat-card">
          <div>
            <div className="stat-label">Profit Margin</div>
            <div className="stat-value" style={{
              fontSize: '1.5rem',
              color: stats.totalRevenue > 0 && (stats.netProfit / stats.totalRevenue) * 100 >= 0 ? '#16a34a' : '#dc2626'
            }}>
              {stats.totalRevenue > 0 ? ((stats.netProfit / stats.totalRevenue) * 100).toFixed(1) : 0}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
