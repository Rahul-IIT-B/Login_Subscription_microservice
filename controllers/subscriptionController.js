// controllers/subscriptionController.js
const subscriptionService = require('../services/subscriptionService');

exports.createSubscription = async (req, res, next) => {
  try {
    // Use the authenticated user’s ID from the JWT payload
    const userId = req.user.userId;
    const { planId } = req.body;

    const subscription = await subscriptionService.createSubscription(userId, planId);
    res.status(201).json({ message: 'Subscription created', subscription });
  } catch (err) {
    next(err);
  }
};

exports.getSubscriptionByUserId = async (req, res, next) => {
  try {
    const subscription = await subscriptionService.getSubscription(req.user.userId);
    if (!subscription) return res.status(404).json({ message: "Subscription not found" });
    res.json(subscription);
  } catch (err) {
    next(err);
  }
};

exports.updateSubscriptionByUserId = async (req, res, next) => {
  try {
    const updated = await subscriptionService.updateSubscription(req.user.userId, req.body.planId);
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

exports.cancelSubscriptionByUserId = async (req, res, next) => {
  try {
    const result = await subscriptionService.cancelSubscription(req.user.userId);
    res.json(result);
  } catch (err) {
    next(err);
  }
};
