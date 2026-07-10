//server.js
require('dotenv').config()
const { Fashn } = require('fashn');
// Initialize Fashn
const fashnClient = new Fashn({ apiKey: process.env.FASHN_API_KEY });
const mongoose = require('mongoose');

//bonuse connnection uses
const connectDB = require('./db');
const bonusRoutes = require('./routes/bonuses');
//trainings connection uses
const trainingRoutes = require('./routes/trainings');
const fashnRoutes = require('./routes/fashn');

const express = require('express')
const cors = require('cors')
const axios = require('axios')

const app = express()
const PORT = Number(process.env.PORT) || 5000


//everthing should add after this (connections)
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://your-frontend-domain.vercel.app'
  ],
  credentials: true
}));
app.use('/api/payments/webhook', express.raw({ type: 'application/json' }))
app.use(express.json({ limit: '50mb' }))
connectDB();
app.use('/api/bonuses', bonusRoutes)
app.use('/api/trainings', trainingRoutes)
app.use('/api/auth', require('./routes/auth'))
app.use('/api/plans', require('./routes/plans'))
app.use('/api/payments', require('./routes/payments'))
app.use('/api/fashn', require('./routes/fashn')) // Fashn related routes (try-on, product-to-model, etc.)


function kieHeaders(extra = {}) {
  const headers = {
    'Authorization': `Bearer ${process.env.FASHN_API_KEY}`,
    'Content-Type': 'application/json',
    ...extra,
  }
  return headers
}

function sendAxiosError(res, err) {
  if (axios.isAxiosError(err)) {
    if (err.response) {
      return res.status(err.response.status).json({
        error: true,
        message: err.message,
        upstream: err.response.data,
      })
    }
    if (err.request) {
      return res.status(502).json({
        error: true,
        message: 'No response from Kie AI API',
        details: err.message,
      })
    }
  }
  console.error(err)
  return res.status(500).json({
    error: true,
    message: err?.message || 'Internal server error',
  })
}

app.post('/api/fashn-tryon', async (req, res) => {
  const { modelImage, garmentImage } = req.body;

  if (!modelImage || !garmentImage) {
    return res.status(400).json({ error: true, message: 'Both modelImage and garmentImage are required' });
  }

  try {
    const response = await fashnClient.predictions.subscribe({
      model_name: "tryon-v1.6",
      inputs: {
        model_image: modelImage,
        garment_image: garmentImage,
      },
    });

    if (response.status !== "completed") {
      return res.status(400).json({ error: true, message: response.error?.message || "Generation failed" });
    }

    return res.json({ output: response.output?.at(0) });
  } catch (error) {
    console.error("Fashn API Error:", error);
    return res.status(500).json({ error: true, message: "Internal server error during Fashn generation" });
  }
});




app.use((req, res) => {
  res.status(404).json({ error: true, message: 'Not found' })
})

app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`)
})
