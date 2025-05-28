const { comparePassword } = require("../helpers/bcrypt");
const { generateToken } = require("../helpers/jwt");
const { User } = require("../models/index");

class AuthController {
  static async login(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email) {
        throw {
          name: "errorLogin",
          message: "Email must be filled",
        };
      }

      if (!password) {
        throw {
          name: "errorLogin",
          message: "Password must be filled",
        };
      }

      let user = await User.findOne({
        where: {
          email: email,
        },
      });

      if (!user) {
        throw {
          name: "errorLogin",
          message: "Email not found",
        };
      }

      let passwordIsCorrect = comparePassword(password, user.password);

      if (!passwordIsCorrect) {
        throw {
          name: "errorLogin",
          message: "Check your email and password",
        };
      }

      let payload = {
        id: user.id,
        email: user.email,
        username: user.username,
      };
      // console.log(payload);

      let token = generateToken(payload);

      res.status(200).json({
        token: token,
      });
    } catch (error) {
      if (error.name === "errorLogin") {
        res.status(400).json({
          message: error.message,
        });
      } else {
        res.status(500).json({
          message: "Internal Server Error",
        });
      }
    }
  }
}

module.exports = AuthController;
