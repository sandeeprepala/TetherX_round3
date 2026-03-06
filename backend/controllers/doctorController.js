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

    if (!request) return res.status(404).json({ msg: "Not found" });

    // Prevent accepting past requests
    if (request.endDate && request.endDate < new Date()) {
      return res.status(400).json({ msg: "Cannot accept past appointment request" });
    }

    // If already accepted by another doctor, block
    if (
      request.status === "accepted" &&
      request.doctorId &&
      request.doctorId.toString() !== doctorId
    ) {
      return res.status(400).json({ msg: "Request already accepted by another doctor" });
    }

    request.doctorId = doctorId;

    const exists = await Appointment.findOne({
      doctorId,
      status: "accepted",
      startDate: { $lte: request.endDate },
      endDate: { $gte: request.startDate },
      _id: { $ne: request._id }
    });

    if (exists) return res.json({ msg: "Doctor already has overlapping appointment" });

    request.status = "accepted";
    request.appointmentDate = request.startDate; // or keep as is

    await request.save();

    const populated = await request.populate("patientId");

    res.json(populated);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Server error" });
  }
});

/* DOCTOR UPCOMING (ACCEPTED ONLY) */

router.get("/appointments/upcoming/:doctorId", auth, async (req, res) => {
  const apps = await Appointment.find({
    doctorId: req.params.doctorId,
    status: "accepted",
    startDate: { $gte: new Date() }
  }).populate("patientId");

  res.json(apps);
});

/* DOCTOR PENDING REQUESTS
   All pending future appointment requests for this doctor's specialization
   (department). This ensures doctors see every request in their department,
   even if it hasn't been explicitly assigned to a specific doctor yet. */

router.get("/appointments/pending/:doctorId", auth, async (req, res) => {
  const doctor = await Doctor.findById(req.params.doctorId);
  if (!doctor) return res.status(404).json({ msg: "Doctor not found" });

  const apps = await Appointment.find({
    specialization: doctor.specialization,
    status: "pending",
    startDate: { $gte: new Date() }
  }).populate("patientId");

  res.json(apps);
});

export default router;