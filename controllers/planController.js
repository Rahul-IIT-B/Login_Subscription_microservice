// controllers/planController.js
const { Plan } = require("../models");

const INITIAL_PLANS = [
  { name: "Basic",      price: 9.99,  duration: 30,   features: ["Feature A", "Feature B"] },
  { name: "Pro",        price: 24.99, duration: 30,   features: ["Feature A", "Feature B", "Feature C"] },
  { name: "Enterprise", price: 49.99, duration: 30,   features: ["All Features"] },
];

exports.getAllPlans = async (req, res, next) => {
  try {
    // Ensure only and all initial plans are created
    // await Plan.destroy({ where: {} });
    // for (const data of INITIAL_PLANS) {
    //   await Plan.findOrCreate({
    //     where: { name: data.name },
    //     defaults: data,
    //   });
    // }

    // Now fetch them all
    const plans = await Plan.findAll();
    res.json(plans);
  } catch (err) {
    next({ status: 500, message: "Failed to fetch plans" });
  }
};
