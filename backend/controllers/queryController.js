import express from "express";
import { auth } from "../middleware/auth.js";
import Query from "../models/Query.js";
import Doctor from "../models/Doctor.js";

const router = express.Router();

/* Create a new medical query (patient only) */
router.post("/", auth, async (req, res) => {
  try {
    const { id, role } = req.user || {};
    if (role !== "patient") {
      return res.status(403).json({ msg: "Only patients can create queries" });
    }

    const { name, age, gender, symptoms, severity, duration, notes } = req.body;

    const query = await Query.create({
      patientId: id,
      patientSnapshot: { name, age, gender },
      symptoms: Array.isArray(symptoms) ? symptoms : [],
      severity: severity || "",
      duration: duration || "",
      notes: notes || "",
      status: "Under Review",
      messages: notes
        ? [{ senderRole: "patient", text: notes }]
        : []
    });

    const populated = await query.populate("patientId doctorId");

    res.json(populated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

/* List queries for the logged-in patient */
router.get("/patient", auth, async (req, res) => {
  try {
    const { id, role } = req.user || {};
    if (role !== "patient") {
      return res.status(403).json({ msg: "Only patients can view their queries" });
    }

    const queries = await Query.find({ patientId: id })
      .sort({ createdAt: -1 })
      .populate("doctorId");

    res.json(queries);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

/* List queries visible to a doctor.
   For now we show:
   - queries already assigned to this doctor, OR
   - any "Under Review" queries that match their specialization. */
router.get("/doctor", auth, async (req, res) => {
  try {
    const { id, role } = req.user || {};
    if (role !== "doctor") {
      return res.status(403).json({ msg: "Only doctors can view queries" });
    }

    const doctor = await Doctor.findById(id);
    if (!doctor) return res.status(404).json({ msg: "Doctor not found" });

    const queries = await Query.find({
      $or: [
        { doctorId: id },
        {
          status: "Under Review",
          // match department by specialization if present
          // we stored specialization indirectly via symptoms/notes, so this
          // condition is currently a no-op but kept for future extension.
        }
      ]
    })
      .sort({ createdAt: -1 })
      .populate("patientId doctorId");

    res.json(queries);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

/* Doctor replies to a query */
router.post("/:id/reply", auth, async (req, res) => {
  try {
    const { id: userId, role } = req.user || {};
    if (role !== "doctor") {
      return res.status(403).json({ msg: "Only doctors can reply" });
    }

    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ msg: "Reply text is required" });
    }

    const query = await Query.findById(req.params.id);
    if (!query) return res.status(404).json({ msg: "Query not found" });

    query.doctorId = userId;
    query.messages.push({ senderRole: "doctor", text });
    query.status = "Responded";

    await query.save();

    const populated = await query.populate("patientId doctorId");

    res.json(populated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

export default router;

