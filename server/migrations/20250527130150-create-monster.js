"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Monsters", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
      },
      species: {
        type: Sequelize.STRING,
      },
      description: {
        type: Sequelize.STRING,
      },
      weaknesses: {
        // Correct way: Access DataTypes from the 'Sequelize' object
        type: Sequelize.ARRAY(Sequelize.STRING), // Example: array of strings
        allowNull: true,
        defaultValue: [],
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Monsters");
  },
};
