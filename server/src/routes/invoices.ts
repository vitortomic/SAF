import express from 'express';
import { dbRun, dbGet, dbAll } from '../database';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const invoices = await dbAll(`
      SELECT i.*, c.name as client_name
      FROM invoices i
      LEFT JOIN clients c ON i.client_id = c.id
      ORDER BY i.date DESC
    `);
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch invoices' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const invoice = await dbGet(`
      SELECT i.*, c.name as client_name, c.email, c.phone, c.address
      FROM invoices i
      LEFT JOIN clients c ON i.client_id = c.id
      WHERE i.id = ?
    `, [req.params.id]);
    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
    res.json(invoice);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch invoice' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { invoice_number, client_id, date, due_date, type, items, subtotal, tax_rate, tax_amount, total, status, notes } = req.body;
    const result = await dbRun(
      `INSERT INTO invoices (invoice_number, client_id, date, due_date, type, items, subtotal, tax_rate, tax_amount, total, status, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [invoice_number, client_id, date, due_date, type, JSON.stringify(items), subtotal, tax_rate, tax_amount, total, status, notes]
    );
    res.status(201).json({ id: result.lastID, ...req.body });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create invoice' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { invoice_number, client_id, date, due_date, type, items, subtotal, tax_rate, tax_amount, total, status, notes } = req.body;
    await dbRun(
      `UPDATE invoices SET invoice_number = ?, client_id = ?, date = ?, due_date = ?, type = ?, items = ?, subtotal = ?, tax_rate = ?, tax_amount = ?, total = ?, status = ?, notes = ?
       WHERE id = ?`,
      [invoice_number, client_id, date, due_date, type, JSON.stringify(items), subtotal, tax_rate, tax_amount, total, status, notes, req.params.id]
    );
    res.json({ id: req.params.id, ...req.body });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update invoice' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await dbRun('DELETE FROM invoices WHERE id = ?', [req.params.id]);
    res.json({ message: 'Invoice deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete invoice' });
  }
});

export default router;
