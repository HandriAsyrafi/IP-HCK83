const { Sequelize, DataTypes } = require("sequelize");
const MonsterModel = require("../../models/monster");

describe("Monster Model", () => {
  let sequelize;
  let Monster;

  beforeAll(async () => {
    sequelize = new Sequelize("sqlite::memory:", {
      logging: false,
    });

    Monster = MonsterModel(sequelize, DataTypes);
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  beforeEach(async () => {
    await Monster.destroy({ where: {} });
  });

  describe("Model Definition", () => {
    it("should have correct table name", () => {
      expect(Monster.tableName).toBe("Monsters");
    });

    it("should have correct attributes", () => {
      const attributes = Object.keys(Monster.rawAttributes);

      expect(attributes).toContain("name");
      expect(attributes).toContain("species");
      expect(attributes).toContain("description");
      expect(attributes).toContain("imageUrl");
      expect(attributes).toContain("weaknesses");
      expect(attributes).toContain("id");
      expect(attributes).toContain("createdAt");
      expect(attributes).toContain("updatedAt");
    });

    it("should have correct data types", () => {
      const attributes = Monster.rawAttributes;

      expect(attributes.name.type.constructor.name).toBe("STRING");
      expect(attributes.species.type.constructor.name).toBe("STRING");
      expect(attributes.description.type.constructor.name).toBe("STRING");
      expect(attributes.imageUrl.type.constructor.name).toBe("STRING");
      expect(attributes.weaknesses.type.constructor.name).toBe("ARRAY");
    });
  });

  

  

  
});
