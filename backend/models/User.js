//User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  googleId: { type: String },
  name: { type: String, default: '' },
  profilePicture: { type: String, default: '' },
  resetPasswordToken: { type: String, default: null },
  resetPasswordExpire: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now },
  // subscription: {
  //   plan: { type: String, default: 'free' },
  //   status: { type: String, default: 'active' },
  //   credits: { type: Number, default: 30 },
  //   renewDate: { type: Date }
  // }
});

UserSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model('User', UserSchema, 'users');