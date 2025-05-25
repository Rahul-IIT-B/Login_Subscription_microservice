// models/subscription.js
module.exports = (sequelize, DataTypes) => {
  return sequelize.define("Subscription", {
    status: {
      type: DataTypes.ENUM("ACTIVE","INACTIVE","CANCELLED","EXPIRED"),
      defaultValue: "INACTIVE",
    },
    startDate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: true },
    endDate: { type: DataTypes.DATE, allowNull: true },
  });
};
