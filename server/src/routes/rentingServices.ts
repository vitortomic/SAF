import express from 'express';
import { dbRun, dbGet, dbAll } from '../database';

const router = express.Router();

const calculateTotals = (data: any) => {
  const numPax = data.num_pax || 0;
  const pricePerPax = data.price_per_pax || 0;
  const income = data.income || numPax * pricePerPax;
  const otherIncome = data.other_income || 0;
  const totalIncome = income + otherIncome;

  const otherCost = data.other_cost || 0;
  const totalCost = otherCost;

  const totalProfit = totalIncome - totalCost;

  return {
    ...data,
    income,
    total_income: totalIncome,
    total_cost: totalCost,
    total_profit: totalProfit
  };
};

router.get('/', async (req, res) => {
  try {
    const services = await dbAll(`
      SELECT rs.*, c.name as client_name
      FROM renting_services rs
      LEFT JOIN clients c ON rs.client_id = c.id
      ORDER BY rs.date DESC
    `);
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch renting services' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const service = await dbGet(`
      SELECT rs.*, c.name as client_name
      FROM renting_services rs
      LEFT JOIN clients c ON rs.client_id = c.id
      WHERE rs.id = ?
    `, [req.params.id]);
    if (!service) {
      return res.status(404).json({ error: 'Renting service not found' });
    }
    res.json(service);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch renting service' });
  }
});

router.post('/', async (req, res) => {
  try {
    const data = calculateTotals(req.body);
    const result = await dbRun(
      `INSERT INTO renting_services (
        date, product_category, product_subcategory, num_pax, price_per_pax,
        income, other_income, total_income, other_cost, total_cost, total_profit,
        income_paid, income_paid_date, income_category, cost_paid, cost_category,
        client_id, comments
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.date, data.product_category, data.product_subcategory,
        data.num_pax, data.price_per_pax, data.income, data.other_income,
        data.total_income, data.other_cost, data.total_cost, data.total_profit,
        data.income_paid ? 1 : 0, data.income_paid_date, data.income_category,
        data.cost_paid ? 1 : 0, data.cost_category, data.client_id, data.comments
      ]
    );
    res.status(201).json({ id: result.lastID, ...data });
  } catch (error) {
    console.error('Error creating renting service:', error);
    res.status(500).json({ error: 'Failed to create renting service' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const data = calculateTotals(req.body);
    await dbRun(
      `UPDATE renting_services SET
        date = ?, product_category = ?, product_subcategory = ?,
        num_pax = ?, price_per_pax = ?, income = ?, other_income = ?,
        total_income = ?, other_cost = ?, total_cost = ?, total_profit = ?,
        income_paid = ?, income_paid_date = ?, income_category = ?,
        cost_paid = ?, cost_category = ?, client_id = ?, comments = ?
      WHERE id = ?`,
      [
        data.date, data.product_category, data.product_subcategory,
        data.num_pax, data.price_per_pax, data.income, data.other_income,
        data.total_income, data.other_cost, data.total_cost, data.total_profit,
        data.income_paid ? 1 : 0, data.income_paid_date, data.income_category,
        data.cost_paid ? 1 : 0, data.cost_category, data.client_id,
        data.comments, req.params.id
      ]
    );
    res.json({ id: req.params.id, ...data });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update renting service' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await dbRun('DELETE FROM renting_services WHERE id = ?', [req.params.id]);
    res.json({ message: 'Renting service deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete renting service' });
  }
});

export default router;
