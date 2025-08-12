import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import {
  getDrivers,
  getDriverById,
  createDriver,
  updateDriver,
  deleteDriver,
} from "../controllers/driversController.js";

const router = express.Router();

router.get("/", authMiddleware, getDrivers);
router.get("/:id", authMiddleware, getDriverById);
router.post("/", authMiddleware, createDriver);
router.put("/:id", authMiddleware, updateDriver);
router.delete("/:id", authMiddleware, deleteDriver);

export default router;
