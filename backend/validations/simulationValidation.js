// validations/simulationValidation.js
import Joi from "joi";

export const simulationSchema = Joi.object({
  availableDrivers: Joi.number().integer().positive().required(),
  routeStartTime: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/).required(),
  maxHoursPerDriver: Joi.number().positive().required(),
});
