import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    senderRole: {
      type: String,
      enum: ["patient", "doctor"],
      required: true
    },
    text: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { _id: false }
);

const querySchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true
    },

    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor"
    },

    // Snapshot of patient details at the time of query
    patientSnapshot: {
      name: String,
      age: String,
      gender: String
    },

    symptoms: [String],
    severity: String,
    duration: String,
    notes: String,

    status: {
      type: String,
      enum: ["Under Review", "Responded", "Closed"],
      default: "Under Review"
    },

    messages: [messageSchema]
  },
  { timestamps: true }
);

export default mongoose.model("Query", querySchema);

