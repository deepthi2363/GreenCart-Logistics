import mongoose from "mongoose";

const DriverSchema = new mongoose.Schema({
  name: { type: String, required: true },
  currentShiftHours: { type: Number, default: 0 }, // hours in current shift
  past7DaysHours: [{ type: Number }], // array of last 7 day hours (length up to 7)
  // optional: availability boolean
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model("Driver", DriverSchema);
