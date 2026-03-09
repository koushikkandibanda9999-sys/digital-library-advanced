const jwt = require("jsonwebtoken");
const SECRET = "library_secret_key";

module.exports = function (req, res, next) {
  const token = req.headers.authorization;

  if (!token)
    return res.status(401).json({ message: "Access Denied" });

  try {
    const verified = jwt.verify(token, SECRET);
    req.user = verified;
    next();
  } catch {
    res.status(400).json({ message: "Invalid Token" });
  }
};