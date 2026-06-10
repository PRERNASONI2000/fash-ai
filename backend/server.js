//server.js
require('dotenv').config()
const mongoose = require('mongoose');

//bonuse connnection uses
const connectDB = require('./db');
const bonusRoutes = require('./routes/bonuses');
//trainings connection uses
const trainingRoutes = require('./routes/trainings');

const express = require('express')
const cors = require('cors')
const axios = require('axios')

const app = express()
const PORT = Number(process.env.PORT) || 5000

const KIE_GENERATE_URL = 'https://api.kie.ai/api/v1/veo/generate'
const KIE_RECORD_INFO_BASE = 'https://api.kie.ai/api/v1/veo/record-info'
const KIE_BASE64_UPLOAD_URL = 'https://kieai.redpandaai.co/api/file-base64-upload'

//everthing should add after this (connections)
app.use(cors())
//add below
app.use(express.json({ limit: '15mb' }))
connectDB();
app.use('/api/bonuses', bonusRoutes)
app.use('/api/trainings', trainingRoutes)
app.use('/api/auth', require('./routes/auth'))


function kieHeaders(extra = {}) {
  const headers = {
    'Authorization': `Bearer ${process.env.KIE_API_KEY}`,
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

app.post('/api/generate', async (req, res) => {
  try {
    const response = await axios.post(KIE_GENERATE_URL, req.body, {
      headers: kieHeaders(),
      validateStatus: () => true,
    })
    return res.status(response.status).json(response.data)
  } catch (err) {
    return sendAxiosError(res, err)
  }
})

app.get('/api/status/:taskId', async (req, res) => {
  const { taskId } = req.params
  if (!taskId || !String(taskId).trim()) {
    return res.status(400).json({ error: true, message: 'taskId is required' })
  }
  const url = `${KIE_RECORD_INFO_BASE}?taskId=${encodeURIComponent(taskId)}`
  try {
    const response = await axios.get(url, {
      headers: kieHeaders(),
      validateStatus: () => true,
    })
    return res.status(response.status).json(response.data)
  } catch (err) {
    return sendAxiosError(res, err)
  }
})

app.post('/api/upload-image', async (req, res) => {
  try {
    const base64Image = req.body?.base64Image
    if (!base64Image || typeof base64Image !== 'string' || !String(base64Image).trim()) {
      return res.status(400).json({ error: true, message: 'base64Image is required' })
    }

    const upstreamPayload = {
      base64Data: String(base64Image).trim(),
      uploadPath: 'images/upload',
    }

    const response = await axios.post(KIE_BASE64_UPLOAD_URL, upstreamPayload, {
      headers: {
        Authorization: 'Bearer ' + process.env.KIE_API_KEY,
        'Content-Type': 'application/json',
      },
      validateStatus: () => true,
    })

    const body = response.data
    const hostedUrl =
      body?.data?.downloadUrl ||
      body?.data?.url ||
      body?.downloadUrl ||
      body?.url

    if (response.status >= 400 || body?.success === false || (body?.code != null && body.code !== 200)) {
      return res.status(response.status >= 400 ? response.status : 502).json({
        error: true,
        message: typeof body?.msg === 'string' ? body.msg : 'Image upload failed',
        upstream: body,
      })
    }

    if (!hostedUrl || typeof hostedUrl !== 'string') {
      return res.status(502).json({
        error: true,
        message: 'Upload response did not include a hosted image URL',
        upstream: body,
      })
    }

    return res.json({ imageUrl: hostedUrl })
  } catch (err) {
    return sendAxiosError(res, err)
  }
})

app.use((req, res) => {
  res.status(404).json({ error: true, message: 'Not found' })
})

app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`)
})
