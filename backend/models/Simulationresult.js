import mongoose from "mongoose";

const SimSchema = new mongoose.Schema({
  inputs: {
    availableDrivers: Number,
    routeStartTime: String,
    maxHoursPerDriver: Number
  },
  results: {
    totalProfit: Number,
    efficiencyScore: Number,
    onTimeDeliveries: Number,
    lateDeliveries: Number,
    fuelCostTotal: Number,
    orders: [{ orderId: String, profit: Number, penalty: Number, bonus: Number, fuelCost: Number, deliveredOnTime: Boolean }]
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("SimulationResult", SimSchema);
