
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ message: "Accès refusé. Aucun token fourni." });
  }

  try {
    const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
    req.user = decoded; // On stocke les infos de l'utilisateur
    next();
  } catch (err) {
    res.status(403).json({ message: "Token invalide ou expiré." });
  }
};

module.exports = authMiddleware;
