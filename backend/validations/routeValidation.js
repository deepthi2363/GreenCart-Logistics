// validations/routeValidation.js
import Joi from "joi";

export const createRouteSchema = Joi.object({
  routeId: Joi.string().required(),
  distance_km: Joi.number().positive().required(),
  traffic_level: Joi.string().valid("Low", "Medium", "High").required(),
  base_time_min: Joi.number().positive().required(),
});

export const updateRouteSchema = Joi.object({
  routeId: Joi.string(),
  distance_km: Joi.number().positive(),
  traffic_level: Joi.string().valid("Low", "Medium", "High"),
  base_time_min: Joi.number().positive(),
}).min(1); // Require at least one field to update
