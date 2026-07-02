// backend/routes/fashn.js
const express = require('express');
const router = express.Router();
const axios = require('axios');
const Generation = require('../models/Generation'); 

// ⚠️ CHECK: Agar tum Firebase use kar rahe ho, toh ye line badalni hogi:
// const auth = require('../middleware/auth'); // Ye LOCAL JWT ke liye hai
const auth = require('../middleware/auth');
const deductCredits = require('../middleware/checkCredits');

const FASHN_API_KEY = process.env.FASHN_API_KEY;
const FASHN_BASE_URL = 'https://api.fashn.ai/v1';

// ✅ LATEST RESULT ROUTE (GET)
router.get('/latest', auth, async (req, res) => {
  try {
    // ✅ FIX 1: user_id ko userId kar diya
    // ✅ FIX 2: req.user._id use kiya
    const latest = await Generation.findOne({ status: 'completed', userId: req.user._id }).sort({ created_at: -1 });
    
    if (!latest) {
      return res.json({ success: true, output: [], model_name: null });
    }
    
    return res.json({ 
      success: true, 
      output: latest.output, 
      model_name: latest.model_name 
    });
  } catch (error) {
    console.error('Latest Error:', error.message);
    return res.status(500).json({ error: true, message: "Failed to fetch latest result" });
  }
});

// ✅ CREDITS ROUTE (GET)
router.get('/credits', async (req, res) => {
  try {
    const response = await axios.get(`${FASHN_BASE_URL}/credits`, {
      headers: { 'Authorization': `Bearer ${FASHN_API_KEY}` }
    });
    return res.json(response.data);
  } catch (error) {
    console.error('Credits Error:', error.response?.data || error.message);
    return res.status(500).json({ error: true, message: "Failed to fetch credits" });
  }
});

// History route
router.get('/history', auth, async (req, res) => {
  try {
    // ✅ FIX: user_id -> userId
    const history = await Generation.find({ status: 'completed', userId: req.user._id }).sort({ created_at: -1 });
    return res.json({ success: true, history });
  } catch (error) {
    console.error('History Error:', error.message);
    return res.status(500).json({ error: true, message: "Failed to fetch history" });
  }
});


// ✅ GENERATION ROUTE (POST)
router.post('/:model_name', auth, deductCredits, async (req, res) => {
  const { model_name } = req.params;
  const inputs = req.body;

  try {
    const runResponse = await axios.post(`${FASHN_BASE_URL}/run`, {
      model_name: model_name,
      inputs: inputs
    }, {
      headers: { 'Authorization': `Bearer ${FASHN_API_KEY}` }
    });

    const predictionId = runResponse.data.id;
    if (!predictionId) return res.status(400).json({ error: "Prediction ID not received" });

    let status = 'starting';
    let outputUrls = [];
    let creditsUsed = 0;

    while (status === 'starting' || status === 'in_queue' || status === 'processing') {
      await new Promise(resolve => setTimeout(resolve, 2000)); 

      const statusResponse = await axios.get(`${FASHN_BASE_URL}/status/${predictionId}`, {
        headers: { 'Authorization': `Bearer ${FASHN_API_KEY}` }
      });

      status = statusResponse.data.status;

      if (status === 'completed') {
        outputUrls = statusResponse.data.output || []; 
        const apiCredits = statusResponse.headers['x-fashn-credits-used'];
        creditsUsed = apiCredits ? parseInt(apiCredits) : 0; 
      } else if (status === 'failed') {
        return res.status(400).json({ error: statusResponse.data.error || 'Generation failed' });
      }
    }

    // ✅ FIX: user_id -> userId
    await Generation.create({
      userId: req.user._id, 
      model_name,
      inputs: inputs,
      output: outputUrls,
      status: 'completed',
      credits_used: req.creditCost,
      completed_at: Date.now()
    });

    return res.json({
      success: true,
      output: outputUrls,
      credits_used: req.creditCost,
      credits_remaining: req.user.credits,
    });

  } catch (error) {
    console.error('Fashn API Error:', error.response?.data || error.message);
    return res.status(500).json({ error: true, message: "Internal server error" });
  }
});

module.exports = router;