import express from "express";
import { simulateDelivery, getSimulationKPIs } from "../controllers/simulationController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();


router.post("/", authMiddleware, simulateDelivery);
router.get("/", authMiddleware, getSimulationKPIs);  // <-- Add this GET route

export default router;
