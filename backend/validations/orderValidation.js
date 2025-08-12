// validations/orderValidation.js
import Joi from "joi";

export const createOrderSchema = Joi.object({
  order_id: Joi.number().integer().positive().required(),
  value_rs: Joi.number().positive().required(),
  route_id: Joi.number().integer().positive().required(),
  delivery_time: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/).required(), // HH:MM 24h format
  status: Joi.string().valid("Pending", "Delivered", "Cancelled").required(),
  deliveryTimestamp: Joi.date().iso(), // optional ISO date string
});

export const updateOrderSchema = Joi.object({
  order_id: Joi.number().integer().positive(),
  value_rs: Joi.number().positive(),
  route_id: Joi.number().integer().positive(),
  delivery_time: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/),
  status: Joi.string().valid("Pending", "Delivered", "Cancelled"),
  deliveryTimestamp: Joi.date().iso(),
}).min(1);
