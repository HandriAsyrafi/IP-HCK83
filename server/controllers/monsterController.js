const { Monster } = require("../models/index");

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

module.exports = MonsterController;
