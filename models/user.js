// models/user.js
module.exports = (sequelize, DataTypes) => {
  return sequelize.define("User", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Anonymous"
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
};
