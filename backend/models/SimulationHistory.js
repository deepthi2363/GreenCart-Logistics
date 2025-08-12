import mongoose from 'mongoose';

const SimulationHistorySchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  totalProfit: Number,
  efficiency: Number,
  totalDeliveries: Number,
  onTimeDeliveries: Number,
  orders: [
    {
      orderId: mongoose.Schema.Types.Mixed,
      driverId: String,
      routeId: String,
      deliveryTimeMinutes: Number,
      latePenalty: Number,
      highValueBonus: Number,
      fuelCost: Number,
      profit: Number,
      onTime: Boolean,
    },
  ],
  driverWorkload: [Number],
});

const SimulationHistory = mongoose.model('SimulationHistory', SimulationHistorySchema);

export default SimulationHistory;
