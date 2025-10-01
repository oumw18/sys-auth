import express from "express";
import {
  login,
  logout,
  register,
  requestResetPassword,
  resendCode,
  resetPassword,
  verifyCode,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/verify-code", verifyCode);
router.post("/resend-code", resendCode);
router.post("/reset-password", resetPassword);
router.post("/forgot-password", requestResetPassword);

export default router;
