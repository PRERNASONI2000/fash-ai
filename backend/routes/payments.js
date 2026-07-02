// routes/payments.js
const express = require('express');
const Stripe = require('stripe');
const auth = require('../middleware/auth');
const Plan = require('../models/Plan');
const User = require('../models/User');

const router = express.Router();

function getStripeClient() {
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) return null;
  return new Stripe(secret);
}

router.post('/create-checkout-session', auth, async (req, res) => {
  try {
    const stripe = getStripeClient();
    if (!stripe) {
      return res.status(500).json({ message: 'Missing STRIPE_SECRET_KEY' });
    }

    const { planId } = req.body;

    if (!planId) {
      return res.status(400).json({ message: 'planId is required' });
    }

    const plan = await Plan.findById(planId);
    if (!plan) {
      return res.status(404).json({ message: 'Plan not found' });
    }

    if (!plan.price || plan.price <= 0) {
      return res.status(400).json({ message: 'Selected plan is not purchasable' });
    }

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const unitAmount = Math.round(plan.price * 100);

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: 'usd',
            product_data: {
              name: plan.name,
              description: plan.features?.join(' | ') || undefined,
            },
            unit_amount: unitAmount,
          },
        },
      ],
      success_url: `${frontendUrl}/subscriptions?payment=success`,
      cancel_url: `${frontendUrl}/subscriptions?payment=cancelled`,
      customer_email: req.user.email,
      metadata: {
        planId: String(plan._id),
        planType: plan.type,
        userId: String(req.user._id),
      },
    });

    return res.json({ url: session.url });
  } catch (err) {
    console.error('Stripe checkout session error:', err.message);
    return res.status(500).json({ message: 'Failed to create checkout session' });
  }
});

router.post('/webhook', async (req, res) => {
  const stripe = getStripeClient();
  if (!stripe) {
    return res.status(500).send('Missing STRIPE_SECRET_KEY');
  }

  const signature = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return res.status(500).send('Missing STRIPE_WEBHOOK_SECRET');
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, signature, webhookSecret);
  } catch (err) {
    console.error('Stripe webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const planId = session.metadata?.planId;
    const metadataUserId = session.metadata?.userId;
    const customerEmail = session.customer_details?.email || session.customer_email;

    try {
      const plan = await Plan.findById(planId);
      if (!plan) {
        return res.status(200).json({ received: true, skipped: 'plan_not_found' });
      }

      let user = null;
      if (metadataUserId) {
        user = await User.findById(metadataUserId);
      }

      if (!user && customerEmail) {
        user = await User.findOne({ email: customerEmail });
      }

      if (!user) {
        return res.status(200).json({ received: true, skipped: 'user_not_found' });
      }

      const update = {
        $inc: { credits: plan.credits || 0 },
        $set: { activePlan: plan._id },
      };

      if (plan.type === 'addon') {
        update.$addToSet = { purchasedAddons: plan._id };
      }

      await User.updateOne({ _id: user._id }, update);
    } catch (err) {
      console.error('Stripe webhook processing error:', err.message);
      return res.status(500).json({ received: false });
    }
  }

  return res.status(200).json({ received: true });
});

module.exports = router;
