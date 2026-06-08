//Training.js
const mongoose = require('mongoose')

const trainingSchema = new mongoose.Schema({
    title: String,
    embedCode: String,
}, { collection: 'trainings' })

module.exports = mongoose.model('Training', trainingSchema)