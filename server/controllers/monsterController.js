const { Monster } = require("../models/index");
const axios = require("axios");
const baseURL = "http://localhost:3000";

class MonsterController {
  static async monsters(req, res, next) {
    try {
      let monster = await Monster.findAll();

      res.status(200).json(monster);
    } catch (error) {
      next(error);
    }
  }
}

const generateWeapon = async (monsterId) => {
  const response = await axios.get(
    `${baseURL}/monsters/${monsterId}/best-weapon`
  );
  // This creates a new recommendation
};

module.exports = MonsterController;
