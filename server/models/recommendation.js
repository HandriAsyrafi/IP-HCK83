"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Recommendation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Recommendation.belongsTo(models.User, {
        foreignKey: "userId",
      }),
        Recommendation.belongsTo(models.Weapon, {
          foreignKey: "weaponId",
        });
    }
  }
  Recommendation.init(
    {
      userId: DataTypes.INTEGER,
      weaponId: DataTypes.STRING,
      reasoning: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "Recommendation",
    }
  );
  return Recommendation;
};
