'use strict';

const axios = require("axios");
const fs = require('fs');
const path = require('path');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const response = await axios.get("https://wilds.mhdb.io/en/monsters");
    
    // Load picture data from JSON file
    const pictureData = JSON.parse(
      fs.readFileSync(path.join(__dirname, '../data/monsterPict.json'), 'utf8')
    );
    
    // Create a map for easy lookup
    const pictureMap = {};
    pictureData.forEach(item => {
      pictureMap[item.id] = item.url;
    });

    const result = response.data.map((monster, index) => ({
      name: monster.name,
      species: monster.species,
      description: monster.description,
      imageUrl: pictureMap[index + 1] || null, // Map by index + 1 to match your JSON IDs
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
