import { useState, useEffect } from 'react';
import { TrendingUp, Calendar, Users, DollarSign } from 'lucide-react';
import {
  dailyToursApi,
  multiDayToursApi,
  customToursApi,
  rentingServicesApi,
  otherIncomeApi,
  costsApi
} from '../services/api';

interface MonthlyData {
  month: string;
  income: number;
  costs: number;
  profit: number;
}

interface CategoryData {
  category: string;
  value: number;
  percentage: number;
}

const Reports = () => {
  const [loading, setLoading] = useState(true);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [incomeByCategory, setIncomeByCategory] = useState<CategoryData[]>([]);
  const [costByCategory, setCostByCategory] = useState<CategoryData[]>([]);
  const [totalStats, setTotalStats] = useState({
    totalIncome: 0,
    totalCosts: 0,
    netProfit: 0,
    totalServices: 0
  });

  useEffect(() => {
    fetchReportsData();
  }, []);

  const fetchReportsData = async () => {
    try {
      setLoading(true);

      const [
        dailyTours,
        multiDayTours,
        customTours,
        rentingServices,
        otherIncome,
        costs
      ] = await Promise.all([
        dailyToursApi.getAll(),
        multiDayToursApi.getAll(),
        customToursApi.getAll(),
        rentingServicesApi.getAll(),
        otherIncomeApi.getAll(),
        costsApi.getAll()
      ]);

      // Calculate income by category
      const dailyIncome = dailyTours.data.reduce((sum: number, t: any) => sum + (t.total_income || 0), 0);
      const multiDayIncome = multiDayTours.data.reduce((sum: number, t: any) => sum + (t.total_income || 0), 0);
      const customIncome = customTours.data.reduce((sum: number, t: any) => sum + (t.total_income || 0), 0);
      const rentingIncome = rentingServices.data.reduce((sum: number, t: any) => sum + (t.total_income || 0), 0);
      const otherIncomeTotal = otherIncome.data.reduce((sum: number, i: any) => sum + (i.income || 0), 0);

      const totalIncome = dailyIncome + multiDayIncome + customIncome + rentingIncome + otherIncomeTotal;

      const incomeCategories: CategoryData[] = [
        { category: 'Daily Tours', value: dailyIncome, percentage: totalIncome > 0 ? (dailyIncome / totalIncome) * 100 : 0 },
        { category: 'Multi-day Tours', value: multiDayIncome, percentage: totalIncome > 0 ? (multiDayIncome / totalIncome) * 100 : 0 },
        { category: 'Custom Tours', value: customIncome, percentage: totalIncome > 0 ? (customIncome / totalIncome) * 100 : 0 },
        { category: 'Rentals', value: rentingIncome, percentage: totalIncome > 0 ? (rentingIncome / totalIncome) * 100 : 0 },
        { category: 'Other Income', value: otherIncomeTotal, percentage: totalIncome > 0 ? (otherIncomeTotal / totalIncome) * 100 : 0 }
      ].filter(c => c.value > 0).sort((a, b) => b.value - a.value);

      // Calculate costs by category
      const fixedCosts = costs.data.filter((c: any) => c.main_category === 'Fixed').reduce((sum: number, c: any) => sum + (c.amount || 0), 0);
      const variableCosts = costs.data.filter((c: any) => c.main_category === 'Variable').reduce((sum: number, c: any) => sum + (c.amount || 0), 0);
      const otherCosts = costs.data.filter((c: any) => c.main_category === 'Other').reduce((sum: number, c: any) => sum + (c.amount || 0), 0);

      const dailyCosts = dailyTours.data.reduce((sum: number, t: any) => sum + (t.total_cost || 0), 0);
      const multiDayCosts = multiDayTours.data.reduce((sum: number, t: any) => sum + (t.total_cost || 0), 0);
      const customCosts = customTours.data.reduce((sum: number, t: any) => sum + (t.total_cost || 0), 0);
      const rentingCosts = rentingServices.data.reduce((sum: number, t: any) => sum + (t.total_cost || 0), 0);

      const totalCosts = fixedCosts + variableCosts + otherCosts + dailyCosts + multiDayCosts + customCosts + rentingCosts;

      const costCategories: CategoryData[] = [
        { category: 'Fixed Costs', value: fixedCosts, percentage: totalCosts > 0 ? (fixedCosts / totalCosts) * 100 : 0 },
        { category: 'Variable Costs', value: variableCosts, percentage: totalCosts > 0 ? (variableCosts / totalCosts) * 100 : 0 },
        { category: 'Tour Costs', value: dailyCosts + multiDayCosts + customCosts, percentage: totalCosts > 0 ? ((dailyCosts + multiDayCosts + customCosts) / totalCosts) * 100 : 0 },
        { category: 'Rental Costs', value: rentingCosts, percentage: totalCosts > 0 ? (rentingCosts / totalCosts) * 100 : 0 },
        { category: 'Other Costs', value: otherCosts, percentage: totalCosts > 0 ? (otherCosts / totalCosts) * 100 : 0 }
      ].filter(c => c.value > 0).sort((a, b) => b.value - a.value);

      // Calculate monthly data (simplified - using entry dates)
      const monthlyMap = new Map<string, { income: number; costs: number }>();

      [...dailyTours.data, ...multiDayTours.data, ...customTours.data].forEach((tour: any) => {
        const month = tour.date ? tour.date.substring(0, 7) : '2025-01';
        const current = monthlyMap.get(month) || { income: 0, costs: 0 };
        current.income += tour.total_income || 0;
        current.costs += tour.total_cost || 0;
        monthlyMap.set(month, current);
      });

      rentingServices.data.forEach((service: any) => {
        const month = service.date ? service.date.substring(0, 7) : '2025-01';
        const current = monthlyMap.get(month) || { income: 0, costs: 0 };
        current.income += service.total_income || 0;
        current.costs += service.total_cost || 0;
        monthlyMap.set(month, current);
      });

      otherIncome.data.forEach((income: any) => {
        const month = income.date ? income.date.substring(0, 7) : '2025-01';
        const current = monthlyMap.get(month) || { income: 0, costs: 0 };
        current.income += income.income || 0;
        monthlyMap.set(month, current);
      });

      costs.data.forEach((cost: any) => {
        const month = cost.entry_date ? cost.entry_date.substring(0, 7) : '2025-01';
        const current = monthlyMap.get(month) || { income: 0, costs: 0 };
        current.costs += cost.amount || 0;
        monthlyMap.set(month, current);
      });

      const monthlyDataArray: MonthlyData[] = Array.from(monthlyMap.entries())
        .map(([month, data]) => ({
          month,
          income: data.income,
          costs: data.costs,
          profit: data.income - data.costs
        }))
        .sort((a, b) => a.month.localeCompare(b.month));

      setMonthlyData(monthlyDataArray);
      setIncomeByCategory(incomeCategories);
      setCostByCategory(costCategories);
      setTotalStats({
        totalIncome,
        totalCosts,
        netProfit: totalIncome - totalCosts,
        totalServices: dailyTours.data.length + multiDayTours.data.length + customTours.data.length + rentingServices.data.length
      });
    } catch (error) {
      console.error('Error fetching reports data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div>
        <div className="page-header">
          <h1>Reports & Analytics</h1>
          <p>View business analytics and reports</p>
        </div>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div>Loading reports...</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h1>Reports & Analytics</h1>
        <p>View business analytics and reports</p>
      </div>

      {/* Summary Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div className="stat-label">Total Revenue</div>
              <div className="stat-value" style={{ color: '#16a34a' }}>
                €{totalStats.totalIncome.toFixed(2)}
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
                €{totalStats.totalCosts.toFixed(2)}
              </div>
            </div>
            <TrendingUp size={32} style={{ color: '#dc2626', opacity: 0.2 }} />
          </div>
        </div>

        <div className="stat-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div className="stat-label">Net Profit</div>
              <div className="stat-value" style={{ color: totalStats.netProfit >= 0 ? '#16a34a' : '#dc2626' }}>
                €{totalStats.netProfit.toFixed(2)}
              </div>
            </div>
            <TrendingUp size={32} style={{ color: totalStats.netProfit >= 0 ? '#16a34a' : '#dc2626', opacity: 0.2 }} />
          </div>
        </div>

        <div className="stat-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div className="stat-label">Total Services</div>
              <div className="stat-value">{totalStats.totalServices}</div>
            </div>
            <Users size={32} style={{ color: '#3b82f6', opacity: 0.2 }} />
          </div>
        </div>
      </div>

      {/* Income Breakdown */}
      <div className="card" style={{ marginTop: '2rem' }}>
        <div className="card-header">
          <h2 className="card-title">Income by Category</h2>
        </div>
        {incomeByCategory.length === 0 ? (
          <div className="empty-state">No income data available</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Category</th>
                <th>Amount</th>
                <th>Percentage</th>
                <th>Visual</th>
              </tr>
            </thead>
            <tbody>
              {incomeByCategory.map((item, idx) => (
                <tr key={idx}>
                  <td><span className="badge badge-success">{item.category}</span></td>
                  <td style={{ fontWeight: 600, color: '#16a34a' }}>€{item.value.toFixed(2)}</td>
                  <td>{item.percentage.toFixed(1)}%</td>
                  <td>
                    <div style={{ width: '100%', backgroundColor: '#e5e7eb', borderRadius: '4px', height: '8px' }}>
                      <div style={{
                        width: `${item.percentage}%`,
                        backgroundColor: '#16a34a',
                        height: '100%',
                        borderRadius: '4px',
                        transition: 'width 0.3s'
                      }} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Cost Breakdown */}
      <div className="card" style={{ marginTop: '2rem' }}>
        <div className="card-header">
          <h2 className="card-title">Costs by Category</h2>
        </div>
        {costByCategory.length === 0 ? (
          <div className="empty-state">No cost data available</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Category</th>
                <th>Amount</th>
                <th>Percentage</th>
                <th>Visual</th>
              </tr>
            </thead>
            <tbody>
              {costByCategory.map((item, idx) => (
                <tr key={idx}>
                  <td><span className="badge badge-danger">{item.category}</span></td>
                  <td style={{ fontWeight: 600, color: '#dc2626' }}>€{item.value.toFixed(2)}</td>
                  <td>{item.percentage.toFixed(1)}%</td>
                  <td>
                    <div style={{ width: '100%', backgroundColor: '#e5e7eb', borderRadius: '4px', height: '8px' }}>
                      <div style={{
                        width: `${item.percentage}%`,
                        backgroundColor: '#dc2626',
                        height: '100%',
                        borderRadius: '4px',
                        transition: 'width 0.3s'
                      }} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Monthly Profit & Loss */}
      <div className="card" style={{ marginTop: '2rem' }}>
        <div className="card-header">
          <h2 className="card-title">Monthly Profit & Loss</h2>
        </div>
        {monthlyData.length === 0 ? (
          <div className="empty-state">No monthly data available</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Month</th>
                <th>Income</th>
                <th>Costs</th>
                <th>Profit</th>
                <th>Margin</th>
              </tr>
            </thead>
            <tbody>
              {monthlyData.map((item, idx) => (
                <tr key={idx}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Calendar size={16} />
                      {new Date(item.month + '-01').toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                    </div>
                  </td>
                  <td style={{ fontWeight: 600, color: '#16a34a' }}>€{item.income.toFixed(2)}</td>
                  <td style={{ fontWeight: 600, color: '#dc2626' }}>€{item.costs.toFixed(2)}</td>
                  <td style={{ fontWeight: 600, color: item.profit >= 0 ? '#16a34a' : '#dc2626' }}>
                    €{item.profit.toFixed(2)}
                  </td>
                  <td>
                    <span className={item.profit >= 0 ? 'badge badge-success' : 'badge badge-danger'}>
                      {item.income > 0 ? ((item.profit / item.income) * 100).toFixed(1) : 0}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Reports;
