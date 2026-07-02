const User = require('../models/User');
const { getRequiredCredits } = require('../utils/creditCosts');

async function deductCredits(req, res, next) {
  try {
    const { model_name } = req.params;
    const required = getRequiredCredits(model_name, req.body);

    const user = await User.findOneAndUpdate(
      { _id: req.user._id, credits: { $gte: required } },
      { $inc: { credits: -required } },
      { new: true }
    );

    if (!user) {
      return res.status(403).json({ error: 'INSUFFICIENT_CREDITS' });
    }

    req.creditCost = required;
    req.user = user;
    next();
  } catch (err) {
    console.error('Credit check error:', err.message);
    return res.status(500).json({ error: true, message: 'Failed to verify credits' });
  }
}

module.exports = deductCredits;
