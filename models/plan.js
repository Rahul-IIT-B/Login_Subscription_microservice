// models/plan.js
module.exports = (sequelize, DataTypes) => {
  return sequelize.define("Plan", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    features: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      defaultValue: [],
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: true,      // NULL means unlimited
      defaultValue: null,
    },
  });
};
