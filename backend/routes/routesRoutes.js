import express from "express";
import { createRoute, updateRoute, getRoutes } from "../controllers/routesController.js";
import { validateBody } from "../middlewares/validate.js";
import { createRouteSchema, updateRouteSchema } from "../validations/routeValidation.js";

const router = express.Router();

// Validate the request body before creating a new route
router.post("/", validateBody(createRouteSchema), createRoute);

// Validate the request body before updating an existing route
router.put("/:id", validateBody(updateRouteSchema), updateRoute);

// You can still have normal routes without validation
router.get("/", getRoutes);

export default router;
