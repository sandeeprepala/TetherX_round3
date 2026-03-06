import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true },
    passwordHash: String,

    fullName: String,
    specialization: String,

    qualification: String,
    experienceYears: Number,

    hospitalName: String,
    city: String,

    availability: {
      startDate: Date,
      endDate: Date
    }
  },
  { timestamps: true }
);

export default mongoose.model("Doctor", doctorSchema);