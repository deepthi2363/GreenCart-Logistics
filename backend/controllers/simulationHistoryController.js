import SimulationHistory from '../models/SimulationHistory.js';

export async function getSimulationHistory(req, res) {
  try {
    const histories = await SimulationHistory.find().sort({ createdAt: -1 });
    res.status(200).json(histories);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching simulation history', error });
  }
}
