const bcrypt = require("bcryptjs");
const { generatePassword, comparePassword } = require("../../helpers/bcrypt");

// Mock bcrypt to control the behavior in tests
jest.mock("bcryptjs");

describe("Bcrypt Helper", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("generatePassword", () => {
    it("should generate salt and hash password", () => {
      const mockSalt = "mock_salt_123";
      const mockHash = "mock_hash_456";
      const plainPassword = "123456";

      bcrypt.genSaltSync.mockReturnValue(mockSalt);
      bcrypt.hashSync.mockReturnValue(mockHash);

      const result = generatePassword(plainPassword);

      expect(bcrypt.genSaltSync).toHaveBeenCalledWith(10);
      expect(bcrypt.hashSync).toHaveBeenCalledWith(plainPassword, mockSalt);
      expect(result).toBe(mockHash);
    });

    it("should handle different password inputs", () => {
      const testPasswords = [
        "123456",
        "password123",
        "StrongP@ssw0rd!",
        "short",
        "very_long_password_with_special_characters_123!@#",
      ];

      testPasswords.forEach((password, index) => {
        const mockSalt = `salt_${index}`;
        const mockHash = `hash_${index}`;

        bcrypt.genSaltSync.mockReturnValue(mockSalt);
        bcrypt.hashSync.mockReturnValue(mockHash);

        const result = generatePassword(password);

        expect(bcrypt.genSaltSync).toHaveBeenCalledWith(10);
        expect(bcrypt.hashSync).toHaveBeenCalledWith(password, mockSalt);
        expect(result).toBe(mockHash);
      });
    });

    it("should use salt rounds of 10", () => {
      const plainPassword = "testpassword";
      bcrypt.genSaltSync.mockReturnValue("salt");
      bcrypt.hashSync.mockReturnValue("hash");

      generatePassword(plainPassword);

      expect(bcrypt.genSaltSync).toHaveBeenCalledWith(10);
    });

    it("should handle empty string password", () => {
      const plainPassword = "";
      const mockSalt = "empty_salt";
      const mockHash = "empty_hash";

      bcrypt.genSaltSync.mockReturnValue(mockSalt);
      bcrypt.hashSync.mockReturnValue(mockHash);

      const result = generatePassword(plainPassword);

      expect(bcrypt.genSaltSync).toHaveBeenCalledWith(10);
      expect(bcrypt.hashSync).toHaveBeenCalledWith(plainPassword, mockSalt);
      expect(result).toBe(mockHash);
    });

    it("should handle seeder data passwords", () => {
      // Test with actual passwords from seeder data
      const seederPasswords = ["123456", "234567"];

      seederPasswords.forEach((password, index) => {
        const mockSalt = `seeder_salt_${index}`;
        const mockHash = `seeder_hash_${index}`;

        bcrypt.genSaltSync.mockReturnValue(mockSalt);
        bcrypt.hashSync.mockReturnValue(mockHash);

        const result = generatePassword(password);

        expect(bcrypt.genSaltSync).toHaveBeenCalledWith(10);
        expect(bcrypt.hashSync).toHaveBeenCalledWith(password, mockSalt);
        expect(result).toBe(mockHash);
      });
    });
  });

  describe("comparePassword", () => {
    it("should return true for matching passwords", () => {
      const plainPassword = "123456";
      const hashPassword = "hashed_123456";

      bcrypt.compareSync.mockReturnValue(true);

      const result = comparePassword(plainPassword, hashPassword);

      expect(bcrypt.compareSync).toHaveBeenCalledWith(
        plainPassword,
        hashPassword
      );
      expect(result).toBe(true);
    });

    it("should return false for non-matching passwords", () => {
      const plainPassword = "123456";
      const hashPassword = "hashed_different_password";

      bcrypt.compareSync.mockReturnValue(false);

      const result = comparePassword(plainPassword, hashPassword);

      expect(bcrypt.compareSync).toHaveBeenCalledWith(
        plainPassword,
        hashPassword
      );
      expect(result).toBe(false);
    });

    it("should handle various password combinations", () => {
      const testCases = [
        { plain: "123456", hash: "hash_123456", expected: true },
        { plain: "234567", hash: "hash_234567", expected: true },
        { plain: "wrongpassword", hash: "hash_123456", expected: false },
        { plain: "", hash: "hash_empty", expected: true },
        { plain: "test", hash: "wrong_hash", expected: false },
      ];

      testCases.forEach(({ plain, hash, expected }) => {
        bcrypt.compareSync.mockReturnValue(expected);

        const result = comparePassword(plain, hash);

        expect(bcrypt.compareSync).toHaveBeenCalledWith(plain, hash);
        expect(result).toBe(expected);
      });
    });

    it("should handle seeder user authentication scenarios", () => {
      // Simulate authentication for seeder users
      const seederUsers = [
        {
          username: "Usersatu",
          email: "satusatu@mail.com",
          password: "123456",
        },
        { username: "Userdua", email: "duadua@mail.com", password: "234567" },
      ];

      seederUsers.forEach((user) => {
        const hashedPassword = `hashed_${user.password}`;

        // Correct password
        bcrypt.compareSync.mockReturnValue(true);
        let result = comparePassword(user.password, hashedPassword);
        expect(result).toBe(true);

        // Wrong password
        bcrypt.compareSync.mockReturnValue(false);
        result = comparePassword("wrongpassword", hashedPassword);
        expect(result).toBe(false);
      });
    });

    it("should handle edge cases", () => {
      const edgeCases = [
        { plain: null, hash: "some_hash" },
        { plain: undefined, hash: "some_hash" },
        { plain: "password", hash: null },
        { plain: "password", hash: undefined },
      ];

      edgeCases.forEach(({ plain, hash }) => {
        bcrypt.compareSync.mockReturnValue(false);

        const result = comparePassword(plain, hash);

        expect(bcrypt.compareSync).toHaveBeenCalledWith(plain, hash);
        expect(result).toBe(false);
      });
    });
  });

  describe("Integration scenarios", () => {
    it("should work together for password generation and verification", () => {
      const plainPassword = "123456";
      const mockSalt = "integration_salt";
      const mockHash = "integration_hash";

      // Mock generation
      bcrypt.genSaltSync.mockReturnValue(mockSalt);
      bcrypt.hashSync.mockReturnValue(mockHash);

      const hashedPassword = generatePassword(plainPassword);

      // Mock comparison
      bcrypt.compareSync.mockReturnValue(true);

      const isValid = comparePassword(plainPassword, hashedPassword);

      expect(hashedPassword).toBe(mockHash);
      expect(isValid).toBe(true);
      expect(bcrypt.compareSync).toHaveBeenCalledWith(plainPassword, mockHash);
    });

    it("should simulate user registration and login flow", () => {
      const userData = {
        username: "testuser",
        email: "test@example.com",
        password: "mypassword123",
      };

      // Registration: hash password
      bcrypt.genSaltSync.mockReturnValue("reg_salt");
      bcrypt.hashSync.mockReturnValue("reg_hash");

      const hashedPassword = generatePassword(userData.password);

      // Login: verify password
      bcrypt.compareSync.mockReturnValue(true);

      const loginSuccess = comparePassword(userData.password, hashedPassword);

      expect(hashedPassword).toBe("reg_hash");
      expect(loginSuccess).toBe(true);
    });
  });
});
