import jwt from "jsonwebtoken";
import { hashPassword, verifyPassword } from "../utils/bcryptUtil.mjs";
import * as userController from "../controllers/AuthControllers.mjs";
import User from "../models/UserModel.mjs";
import unstable_mockModule from "jest";

await unstable_mockModule("../models/UserModel.mjs", () => ({
  default: jest.fn(),
}));

await unstable_mockModule("../utils/bcryptUtil.mjs", () => ({
  hashPassword: jest.fn(),
  verifyPassword: jest.fn(),
}));

await unstable_mockModule("jsonwebtoken", () => ({
  sign: jest.fn(),
  verify: jest.fn(),
}));

describe("User Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("registerUser", () => {
    it("should return 409 if email is already registered", async () => {
      User.findOne.mockResolvedValueOnce({ email: "test@example.com" });
      const req = {
        body: {
          email: "test@example.com",
          contactNo: "1234567890",
          password: "password123",
        },
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      await userController.registerUser(req, res);
      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        type: "email",
        message: "Email is already registered",
      });
    });

    it("should return 409 if contact number is already registered", async () => {
      User.findOne
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce({ contactNo: "1234567890" });
      const req = {
        body: {
          email: "new@example.com",
          contactNo: "1234567890",
          password: "password123",
        },
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      await userController.registerUser(req, res);
      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        type: "contact",
        message: "Contact no is already registered",
      });
    });

    it("should create a new user and return 201", async () => {
      User.findOne.mockResolvedValueOnce(null).mockResolvedValueOnce(null);
      hashPassword.mockResolvedValue("hashedPassword");
      User.mockImplementation(() => ({
        save: jest.fn().mockResolvedValue(true),
      }));
      const req = {
        body: {
          email: "new@example.com",
          contactNo: "1234567890",
          password: "password123",
        },
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      await userController.registerUser(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "New user account created",
      });
    });
  });

  describe("login", () => {
    it("should return 401 for incorrect email", async () => {
      User.findOne.mockResolvedValue(null);
      const req = {
        body: { email: "wrong@example.com", password: "password123" },
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      await userController.login(req, res);
      expect(res.status).toHaveBeenCalledWith(401);
    });

    it("should return 401 for incorrect password", async () => {
      User.findOne.mockResolvedValue({
        email: "test@example.com",
        password: "hashedPassword",
      });
      verifyPassword.mockResolvedValue(false);
      const req = {
        body: { email: "test@example.com", password: "wrongPassword" },
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      await userController.login(req, res);
      expect(res.status).toHaveBeenCalledWith(401);
    });

    it("should return 200 with token for correct credentials", async () => {
      User.findOne.mockResolvedValue({
        _id: "user123",
        userType: "admin",
        password: "hashedPassword",
      });
      verifyPassword.mockResolvedValue(true);
      jwt.sign.mockReturnValue("valid-token");
      const req = {
        body: { email: "test@example.com", password: "password123" },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        cookie: jest.fn(),
      };
      await userController.login(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.cookie).toHaveBeenCalledWith(
        "token",
        "valid-token",
        expect.any(Object)
      );
    });
  });

  describe("logout", () => {
    it("should clear the token and return 200", async () => {
      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        cookie: jest.fn(),
      };
      await userController.logout(req, res);
      expect(res.cookie).toHaveBeenCalledWith("token", "", expect.any(Object));
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe("validateToken", () => {
    it("should return 204 if no token is found", async () => {
      const req = { cookies: {} };
      const res = { status: jest.fn().mockReturnThis(), end: jest.fn() };
      await userController.validateToken(req, res);
      expect(res.status).toHaveBeenCalledWith(204);
    });

    it("should return 200 with decoded token if token is valid", async () => {
      const req = { cookies: { token: "valid-token" } };
      jwt.verify.mockReturnValue({ id: "user123", role: "admin" });
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      await userController.validateToken(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: { id: "user123", role: "admin" },
      });
    });

    it("should return 401 for an invalid or expired token", async () => {
      const req = { cookies: { token: "invalid-token" } };
      jwt.verify.mockImplementation(() => {
        throw new Error("Invalid token");
      });
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      await userController.validateToken(req, res);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Invalid or expired token",
      });
    });
  });
});
