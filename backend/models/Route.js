import mongoose from "mongoose";

const RouteSchema = new mongoose.Schema({
  routeId: { type: String, required: true, unique: true },
  distanceKm: { type: Number, required: true },
  trafficLevel: { type: String, enum: ["Low","Medium","High"], default: "Medium" },
  baseTimeMinutes: { type: Number, required: true } // base time in minutes
}, { timestamps: true });

export default mongoose.model("Route", RouteSchema);
