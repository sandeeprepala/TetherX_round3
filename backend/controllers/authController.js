import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import Patient from "../models/Patient.js";
import Doctor from "../models/Doctor.js";

const router = express.Router();

const createToken = (id, role) =>
  jwt.sign({ id, role }, "secret", { expiresIn: "7d" });

/* PATIENT REGISTER */

router.post("/patient/register", async (req, res) => {
  const { email, password, fullName } = req.body;

  const existingPatient = await Patient.findOne({ email });
  if (existingPatient) return res.status(400).json({ msg: "Email already registered" });

  const hash = await bcrypt.hash(password, 10);

  const patient = await Patient.create({
    email,
    passwordHash: hash,
    fullName
  });

  const token = createToken(patient._id, "patient");
  res.cookie("token", token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
  res.json({
    msg: "Patient registered successfully",
    user: {
      id: patient._id,
      role: "patient",
      email: patient.email
    }
  });
});

/* DOCTOR REGISTER */

router.post("/doctor/register", async (req, res) => {
  const { email, password, fullName, specialization } = req.body;

  const existingDoctor = await Doctor.findOne({ email });
  if (existingDoctor) return res.status(400).json({ msg: "Email already registered" });

  const hash = await bcrypt.hash(password, 10);

  const doctor = await Doctor.create({
    email,
    passwordHash: hash,
    fullName,
    specialization
  });

  const token = createToken(doctor._id, "doctor");
  res.cookie("token", token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
  res.json({
    msg: "Doctor registered successfully",
    user: {
      id: doctor._id,
      role: "doctor",
      email: doctor.email
    }
  });
});

/* LOGIN */

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  let user = await Patient.findOne({ email });
  let role = "patient";

  if (!user) {
    user = await Doctor.findOne({ email });
    role = "doctor";
  }

  if (!user) return res.status(404).json({ msg: "User not found" });

  const valid = await bcrypt.compare(password, user.passwordHash);

  if (!valid) return res.status(400).json({ msg: "Wrong password" });

  const token = createToken(user._id, role);
  res.cookie("token", token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
  res.json({
    msg: "Login successful",
    user: {
      id: user._id,
      role,
      email: user.email
    }
  });
});

router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ msg: "Logged out" });
});

export default router;