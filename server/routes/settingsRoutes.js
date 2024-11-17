import express from 'express';
import { adminAuth } from '../middleware/auth.js';
import Settings from '../models/Settings.js';

const router = express.Router();

// Get store settings
router.get('/', async (req, res) => {
  try {
    const settings = await Settings.findOne();
    if (!settings) {
      return res.status(404).json({ message: 'Settings not found' });
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update store settings (admin only)
router.put('/', adminAuth, async (req, res) => {
  try {
    const settings = await Settings.findOne();
    if (!settings) {
      return res.status(404).json({ message: 'Settings not found' });
    }

    // Update settings
    Object.assign(settings, req.body);
    await settings.save();

    res.json(settings);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;