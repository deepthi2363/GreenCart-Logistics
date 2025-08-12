import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import {
  getRoutes,
  getRouteById,
  createRoute,
  updateRoute,
  deleteRoute,
} from "../controllers/routesController.js";

const router = express.Router();

router.get("/", authMiddleware, getRoutes);
router.get("/:id", authMiddleware, getRouteById);
router.post("/", authMiddleware, createRoute);
router.put("/:id", authMiddleware, updateRoute);
router.delete("/:id", authMiddleware, deleteRoute);

export default router;
