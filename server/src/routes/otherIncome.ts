import express from 'express';
import { dbRun, dbGet, dbAll } from '../database';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const income = await dbAll('SELECT * FROM other_income ORDER BY date DESC');
    res.json(income);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch other income' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const income = await dbGet('SELECT * FROM other_income WHERE id = ?', [req.params.id]);
    if (!income) {
      return res.status(404).json({ error: 'Other income not found' });
    }
    res.json(income);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch other income' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { date, description, income, payment_date, income_category } = req.body;
    const result = await dbRun(
      'INSERT INTO other_income (date, description, income, payment_date, income_category) VALUES (?, ?, ?, ?, ?)',
      [date, description, income, payment_date || date, income_category]
    );
    res.status(201).json({ id: result.lastID, ...req.body });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create other income' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { date, description, income, payment_date, income_category } = req.body;
    await dbRun(
      'UPDATE other_income SET date = ?, description = ?, income = ?, payment_date = ?, income_category = ? WHERE id = ?',
      [date, description, income, payment_date, income_category, req.params.id]
    );
    res.json({ id: req.params.id, ...req.body });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update other income' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await dbRun('DELETE FROM other_income WHERE id = ?', [req.params.id]);
    res.json({ message: 'Other income deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete other income' });
  }
});

export default router;
