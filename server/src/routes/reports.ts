import express from 'express';
import { dbAll } from '../database';

const router = express.Router();

// Cash Flow Report
router.get('/cash-flow', async (req, res) => {
  try {
    const { start_date, end_date } = req.query;

    const income = await dbAll(`
      SELECT
        'Daily Tours' as source,
        SUM(total_income) as total_income,
        SUM(total_cost) as total_cost,
        SUM(total_profit) as total_profit
      FROM daily_tours
      WHERE date BETWEEN ? AND ?
      UNION ALL
      SELECT
        'Multi-day Tours' as source,
        SUM(total_income) as total_income,
        SUM(total_cost) as total_cost,
        SUM(total_profit) as total_profit
      FROM multi_day_tours
      WHERE date BETWEEN ? AND ?
      UNION ALL
      SELECT
        'Renting Services' as source,
        SUM(total_income) as total_income,
        SUM(total_cost) as total_cost,
        SUM(total_profit) as total_profit
      FROM renting_services
      WHERE date BETWEEN ? AND ?
      UNION ALL
      SELECT
        'Custom Tours' as source,
        SUM(total_income) as total_income,
        SUM(total_cost) as total_cost,
        SUM(total_profit) as total_profit
      FROM custom_tours
      WHERE date BETWEEN ? AND ?
      UNION ALL
      SELECT
        'Other Income' as source,
        SUM(income) as total_income,
        0 as total_cost,
        SUM(income) as total_profit
      FROM other_income
      WHERE date BETWEEN ? AND ?
    `, [start_date, end_date, start_date, end_date, start_date, end_date, start_date, end_date, start_date, end_date]);

    const costs = await dbAll(`
      SELECT
        main_category,
        SUM(amount) as total_amount
      FROM costs
      WHERE entry_date BETWEEN ? AND ?
      GROUP BY main_category
    `, [start_date, end_date]);

    res.json({ income, costs });
  } catch (error) {
    console.error('Error generating cash flow report:', error);
    res.status(500).json({ error: 'Failed to generate cash flow report' });
  }
});

// P&L Report
router.get('/profit-loss', async (req, res) => {
  try {
    const { start_date, end_date } = req.query;

    const totalIncome = await dbAll(`
      SELECT
        SUM(total_income) as amount
      FROM (
        SELECT total_income FROM daily_tours WHERE date BETWEEN ? AND ?
        UNION ALL
        SELECT total_income FROM multi_day_tours WHERE date BETWEEN ? AND ?
        UNION ALL
        SELECT total_income FROM renting_services WHERE date BETWEEN ? AND ?
        UNION ALL
        SELECT total_income FROM custom_tours WHERE date BETWEEN ? AND ?
        UNION ALL
        SELECT income as total_income FROM other_income WHERE date BETWEEN ? AND ?
      )
    `, [start_date, end_date, start_date, end_date, start_date, end_date, start_date, end_date, start_date, end_date]);

    const directCosts = await dbAll(`
      SELECT
        SUM(total_cost) as amount
      FROM (
        SELECT total_cost FROM daily_tours WHERE date BETWEEN ? AND ?
        UNION ALL
        SELECT total_cost FROM multi_day_tours WHERE date BETWEEN ? AND ?
        UNION ALL
        SELECT total_cost FROM renting_services WHERE date BETWEEN ? AND ?
        UNION ALL
        SELECT total_cost FROM custom_tours WHERE date BETWEEN ? AND ?
      )
    `, [start_date, end_date, start_date, end_date, start_date, end_date, start_date, end_date]);

    const fixedCosts = await dbAll(`
      SELECT SUM(amount) as amount
      FROM costs
      WHERE main_category = 'Fixed' AND entry_date BETWEEN ? AND ?
    `, [start_date, end_date]);

    const variableCosts = await dbAll(`
      SELECT SUM(amount) as amount
      FROM costs
      WHERE main_category = 'Variable' AND entry_date BETWEEN ? AND ?
    `, [start_date, end_date]);

    const otherCosts = await dbAll(`
      SELECT SUM(amount) as amount
      FROM costs
      WHERE main_category = 'Other' AND entry_date BETWEEN ? AND ?
    `, [start_date, end_date]);

    const income = totalIncome[0]?.amount || 0;
    const direct = directCosts[0]?.amount || 0;
    const fixed = fixedCosts[0]?.amount || 0;
    const variable = variableCosts[0]?.amount || 0;
    const other = otherCosts[0]?.amount || 0;

    res.json({
      revenue: income,
      direct_costs: direct,
      gross_profit: income - direct,
      fixed_costs: fixed,
      variable_costs: variable,
      other_costs: other,
      total_operating_costs: fixed + variable + other,
      net_profit: income - direct - fixed - variable - other
    });
  } catch (error) {
    console.error('Error generating P&L report:', error);
    res.status(500).json({ error: 'Failed to generate P&L report' });
  }
});

// Tour Analysis Report
router.get('/tour-analysis', async (req, res) => {
  try {
    const { start_date, end_date } = req.query;

    const analysis = await dbAll(`
      SELECT
        product_category,
        product_subcategory,
        COUNT(*) as tour_count,
        SUM(num_pax) as total_pax,
        SUM(total_income) as total_income,
        SUM(total_cost) as total_cost,
        SUM(total_profit) as total_profit,
        AVG(total_profit) as avg_profit_per_tour
      FROM (
        SELECT * FROM daily_tours WHERE date BETWEEN ? AND ?
        UNION ALL
        SELECT * FROM multi_day_tours WHERE date BETWEEN ? AND ?
        UNION ALL
        SELECT * FROM custom_tours WHERE date BETWEEN ? AND ?
      )
      GROUP BY product_category, product_subcategory
      ORDER BY total_profit DESC
    `, [start_date, end_date, start_date, end_date, start_date, end_date]);

    res.json(analysis);
  } catch (error) {
    console.error('Error generating tour analysis:', error);
    res.status(500).json({ error: 'Failed to generate tour analysis' });
  }
});

export default router;
