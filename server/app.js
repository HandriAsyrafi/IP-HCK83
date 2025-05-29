const express = require("express");
const cors = require("cors");
const MonsterController = require("./controllers/monsterController");
const WeaponController = require("./controllers/weaponController");
const AuthController = require("./controllers/authController");
const RecController = require("./controllers/recController");
const { authenticate } = require('./middleware/auth');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/", async (req, res) => {
  res.send("Monster Hunter Recommendation API with Gemini AI");
});

// Authentication routes
app.post("/google-login", AuthController.googleLogin);
app.post("/login", AuthController.login);

// Data routes
app.get("/monsters", MonsterController.monsters);
app.get("/weapons", WeaponController.weapons);

// Recommendation routes
app.get("/recommendations", RecController.rec);
app.post("/recommendations/generate", RecController.generateRecommendation);
app.delete("/recommendations/:id", RecController.delRec);

// AI Analysis routes
app.get("/monsters/:monsterId/analyze", RecController.analyzeMonster);

// NEW: Best weapon recommendation for specific monster (with authentication)
app.get("/monsters/:monsterId/best-weapon", authenticate, RecController.getBestWeaponForMonster);

app.listen(port, () => {
  console.log(`Monster Hunter API listening on port ${port}`);
});
