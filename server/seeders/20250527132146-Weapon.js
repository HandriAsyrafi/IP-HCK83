"use strict";

const axios = require("axios");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const response = await axios.get("https://wilds.mhdb.io/en/weapons");

    const allWeapons = response.data;

    const highRarityWeapons = allWeapons
      .filter((weapon) => weapon.rarity >= 7)
      .map((weapon) => ({
        name: weapon.name,
        kind: weapon.kind,
        rarity: weapon.rarity,
        damage: weapon.damage.raw,
        element: weapon.specials.map((el) => el.element),
        elementDamage: weapon.specials.map((el) => el.damage.display),
      }));

    console.log(highRarityWeapons);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
