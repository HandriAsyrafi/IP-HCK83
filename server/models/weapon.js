"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Weapon extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Weapon.init(
    {
      name: DataTypes.STRING,
      kind: DataTypes.STRING,
      rarity: DataTypes.INTEGER,
      damage: DataTypes.INTEGER,
      element: DataTypes.STRING,
      damageElement: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Weapon",
    }
  );
  return Weapon;
};
