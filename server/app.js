const express = require("express");
const MonsterController = require("./controllers/monsterController");
const WeaponController = require("./controllers/weaponController");
const AuthController = require("./controllers/authController");
const RecController = require("./controllers/recController");

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/", async (req, res) => {
  res.send("Received request with user persona");
});

app.post("/login", AuthController.login);
app.get("/monsters", MonsterController.monsters);
app.get("/weapons", WeaponController.weapons);
app.get("/rec", RecController.rec);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
