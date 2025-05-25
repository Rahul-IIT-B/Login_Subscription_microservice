// models/index.js
const Sequelize = require("sequelize");
const config    = require("../config/db");
let sequelize;
try {
  sequelize = new Sequelize(
    config.DB,
    config.USER,
    config.PASSWORD,
    {
      host: config.HOST,
      dialect: config.dialect,
      logging: console.log, // Enable full query logs
    }
  );
} catch (error) {
  console.error('❌ Sequelize init error:', error.message);
  process.exit(1);
}


const db = {
  Sequelize,
  sequelize,
  User:         require("./user")(sequelize, Sequelize.DataTypes),
  Plan:         require("./plan")(sequelize, Sequelize.DataTypes),
  Subscription: require("./subscription")(sequelize, Sequelize.DataTypes),
};

// Associations
db.User.hasOne(db.Subscription);
db.Subscription.belongsTo(db.User);
db.Plan.hasMany(db.Subscription);
db.Subscription.belongsTo(db.Plan);

module.exports = db;
