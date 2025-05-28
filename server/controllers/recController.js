const { Recommendation, User, Weapon } = require("../models/index");

class RecController {
  static async rec(req, res, next) {
    try {
      let rec = await Recommendation.findAll({
        include: Weapon,
      });

      res.status(200).json(rec);
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = RecController;
