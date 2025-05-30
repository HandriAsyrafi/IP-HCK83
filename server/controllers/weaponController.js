const { Weapon } = require("../models/index");

class WeaponController {
  static async weapons(req, res, next) {
    try {
      let weapon = await Weapon.findAll();

      res.status(200).json(weapon);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = WeaponController;
