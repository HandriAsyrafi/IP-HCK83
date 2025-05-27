"use strict";

const axios = require("axios");
const monster = require("../models/monster");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const response = await axios.get("https://wilds.mhdb.io/en/monsters");

    const result = response.data.map((monster) => ({
      name: monster.name,
      species: monster.species,
      description: monster.description,
      weaknesses: monster.weaknesses.map((w) => {
        // Ambil property penting sesuai jenis weakness:
        if (w.kind === "element") return w.element;
        if (w.kind === "status") return w.status;
        if (w.kind === "effect") return w.effect;
      }),
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    await queryInterface.bulkInsert("Monsters", result, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Monsters", null, {});
  },
};
