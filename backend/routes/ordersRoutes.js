import express from "express";
import { createOrder, updateOrder, getOrders } from "../controllers/ordersController.js";
import { validateBody } from "../middlewares/validate.js";
import { createOrderSchema, updateOrderSchema } from "../validations/orderValidation.js";

const router = express.Router();

// Validate input when creating an order
router.post("/", validateBody(createOrderSchema), createOrder);

// Validate input when updating an order
router.put("/:id", validateBody(updateOrderSchema), updateOrder);

// Normal GET route
router.get("/", getOrders);

export default router;
