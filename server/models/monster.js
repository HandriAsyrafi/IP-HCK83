"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Monster extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {}
  }
  Monster.init(
    {
      name: DataTypes.STRING,
      species: DataTypes.STRING,
      description: DataTypes.STRING,
      weaknesses: {
        type: DataTypes.ARRAY(DataTypes.STRING), // Using destructured DataTypes
        allowNull: true,
        defaultValue: [],
      },
    },
    {
      sequelize,
      modelName: "Monster",
    }
  );
  return Monster;
};
