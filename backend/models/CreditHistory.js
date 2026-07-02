const mongoose = require('mongoose');

const CreditHistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  planName: { type: String, required: true },
  credits: { type: Number, required: true }, // Positive for added, Negative for used
  type: { type: String, enum: ['purchase', 'usage', 'refund'], default: 'purchase' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CreditHistory', CreditHistorySchema, 'credithistories');