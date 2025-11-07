import express from 'express';
import { dbRun, dbGet, dbAll } from '../database';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const costs = await dbAll('SELECT * FROM costs ORDER BY entry_date DESC');
    res.json(costs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch costs' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const cost = await dbGet('SELECT * FROM costs WHERE id = ?', [req.params.id]);
    if (!cost) {
      return res.status(404).json({ error: 'Cost not found' });
    }
    res.json(cost);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch cost' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { entry_date, main_category, subcategory, amount, payment_date, cost_paid, cost_category, comments } = req.body;
    const result = await dbRun(
      'INSERT INTO costs (entry_date, main_category, subcategory, amount, payment_date, cost_paid, cost_category, comments) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [entry_date, main_category, subcategory, amount, payment_date, cost_paid ? 1 : 0, cost_category, comments]
    );
    res.status(201).json({ id: result.lastID, ...req.body });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create cost' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { entry_date, main_category, subcategory, amount, payment_date, cost_paid, cost_category, comments } = req.body;
    await dbRun(
      'UPDATE costs SET entry_date = ?, main_category = ?, subcategory = ?, amount = ?, payment_date = ?, cost_paid = ?, cost_category = ?, comments = ? WHERE id = ?',
      [entry_date, main_category, subcategory, amount, payment_date, cost_paid ? 1 : 0, cost_category, comments, req.params.id]
    );
    res.json({ id: req.params.id, ...req.body });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update cost' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await dbRun('DELETE FROM costs WHERE id = ?', [req.params.id]);
    res.json({ message: 'Cost deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete cost' });
  }
});

export default router;
