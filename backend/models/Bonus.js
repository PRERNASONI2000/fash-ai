//Bonus.js
const mongoose = require('mongoose')

const bonusSchema = new mongoose.Schema({
    name: String,
    imageUrl: String,
    downloadLink: String,
}, { collection: 'bonuses' })

module.exports = mongoose.model('Bonus', bonusSchema)