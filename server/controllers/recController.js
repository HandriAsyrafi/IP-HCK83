const { Recommendation, User } = require("../models/index");

class RecController {
  static async rec(req, res, next) {
    try {
      let rec = await Recommendation.findAll();

      res.status(200).json(rec);
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = RecController;
