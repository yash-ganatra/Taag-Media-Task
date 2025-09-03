const jwt = require("jsonwebtoken");

function auth(requiredRole) {
  return (req, res, next) => {
    const header = req.headers["authorization"];
    if (!header) return res.status(401).json({ error: "Missing token" });

    const token = header.split(" ")[1];
    try {
      const user = jwt.verify(token, "secret123");
      if (requiredRole && user.role !== requiredRole) {
        return res.status(403).json({ error: "Forbidden" });
      }
      req.user = user;
      next();
    } catch (err) {
      return res.status(401).json({ error: "Invalid token" });
    }
  };
}

module.exports = auth;
