import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { generateCode } from "../utils/generatecode.js";
import {
  sendResetPassword,
  sendVerificationEmail,
} from "../middlewares/nodemailer.js";

dotenv.config();

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ message: "Remplir tous les les champs svp!" });
    }

    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ message: "Email déjà utilisé" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const code = generateCode();
    const codeExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      verificationCode: code,
      expirationCode: codeExpires,
    });

    await sendVerificationEmail(newUser.email, code);

    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id, email: newUser.email, username: newUser.username },
      process.env.SECRET_KEY_JWT,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours
    });

    res.status(201).json({ message: "Utilisateur créé avec succès", newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur du serveur" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Remplir tous les les champs svp!" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Mots de passe incorrect" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, username: user.username },
      process.env.SECRET_KEY_JWT,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours
    });

    res.status(200).json({ message: "Connexion réussie" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur du serveur" });
  }
};

export const logout = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Déconnecté avec succès" });
};

export const verifyCode = async (req, res) => {
  const { email, code } = req.body;

  const user = await User.findOne({ email });
  if (!user)
    return res.status(404).json({ message: "Utilisateur introuvable" });

  if (user.isVerified) return res.json({ message: "Déjà vérifié ✅" });

  if (user.verificationCode !== code)
    return res.status(400).json({ message: "Code invalide ❌" });

  if (user.expirationCode < new Date())
    return res.status(400).json({ message: "Code expiré ⏳" });

  user.isVerified = true;
  user.verificationCode = null;
  user.expirationCode = null;
  await user.save();

  res.json({ message: "Email vérifié avec succès ✅" });
};

export const resendCode = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    if (user.isVerified) {
      return res.json({ message: "Déjà vérifié ✅" });
    }

    const code = generateCode();
    const codeExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    user.verificationCode = code;
    user.expirationCode = codeExpires;

    await user.save();

    await sendVerificationEmail(user.email, code);

    res.status(200).json({ message: "Nouveau code envoyé avec succès" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur du serveur" });
  }
};

export const requestResetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    const resetToken = jwt.sign(
      { id: user._id, email: user.email },
      process.env.SECRET_KEY_JWT,
      { expiresIn: "15m" }
    );

    user.resetToken = resetToken;
    await user.save();
    const resetLink = `http://localhost:5173/reset-password?token=${resetToken}`;

    await sendResetPassword(user.email, resetLink);

    res
      .status(200)
      .json({ message: "Lien de réinitialisation envoyé par email" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur du serveur" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const user = await User.findOne({ resetToken: token });

    if (!user) {
      return res.status(404).json({ message: "Lien invalide ou expiré" });
    }

    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      return res
        .status(400)
        .json({ message: "Utiliser un mot de passe différent" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.resetToken = null;
    await user.save();
    res.status(200).json({ message: "Mot de passe réinitialisé avec succès" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur du serveur" });
  }
};
