const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  validateUserId,
  validatePlanId,
} = require("../middleware/validation");
const {
  createSubscription,
  getSubscriptionByUserId,
  updateSubscriptionByUserId,
  cancelSubscriptionByUserId,
} = require("../controllers/subscriptionController");

// All routes require authentication
router.use(auth);

router.post("/", validatePlanId, createSubscription);
router.get("/:userId", validateUserId, getSubscriptionByUserId);
router.put(
  "/:userId",
  [validateUserId, validatePlanId],
  updateSubscriptionByUserId
);
router.delete("/:userId", validateUserId, cancelSubscriptionByUserId);

module.exports = router;
