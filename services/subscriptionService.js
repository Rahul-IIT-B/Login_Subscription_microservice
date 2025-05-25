// services/subscriptionService.js
const { Op } = require('sequelize');
const { User, Plan, Subscription } = require('../models');
const retry = require('../utils/retry');
const { publish } = require('../config/rabbitmq');

async function createSubscription(userId, planId) {
  // Verify user & plan existence
  const user = await retry(() => User.findByPk(userId));
  if (!user) throw { status: 404, message: 'User not found' };

  const plan = await retry(() => Plan.findByPk(planId));
  if (!plan) throw { status: 404, message: 'Plan not found' };

  // Check for any existing subscription record
  let sub = await retry(() =>
    Subscription.findOne({ where: { UserId: userId } })
  );

  // Compute the new dates
  const startDate = new Date();
  const endDate = plan.duration
    ? new Date(startDate.getTime() + plan.duration * 24 * 60 * 60 * 1000)
    : null;

  if (sub) {
    if (sub.status === 'INACTIVE') {
      // Reactivate the existing INACTIVE record
      sub.PlanId    = planId;
      sub.startDate = startDate;
      sub.endDate   = endDate;
      sub.status    = 'ACTIVE';
      await retry(() => sub.save());

    } else {
      // Cannot create if already ACTIVE, CANCELLED, or EXPIRED
      throw { status: 409, message: 'Subscription already exists.' };
    }

  } else {
    // No prior record: create a brand-new one
    sub = await retry(() =>
      Subscription.create({
        UserId:    userId,
        PlanId:    planId,
        status:    'ACTIVE',
        startDate,
        endDate
      })
    );
  }

  // Publish event
  publish('subscription.created', {
    subscriptionId: sub.id,
    userId,
    planId,
    startDate,
    endDate
  });

  return sub;
}

async function getSubscription(userId) {
  // 1) Ensure user exists
  const user = await retry(() => User.findByPk(userId));
  if (!user) throw { status: 404, message: 'User not found' };

  // 2) Find or create the subscription record
  const [ sub, created ] = await retry(() =>
    Subscription.findOrCreate({
      where: { UserId: userId },
      defaults: { status: 'INACTIVE', startDate: null, endDate: null }
    })
  );

  // If it existed and was ACTIVE but now past endDate, expire it
  if (sub.status === 'ACTIVE' && sub.endDate && sub.endDate < new Date()) {
    sub.status = 'EXPIRED';
    await retry(() => sub.save());
    publish('subscription.expired', {
      subscriptionId: sub.id,
      userId
    });
  }

  // 3) Attach plan details only if a plan is set
  let planData = null;
  if (sub.PlanId) {
    const plan = await retry(() =>
      Plan.findByPk(sub.PlanId, { attributes: ['name','price','features','duration'] })
    );
    planData = plan;
  }

  return {
    id:        sub.id,
    status:    sub.status,
    startDate: sub.startDate,
    endDate:   sub.endDate,
    plan:      planData    // null if INACTIVE
  };
}


async function updateSubscription(userId, newPlanId) {
  const sub = await retry(() =>
    Subscription.findOne({ where: { UserId: userId, status: { [Op.in]: ['ACTIVE', 'CANCELLED', 'EXPIRED'] } } })
  );
  if (!sub) throw { status: 404, message: 'Subscription not found' };

  const plan = await retry(() => Plan.findByPk(newPlanId));
  if (!plan) throw { status: 404, message: 'Plan not found' };

  sub.PlanId = newPlanId;
  sub.status    = 'ACTIVE';
  sub.startDate = new Date();
  sub.endDate = new Date(sub.startDate.getTime() + plan.duration * 24 * 60 * 60 * 1000);
  await retry(() => sub.save());


  // Publish event
  publish('subscription.updated', {
    subscriptionId: sub.id,
    userId,
    planId: sub.PlanId,
  });

  return sub;
}

async function cancelSubscription(userId) {
  const sub = await retry(() =>
    Subscription.findOne({
      where: { UserId: userId, status:  'ACTIVE' }
    })
  );
  if (!sub) throw { status: 404, message: 'Active subscription not found' };

  sub.status = 'CANCELLED';
  await retry(() => sub.save());

  // Publish event
  publish('subscription.cancelled', {
    subscriptionId: sub.id,
    userId
  });

  return sub;
}

async function expireSubscriptions() {
  const now = new Date();
  const overdue = await retry(() =>
    Subscription.findAll({
      where: { endDate: { [Op.lt]: now }, status: 'ACTIVE' }
    })
  );

  for (const sub of overdue) {
    sub.status = 'EXPIRED';
    await retry(() => sub.save());
    publish('subscription.expired', {
      subscriptionId: sub.id,
      userId: sub.UserId
    });
  }
}

module.exports = {
  createSubscription,
  getSubscription,
  updateSubscription,
  cancelSubscription,
  expireSubscriptions
};
