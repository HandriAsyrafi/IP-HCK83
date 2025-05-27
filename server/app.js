// if (process.env.NODE_ENV !== "production") {
//   require("dotenv").config();
// }

// const express = require("express");
// const app = express();
// const router = require("./routes");
// // const errorHandler = require("./middlewares/errorHandler");
// // const MovieController = require("./controllers/movieController");

// app.use(express.urlencoded({ extended: false }));
// app.use(express.json());

// // app.get("/", MovieController.helloMessage);

// app.use(router);
// // app.use(errorHandler);

// module.exports = app;

const express = require("express");
const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
