import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  valueRs: { type: Number, required: true },
  assignedRoute: { type: mongoose.Schema.Types.ObjectId, ref: "Route", required: true },
  deliveryTimestamp: { type: Date, required: true }, // planned or actual? use for sorting
  status: { type: String, enum: ["Pending","Assigned","Delivered"], default: "Pending" },
  assignedDriver: { type: mongoose.Schema.Types.ObjectId, ref: "Driver" }, // optional
  actualDeliveryTimeMinutes: { type: Number } // to store simulated actual time (minutes)
}, { timestamps: true });

export default mongoose.model("Order", OrderSchema);
