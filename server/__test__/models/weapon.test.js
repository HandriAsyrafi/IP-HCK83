const { Sequelize, DataTypes } = require('sequelize');
const WeaponModel = require('../../models/weapon');

describe('Weapon Model', () => {
  let sequelize;
  let Weapon;

  beforeAll(async () => {
    sequelize = new Sequelize('sqlite::memory:', {
      logging: false
    });

    Weapon = WeaponModel(sequelize, DataTypes);
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  beforeEach(async () => {
    await Weapon.destroy({ where: {} });
  });

  describe('Model Definition', () => {
    it('should have correct table name', () => {
      expect(Weapon.tableName).toBe('Weapons');
    });

    it('should have correct attributes', () => {
      const attributes = Object.keys(Weapon.rawAttributes);

      expect(attributes).toContain('name');
      expect(attributes).toContain('kind');
      expect(attributes).toContain('rarity');
      expect(attributes).toContain('damage');
      expect(attributes).toContain('element');
      expect(attributes).toContain('damageElement');
      expect(attributes).toContain('id');
      expect(attributes).toContain('createdAt');
      expect(attributes).toContain('updatedAt');
    });

    it('should have correct data types', () => {
      const attributes = Weapon.rawAttributes;

      expect(attributes.name.type.constructor.name).toBe('STRING');
      expect(attributes.kind.type.constructor.name).toBe('STRING');
      expect(attributes.rarity.type.constructor.name).toBe('INTEGER');
      expect(attributes.damage.type.constructor.name).toBe('INTEGER');
      expect(attributes.element.type.constructor.name).toBe('STRING');
      expect(attributes.damageElement.type.constructor.name).toBe('STRING');
    });
  });

  describe('CRUD Operations with Realistic Data', () => {
    it('should create high rarity weapon like seeder data', async () => {
      const weapon = await Weapon.create({
        name: 'Diablos Crusher II',
        kind: 'Hammer',
        rarity: 8,
        damage: 1456,
        element: 'No Element',
        damageElement: '0'
      });

      expect(weapon.name).toBe('Diablos Crusher II');
      expect(weapon.kind).toBe('Hammer');
      expect(weapon.rarity).toBe(8);
      expect(weapon.damage).toBe(1456);
      expect(weapon.element).toBe('No Element');
    });

    it('should create weapon with elemental damage', async () => {
      const weapon = await Weapon.create({
        name: 'Rathalos Fire Sword',
        kind: 'Great Sword',
        rarity: 7,
        damage: 1344,
        element: 'Fire',
        damageElement: '420'
      });

      expect(weapon.element).toBe('Fire');
      expect(weapon.damageElement).toBe('420');
    });

    it('should create weapons of different kinds', async () => {
      const weaponTypes = [
        { name: 'Test Hammer', kind: 'Hammer', rarity: 6, damage: 1200 },
        { name: 'Test Sword', kind: 'Great Sword', rarity: 6, damage: 1300 },
        { name: 'Test Bow', kind: 'Bow', rarity: 6, damage: 350 },
        { name: 'Test Lance', kind: 'Lance', rarity: 6, damage: 460 },
        { name: 'Test Blade', kind: 'Long Sword', rarity: 6, damage: 990 }
      ];

      for (const weaponData of weaponTypes) {
        const weapon = await Weapon.create(weaponData);
        expect(weapon.kind).toBe(weaponData.kind);
        expect(weapon.damage).toBe(weaponData.damage);
      }
    });

    it('should find weapon by id', async () => {
      const createdWeapon = await Weapon.create({
        name: 'Test Weapon',
        kind: 'Sword and Shield',
        rarity: 6,
        damage: 350,
        element: 'Thunder',
        damageElement: '280'
      });

      const foundWeapon = await Weapon.findByPk(createdWeapon.id);
      expect(foundWeapon.name).toBe('Test Weapon');
      expect(foundWeapon.kind).toBe('Sword and Shield');
    });
  });

  describe('Query Operations Based on Seeder Logic', () => {
    beforeEach(async () => {
      // Create test data similar to seeder (rarity >= 6)
      await Weapon.bulkCreate([
        { name: 'Low Rarity Weapon', kind: 'Hammer', rarity: 3, damage: 800 },
        { name: 'High Rarity Weapon 1', kind: 'Great Sword', rarity: 6, damage: 1200 },
        { name: 'High Rarity Weapon 2', kind: 'Hammer', rarity: 7, damage: 1350 },
        { name: 'Legendary Weapon', kind: 'Bow', rarity: 8, damage: 400 }
      ]);
    });

    it('should find weapons by rarity (seeder filters rarity >= 6)', async () => {
      const highRarityWeapons = await Weapon.findAll({
        where: {
          rarity: {
            [sequelize.Sequelize.Op.gte]: 6
          }
        }
      });

      expect(highRarityWeapons).toHaveLength(3);
      highRarityWeapons.forEach(weapon => {
        expect(weapon.rarity).toBeGreaterThanOrEqual(6);
      });
    });

    it('should find weapons by kind', async () => {
      const hammers = await Weapon.findAll({
        where: { kind: 'Hammer' }
      });

      expect(hammers).toHaveLength(2);
      hammers.forEach(weapon => {
        expect(weapon.kind).toBe('Hammer');
      });
    });

    it('should find weapons by damage range', async () => {
      const highDamageWeapons = await Weapon.findAll({
        where: {
          damage: {
            [sequelize.Sequelize.Op.gte]: 1200
          }
        }
      });

      expect(highDamageWeapons.length).toBeGreaterThan(0);
      highDamageWeapons.forEach(weapon => {
        expect(weapon.damage).toBeGreaterThanOrEqual(1200);
      });
    });

    it('should sort weapons by damage descending', async () => {
      const weapons = await Weapon.findAll({
        order: [['damage', 'DESC']]
      });

      for (let i = 0; i < weapons.length - 1; i++) {
        expect(weapons[i].damage).toBeGreaterThanOrEqual(weapons[i + 1].damage);
      }
    });
  });

  describe('Element and Damage Element Operations', () => {
    it('should handle weapons with no element', async () => {
      const weapon = await Weapon.create({
        name: 'Raw Damage Weapon',
        kind: 'Hammer',
        rarity: 6,
        damage: 1400,
        element: 'No Element',
        damageElement: '0'
      });

      expect(weapon.element).toBe('No Element');
      expect(weapon.damageElement).toBe('0');
    });

    it('should handle weapons with various elements', async () => {
      const elements = ['Fire', 'Water', 'Thunder', 'Ice', 'Dragon'];
      
      for (const element of elements) {
        const weapon = await Weapon.create({
          name: `${element} Weapon`,
          kind: 'Great Sword',
          rarity: 6,
          damage: 1200,
          element: element,
          damageElement: '300'
        });

        expect(weapon.element).toBe(element);
        expect(weapon.damageElement).toBe('300');
      }
    });
  });

  describe('Update and Delete Operations', () => {
    it('should update weapon properties', async () => {
      const weapon = await Weapon.create({
        name: 'Original Weapon',
        kind: 'Hammer',
        rarity: 6,
        damage: 1200
      });

      await weapon.update({
        name: 'Updated Weapon',
        damage: 1350,
        rarity: 7
      });

      expect(weapon.name).toBe('Updated Weapon');
      expect(weapon.damage).toBe(1350);
      expect(weapon.rarity).toBe(7);
    });

    it('should delete weapon', async () => {
      const weapon = await Weapon.create({
        name: 'Delete Me',
        kind: 'Sword',
        rarity: 6,
        damage: 1000
      });

      await weapon.destroy();
      const deletedWeapon = await Weapon.findByPk(weapon.id);
      expect(deletedWeapon).toBeNull();
    });
  });

  describe('Associations', () => {
    it('should have associate method', () => {
      expect(typeof Weapon.associate).toBe('function');
    });

    it('should call associate without errors', () => {
      const mockModels = {
        Recommendation: { hasMany: jest.fn() }
      };
      expect(() => Weapon.associate(mockModels)).not.toThrow();
    });
  });
});
