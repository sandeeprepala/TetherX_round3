import express from "express";
import Appointment from "../models/AppointmentRequest.js";
import Doctor from "../models/Doctor.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

/* REQUEST APPOINTMENT TO ALL DOCTORS */

router.post("/request/all", auth, async (req, res) => {
  try {
    const { patientId, specialization, startDate, endDate, symptoms } = req.body;

    const start = new Date(startDate);
    const end = new Date(endDate);

    // 1️⃣ find all doctors of specialization
    const doctors = await Doctor.find({ specialization });

    const requests = [];

    for (const doctor of doctors) {

      // 2️⃣ check overlapping accepted appointment
      const overlap = await Appointment.findOne({
        doctorId: doctor._id,
        status: "accepted",
        startDate: { $lte: end },
        endDate: { $gte: start }
      });

      // 3️⃣ if no overlap → create request
      if (!overlap) {
        const reqDoc = await Appointment.create({
          patientId,
          doctorId: doctor._id,
          specialization,
          startDate: start,
          endDate: end,
          symptoms
        });

        requests.push(reqDoc);
      }
    }

    res.json({
      message: "Requests sent",
      requests
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

/* REQUEST SPECIFIC DOCTOR */

router.post("/request/doctor", auth, async (req, res) => {
  const { patientId, doctorId, startDate, endDate, symptoms } = req.body;

  const start = new Date(startDate);
  const end = new Date(endDate);

  const doctor = await Doctor.findById(doctorId);

  if (!doctor) return res.status(404).json({ msg: "Doctor not found" });

  if (!doctor.availability) return res.json({ msg: "Doctor availability not set" });

  // Check if appointment dates are within doctor's availability
  if (
    start < doctor.availability.startDate ||
    end > doctor.availability.endDate
  ) {
    return res.json({ msg: "Doctor unavailable on that date range" });
  }

  // Check for overlapping accepted appointments
  const overlap = await Appointment.findOne({
    doctorId,
    status: "accepted",
    startDate: { $lte: end },
    endDate: { $gte: start }
  });

  if (overlap) return res.json({ msg: "Doctor has overlapping appointment" });

  const reqDoc = await Appointment.create({
    patientId,
    doctorId,
    specialization: doctor.specialization,
    startDate: start,
    endDate: end,
    symptoms
  });

  res.json(reqDoc);
});

/* PATIENT UPCOMING
   Includes both pending and accepted future appointments so that
   newly created requests are visible on the patient's dashboard. */

router.get("/appointments/upcoming/:patientId", auth, async (req, res) => {
  const appointments = await Appointment.find({
    patientId: req.params.patientId,
    startDate: { $gte: new Date() },
    status: { $in: ["pending", "accepted"] }
  }).populate("doctorId");

  res.json(appointments);
});

/* PATIENT PAST */

router.get("/appointments/past/:patientId", auth, async (req, res) => {
  const appointments = await Appointment.find({
    patientId: req.params.patientId,
    endDate: { $lt: new Date() }
  }).populate("doctorId");

  res.json(appointments);
});

export default router;