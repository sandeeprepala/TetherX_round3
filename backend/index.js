import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { connectDB } from "./config/db.js";

import authRoutes from "./controllers/authController.js";
import patientRoutes from "./controllers/patientController.js";
import doctorRoutes from "./controllers/doctorController.js";
import queryRoutes from "./controllers/queryController.js";

const app = express();

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

connectDB();

app.use("/auth", authRoutes);
app.use("/patient", patientRoutes);
app.use("/doctor", doctorRoutes);
app.use("/query", queryRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});