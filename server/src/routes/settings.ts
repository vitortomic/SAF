import express from 'express';
import { dbRun, dbGet, dbAll } from '../database';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const settings = await dbAll('SELECT * FROM settings');
    const settingsObj = settings.reduce((acc: any, setting: any) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {});
    res.json(settingsObj);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

router.get('/:key', async (req, res) => {
  try {
    const setting = await dbGet('SELECT * FROM settings WHERE key = ?', [req.params.key]);
    if (!setting) {
      return res.status(404).json({ error: 'Setting not found' });
    }
    res.json(setting);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch setting' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { key, value } = req.body;
    await dbRun(
      'INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)',
      [key, value]
    );
    res.json({ key, value });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save setting' });
  }
});

router.put('/:key', async (req, res) => {
  try {
    const { value } = req.body;
    await dbRun(
      'UPDATE settings SET value = ? WHERE key = ?',
      [value, req.params.key]
    );
    res.json({ key: req.params.key, value });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update setting' });
  }
});

export default router;
