import express from 'express';
import { dbRun, dbGet, dbAll } from '../database';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const assets = await dbAll('SELECT * FROM assets ORDER BY entry_date DESC');
    res.json(assets);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch assets' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const asset = await dbGet('SELECT * FROM assets WHERE id = ?', [req.params.id]);
    if (!asset) {
      return res.status(404).json({ error: 'Asset not found' });
    }
    res.json(asset);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch asset' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { entry_date, main_category, subcategory, amount, payment_date, paid, category } = req.body;
    const result = await dbRun(
      'INSERT INTO assets (entry_date, main_category, subcategory, amount, payment_date, paid, category) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [entry_date, main_category, subcategory, amount, payment_date, paid ? 1 : 0, category]
    );
    res.status(201).json({ id: result.lastID, ...req.body });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create asset' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { entry_date, main_category, subcategory, amount, payment_date, paid, category } = req.body;
    await dbRun(
      'UPDATE assets SET entry_date = ?, main_category = ?, subcategory = ?, amount = ?, payment_date = ?, paid = ?, category = ? WHERE id = ?',
      [entry_date, main_category, subcategory, amount, payment_date, paid ? 1 : 0, category, req.params.id]
    );
    res.json({ id: req.params.id, ...req.body });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update asset' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await dbRun('DELETE FROM assets WHERE id = ?', [req.params.id]);
    res.json({ message: 'Asset deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete asset' });
  }
});

export default router;
