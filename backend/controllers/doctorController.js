import express from "express";
import Appointment from "../models/AppointmentRequest.js";
import Doctor from "../models/Doctor.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

/* SET AVAILABILITY */

router.put("/availability", auth, async (req, res) => {
  const { startDate, endDate } = req.body;

  const doctor = await Doctor.findById(req.user.id);

  if (!doctor) return res.status(404).json({ msg: "Doctor not found" });

  doctor.availability = { startDate: new Date(startDate), endDate: new Date(endDate) };

  await doctor.save();

  res.json({ msg: "Availability updated successfully" });
});

/* ACCEPT REQUEST */

router.post("/accept/:id", auth, async (req, res) => {
  const request = await Appointment.findById(req.params.id);

  if (!request) return res.json({ msg: "Not found" });

  const exists = await Appointment.findOne({
    doctorId: request.doctorId,
    status: "accepted",
    startDate: { $lte: request.endDate },
    endDate: { $gte: request.startDate }
  });

  if (exists) return res.json({ msg: "Doctor already has overlapping appointment" });

  request.status = "accepted";
  request.appointmentDate = request.startDate; // or keep as is

  await request.save();

  res.json(request);
});

/* DOCTOR UPCOMING */

router.get("/appointments/upcoming/:doctorId", auth, async (req, res) => {
  const apps = await Appointment.find({
    doctorId: req.params.doctorId,
    status: "accepted",
    startDate: { $gte: new Date() }
  }).populate("patientId");

  res.json(apps);
});

export default router;