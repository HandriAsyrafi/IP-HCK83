"use strict";

const { generatePassword } = require("../helpers/bcrypt");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const data = [
      {
        username: "Usersatu",
        email: "satusatu@mail.com",
        password: "123456",
      },
      {
        username: "Userdua",
        email: "duadua@mail.com",
        password: "234567",
      },
    ];

    data.map((el) => {
      el.password = generatePassword(el.password);
      el.createdAt = new Date();
      el.updatedAt = new Date();
      return el;
    });

    await queryInterface.bulkInsert("Users", data, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("People", null, {});
  },
};
