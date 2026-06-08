const express = require('express')
const router = express.Router()
const Training = require('../models/Training')

router.get('/', async (req, res) => {
    try {
        const trainings = await Training.find()
        res.json(trainings)
    } catch (err) {
        res.status(500).json({ error: true, message: 'Failed to fetch trainings' })
    }
})

module.exports = router