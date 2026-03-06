import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient"
    },

    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor"
    },

    specialization: String,

    symptoms: [String],
    description: String,

    preferredDate: Date,
    startDate: Date,
    endDate: Date,

    status: {
      type: String,
      enum: ["pending", "accepted", "completed", "cancelled"],
      default: "pending"
    },

    appointmentDate: Date
  },
  { timestamps: true }
);

export default mongoose.model("AppointmentRequest", appointmentSchema);