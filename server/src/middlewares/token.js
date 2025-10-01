import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const verifyToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) return res.status(401).json({ message: "Accèss non autorisé" });

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY_JWT);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Token invalide" });
  }
};
