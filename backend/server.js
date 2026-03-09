const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

/* ROUTES */
const libraryRoutes = require("./backend/routes/libraryRoutes");
const authRoutes = require("./backend/routes/authRoutes");

app.use("/library", libraryRoutes);
app.use("/auth", authRoutes);

/* SERVE FRONTEND */
app.use(express.static(path.join(__dirname, "../frontend")));

/* HOME PAGE */
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/login.html"));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server Running on port " + PORT);
});