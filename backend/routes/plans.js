const express = require('express');
const Plan = require('../models/Plan');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const allPlans = await Plan.find().sort({ price: 1, credits: 1 });
    const plans = allPlans.filter((p) => p.type === 'plan');
    const addons = allPlans.filter((p) => p.type === 'addon');
    return res.json({ plans, addons });
  } catch (err) {
    console.error('Plans fetch error:', err.message);
    return res.status(500).json({ error: true, message: 'Failed to fetch plans' });
  }
});

module.exports = router;
