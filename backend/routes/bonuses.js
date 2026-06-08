const express = require('express')
const router = express.Router()
const Bonus = require('../models/Bonus')

router.get('/', async (req, res) => {
    try {
        const bonuses = await Bonus.find()
        res.json(bonuses)
    } catch (err) {
        res.status(500).json({ error: true, message: 'Failed to fetch bonuses' })
    }
})

module.exports = router