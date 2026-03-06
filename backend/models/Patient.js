import mongoose from "mongoose";

const patientSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true },
    passwordHash: String,

    fullName: String,
    age: Number,
    gender: String,

    phone: String,
    city: String,
    bloodGroup: String
  },
  { timestamps: true }
);

export default mongoose.model("Patient", patientSchema);