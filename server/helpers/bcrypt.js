const bcrypt = require("bcryptjs");

function generatePassword(plainPassword) {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(plainPassword, salt);

  return hash;
}

function comparePassword(plainPassword, hashPassword) {
  return bcrypt.compareSync(plainPassword, hashPassword);
}

module.exports = { generatePassword, comparePassword };
