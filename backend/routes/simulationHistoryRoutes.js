import express from 'express';
import { getSimulationHistory } from '../controllers/simulationHistoryController.js';

const router = express.Router();

router.get('/simulation-history', getSimulationHistory);

export default router;
