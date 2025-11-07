import express from 'express';
import { dbRun, dbGet, dbAll } from '../database';

const router = express.Router();

const calculateTotals = (data: any) => {
  const numPax = data.num_pax || 0;
  const pricePerPax = data.price_per_pax || 0;
  const income = data.income || numPax * pricePerPax;
  const otherIncome = data.other_income || 0;
  const commissionFeePercent = data.commission_fee_percent || 0;
  const commissionAmount = income * (commissionFeePercent / 100);
  const totalIncome = income + otherIncome - commissionAmount;

  const guide1Cost = data.guide1_cost || 0;
  const guide2Cost = data.guide2_cost || 0;
  const guide3Cost = data.guide3_cost || 0;
  const guide4Cost = data.guide4_cost || 0;
  const totalGuideCost = guide1Cost + guide2Cost + guide3Cost + guide4Cost;

  const fbTicketsCost = data.fb_tickets_cost || 0;
  const transportationCost = data.transportation_cost || 0;
  const otherCost = data.other_cost || 0;
  const totalCost = totalGuideCost + fbTicketsCost + transportationCost + otherCost;

  const totalProfit = totalIncome - totalCost;

  return {
    ...data,
    income,
    total_income: totalIncome,
    total_guide_cost: totalGuideCost,
    total_cost: totalCost,
    total_profit: totalProfit
  };
};

router.get('/', async (req, res) => {
  try {
    const tours = await dbAll(`
      SELECT mdt.*, c.name as client_name
      FROM multi_day_tours mdt
      LEFT JOIN clients c ON mdt.client_id = c.id
      ORDER BY mdt.date DESC
    `);
    res.json(tours);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch multi-day tours' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const tour = await dbGet(`
      SELECT mdt.*, c.name as client_name
      FROM multi_day_tours mdt
      LEFT JOIN clients c ON mdt.client_id = c.id
      WHERE mdt.id = ?
    `, [req.params.id]);
    if (!tour) {
      return res.status(404).json({ error: 'Multi-day tour not found' });
    }
    res.json(tour);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch multi-day tour' });
  }
});

router.post('/', async (req, res) => {
  try {
    const data = calculateTotals(req.body);
    const result = await dbRun(
      `INSERT INTO multi_day_tours (
        date, product_category, product_subcategory, num_pax, price_per_pax, income,
        other_income, commission_fee_percent, total_income,
        guide1_name, guide1_cost, guide2_name, guide2_cost,
        guide3_name, guide3_cost, guide4_name, guide4_cost, total_guide_cost,
        fb_tickets_cost, transportation_cost, other_cost, total_cost, total_profit,
        income_paid, income_paid_date, income_paid_category,
        cost_paid, cost_paid_category, booking_platform, client_id, comments
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.date, data.product_category, data.product_subcategory,
        data.num_pax, data.price_per_pax, data.income, data.other_income,
        data.commission_fee_percent, data.total_income,
        data.guide1_name, data.guide1_cost, data.guide2_name, data.guide2_cost,
        data.guide3_name, data.guide3_cost, data.guide4_name, data.guide4_cost,
        data.total_guide_cost, data.fb_tickets_cost, data.transportation_cost,
        data.other_cost, data.total_cost, data.total_profit,
        data.income_paid ? 1 : 0, data.income_paid_date, data.income_paid_category,
        data.cost_paid ? 1 : 0, data.cost_paid_category, data.booking_platform,
        data.client_id, data.comments
      ]
    );
    res.status(201).json({ id: result.lastID, ...data });
  } catch (error) {
    console.error('Error creating multi-day tour:', error);
    res.status(500).json({ error: 'Failed to create multi-day tour' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const data = calculateTotals(req.body);
    await dbRun(
      `UPDATE multi_day_tours SET
        date = ?, product_category = ?, product_subcategory = ?,
        num_pax = ?, price_per_pax = ?, income = ?, other_income = ?,
        commission_fee_percent = ?, total_income = ?,
        guide1_name = ?, guide1_cost = ?, guide2_name = ?, guide2_cost = ?,
        guide3_name = ?, guide3_cost = ?, guide4_name = ?, guide4_cost = ?,
        total_guide_cost = ?, fb_tickets_cost = ?, transportation_cost = ?,
        other_cost = ?, total_cost = ?, total_profit = ?,
        income_paid = ?, income_paid_date = ?, income_paid_category = ?,
        cost_paid = ?, cost_paid_category = ?, booking_platform = ?,
        client_id = ?, comments = ?
      WHERE id = ?`,
      [
        data.date, data.product_category, data.product_subcategory,
        data.num_pax, data.price_per_pax, data.income, data.other_income,
        data.commission_fee_percent, data.total_income,
        data.guide1_name, data.guide1_cost, data.guide2_name, data.guide2_cost,
        data.guide3_name, data.guide3_cost, data.guide4_name, data.guide4_cost,
        data.total_guide_cost, data.fb_tickets_cost, data.transportation_cost,
        data.other_cost, data.total_cost, data.total_profit,
        data.income_paid ? 1 : 0, data.income_paid_date, data.income_paid_category,
        data.cost_paid ? 1 : 0, data.cost_paid_category, data.booking_platform,
        data.client_id, data.comments, req.params.id
      ]
    );
    res.json({ id: req.params.id, ...data });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update multi-day tour' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await dbRun('DELETE FROM multi_day_tours WHERE id = ?', [req.params.id]);
    res.json({ message: 'Multi-day tour deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete multi-day tour' });
  }
});

export default router;
