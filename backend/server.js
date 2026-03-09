const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

/* ROUTES */
const libraryRoutes = require("./backend/routes/libraryRoutes");
app.use("/library", libraryRoutes);

/* SERVE FRONTEND */
app.use(express.static(path.join(__dirname, "frontend")));

/* OPEN dashboard.html when site loads */
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "login.html"));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server Running on port " + PORT);
});