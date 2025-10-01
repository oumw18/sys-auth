import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoute from "./routes/authRoute.js";
import { verifyToken } from "./middlewares/token.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// app.use(cors());
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(morgan("dev"));
app.use(cookieParser());

app.use("/api/auth", authRoute);

app.get("/api", verifyToken, (req, res) => {
  res.status(200).json({ message: `Hello ${req.user.email} !` });
});

app.listen(PORT, () => {
  console.log(`Server lancé sur le port ${PORT}`);
});

connectDB();
