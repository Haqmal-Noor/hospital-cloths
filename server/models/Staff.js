import mongoose from "mongoose";

const StaffSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: ["male", "female"],
      required: true,
    },
    age: {
      type: Number,
    },
    phone: {
      type: String,
    },
    department: {
      type: String,
    },
    role: {
      type: String,
    },
    employmentStatus: {
      type: String,
      enum: ["active", "resigned"],
      default: "active",
    },
    measurements: {
      chest: String,
      waist: String,
      hip: String,
      inseam: String,
      sleeveLength: String,
      shoulderWidth: String,
      neck: String,
      height: String,
      weight: String,
      armLength: String,
      thigh: String,
      calf: String,
      wrist: String,
      ankle: String,
    },
    notes: {
      type: String,
      maxlength: 1000,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Staff = mongoose.model("Staff", StaffSchema);
export default Staff;
