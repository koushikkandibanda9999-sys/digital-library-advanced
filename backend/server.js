const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const authRoutes = require("./routes/authRoutes");
const libraryRoutes = require("./routes/libraryRoutes");

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use("/auth", authRoutes);
app.use("/library", libraryRoutes);

app.listen(5000, () => {
  console.log("Server Running on port 5000");
});