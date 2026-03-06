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
  res.cookie('token', token, { httpOnly: true, maxAge: 7*24*60*60*1000 });
  res.json({ msg: "Patient registered successfully" });
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
  res.cookie('token', token, { httpOnly: true, maxAge: 7*24*60*60*1000 });
  res.json({ msg: "Doctor registered successfully" });
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
  res.cookie('token', token, { httpOnly: true, maxAge: 7*24*60*60*1000 });
  res.json({ msg: "Login successful" });
});

export default router;