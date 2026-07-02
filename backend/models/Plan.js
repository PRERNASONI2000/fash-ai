const mongoose = require('mongoose');

const PlanSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['plan', 'addon'], required: true },
  credits: { type: Number, default: 0 },
  price: { type: Number, default: 0 },
  recurring: { type: Boolean, default: false },
  billingCycle: { type: String },
  features: [{ type: String }],
  unlocksTemplates: { type: Boolean, default: false },
  maxSubUsers: { type: Number },
  subUserCredits: { type: Number },
});

module.exports = mongoose.model('Plan', PlanSchema, 'plans');
