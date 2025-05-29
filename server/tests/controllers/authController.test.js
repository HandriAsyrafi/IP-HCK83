const request = require("supertest");
const express = require("express");
const AuthController = require("../../controllers/authController");
const { comparePassword } = require("../../helpers/bcrypt");
const { generateToken } = require("../../helpers/jwt");
const { User } = require("../../models");

jest.mock("../../helpers/bcrypt");
jest.mock("../../helpers/jwt");

const app = express();
app.use(express.json());
app.post("/login", AuthController.login);

describe("AuthController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /login", () => {
    it("should login successfully with valid credentials", async () => {
      const mockUser = {
        id: 1,
        email: "test@example.com",
        username: "testuser",
        password: "hashedpassword",
      };

      User.findOne = jest.fn().mockResolvedValue(mockUser);
      comparePassword.mockReturnValue(true);
      generateToken.mockReturnValue("mock-jwt-token");

      const response = await request(app).post("/login").send({
        email: "test@example.com",
        password: "password123",
      });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("access_token");
      expect(response.body.access_token).toBe("mock-jwt-token");
    });

    it("should return 400 when email is missing", async () => {
      const response = await request(app).post("/login").send({
        password: "password123",
      });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Email must be filled");
    });

    it("should return 400 when password is missing", async () => {
      const response = await request(app).post("/login").send({
        email: "test@example.com",
      });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Password must be filled");
    });

    it("should return 401 when user not found", async () => {
      User.findOne = jest.fn().mockResolvedValue(null);

      const response = await request(app).post("/login").send({
        email: "nonexistent@example.com",
        password: "password123",
      });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe("Email not found");
    });

    it("should return 401 when password is incorrect", async () => {
      const mockUser = {
        id: 1,
        email: "test@example.com",
        password: "hashedpassword",
      };

      User.findOne = jest.fn().mockResolvedValue(mockUser);
      comparePassword.mockReturnValue(false);

      const response = await request(app).post("/login").send({
        email: "test@example.com",
        password: "wrongpassword",
      });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe("Check your email and password");
    });

    it("should handle database errors", async () => {
      User.findOne = jest.fn().mockRejectedValue(new Error("Database error"));

      const response = await request(app).post("/login").send({
        email: "test@example.com",
        password: "password123",
      });

      expect(response.status).toBe(500);
    });
  });
});
