const { comparePassword } = require("../helpers/bcrypt");
const { generateToken } = require("../helpers/jwt");
const { User } = require("../models/index");

const { OAuth2Client } = require("google-auth-library");

// Create the OAuth2Client instance with environment variable
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

class AuthController {
  static async googleLogin(req, res, next) {
    try {
      const { id_token } = req.body;
      
      // Decode the token to see its contents (for debugging)
      const decoded = JSON.parse(Buffer.from(id_token.split('.')[1], 'base64').toString());
      console.log('Token audience:', decoded.aud);
      console.log('Expected audience:', process.env.GOOGLE_CLIENT_ID);
      
      const ticket = await client.verifyIdToken({
        idToken: id_token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      
      console.log('Google payload received:', {
        email: payload.email,
        name: payload.name,
        sub: payload.sub
      });
      
      const user = await User.findOne({ where: { email: payload.email } });
      console.log('Existing user found:', user ? user.id : 'None');

      if (!user) {
        console.log('Creating new user for email:', payload.email);
        
        // Ensure we have required fields
        const userData = {
          username: payload.name || payload.email.split('@')[0],
          email: payload.email,
          password: Math.random().toString(36).slice(-8) + 'Aa1!' // Ensure it meets validation
        };
        
        console.log('User data to create:', { ...userData, password: '[HIDDEN]' });
        
        const newUser = await User.create(userData);
        console.log('New user created successfully:', newUser.id);
        
        const access_token = generateToken({ id: newUser.id });
        return res.status(201).json({ access_token, user: { id: newUser.id, email: newUser.email } });
      }

      console.log('Logging in existing user:', user.id);
      const access_token = generateToken({ id: user.id });
      res.status(200).json({ access_token, user: { id: user.id, email: user.email } });
    } catch (err) {
      console.error('Google login error details:', {
        message: err.message,
        stack: err.stack,
        name: err.name
      });
      
      if (err.name === 'SequelizeValidationError') {
        return res.status(400).json({ 
          error: 'Validation error', 
          details: err.errors.map(e => e.message) 
        });
      }
      
      next(err);
    }
  }

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
