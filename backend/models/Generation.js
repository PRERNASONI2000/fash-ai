// backend/models/Generation.js

const mongoose = require('mongoose');

const generationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Guest users ke liye optional
  },
  model_name: {
    type: String,
    required: true,
    enum: [
      'tryon-max',
      'tryon-v1.6',
      'product-to-model',
      'face-to-model',
      'model-create',
      'model-swap',
      'edit',
      'reframe',
      'image-to-video',
      'background-remove'
    ]
  },
  inputs: {
    // type: Map,
    // of: String,
    
    type: Object, // ✅ Changed: Map of String se Object kar diya (num_images Number save karne ke liye)
    required: true
  },
  output: {
    type: [String], // Result image/video URL
    // default: null
    default: [] // ✅ Changed: String se Array of Strings kar diya (Multiple images ke liye)
  },
  status: {
    type: [String], // ✅ Changed: String se Array of Strings kar diya (Multiple images ke liye)
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending'
  },
  credits_used: {
    type: Number,
    default: 0
  },
  error_message: {
    type: String,
    default: null
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  completed_at: {
    type: Date,
    default: null
  }
});

module.exports = mongoose.model('Generation', generationSchema);