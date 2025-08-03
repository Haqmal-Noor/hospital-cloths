import mongoose from "mongoose";

const personProfileSchema = new mongoose.Schema(
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
      enum: ["male", "female", "other"],
      required: true,
    },
    age: {
      type: Number,
    },
    measurements: {
      chest: Number,
      waist: Number,
      hip: Number,
      inseam: Number,
      sleeveLength: Number,
      shoulderWidth: Number,
      neck: Number,
      height: Number,
      weight: Number,
    },
    notes: {
      type: String,
      maxlength: 500,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const PersonProfile = mongoose.model("PersonProfile", personProfileSchema);
export default PersonProfile;
