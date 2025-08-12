// utils/simulation.js
/**
 * Simulation runner:
 * - drivers: array of driver documents
 * - routesMap: Map routeId -> route doc
 * - orders: array of order docs
 * - inputs: { availableDrivers, routeStartTime (HH:MM), maxHoursPerDriver }
 *
 * Returns: { totalProfit, efficiencyScore, onTimeDeliveries, lateDeliveries, fuelCostTotal, orders: [...] }
 */

export function runSimulation({ drivers, routesMap, orders, inputs }) {
  const { availableDrivers, routeStartTime, maxHoursPerDriver } = inputs;

  // validations (throw errors where appropriate)
  if (!Number.isInteger(availableDrivers) || availableDrivers <= 0) {
    const e = new Error("availableDrivers must be a positive integer");
    e.code = "INVALID_INPUT";
    throw e;
  }
  if (!/^\d{2}:\d{2}$/.test(routeStartTime)) {
    const e = new Error("routeStartTime must be HH:MM");
    e.code = "INVALID_INPUT";
    throw e;
  }

  // choose drivers to use: pick those with isActive true, sort by least recent hours etc.
  const candidateDrivers = drivers.filter(d=>d.isActive).slice(0, availableDrivers);
  if (candidateDrivers.length < availableDrivers) {
    // allowed, but warn — we'll proceed with as many drivers as available
  }

  // For round-robin assignment:
  let driverIndex = 0;

  const results = [];
  let totalProfit = 0;
  let onTimeCount = 0;
  let lateCount = 0;
  let fuelCostTotal = 0;

  // Helper: compute driver fatigue multiplier - if last day > 8 hrs, then next-day speed decreases by 30%
  function getDriverSpeedMultiplier(driver) {
    // look at most recent day in past7DaysHours (index 0 = oldest or newest depending on your choice)
    // We'll assume last element is most recent day.
    const last = (driver.past7DaysHours && driver.past7DaysHours.length) ? driver.past7DaysHours[driver.past7DaysHours.length - 1] : 0;
    if (last > 8) return 0.7; // speed decreases by 30% => times multiply by (1 / 0.7)? We'll interpret as they *take 30% longer* (times increase by 30%).
    // Clarify: The doc says "delivery speed decreases by 30% the next day".
    // Interpreting: speed decreases by 30% means deliveries take 1/0.7 longer? Safer: multiply time by 1/ (1 - 0.3) = 1/0.7 => ~1.428
    // To keep interpretation consistent, we'll treat it as times increase by 30% (multiplier 1.3).
    // So we will return 1.3 if fatigued, else 1.
  }

  // We'll use timeMultiplier = 1.3 if last day worked >8 else 1.0
  function getTimeMultiplier(driver) {
    const last = (driver.past7DaysHours && driver.past7DaysHours.length) ? driver.past7DaysHours[driver.past7DaysHours.length - 1] : 0;
    return last > 8 ? 1.3 : 1.0;
  }

  for (const order of orders) {
    // route might be ObjectId; we assume routesMap keyed by route._id or route.routeId - ensure consistency
    const route = routesMap.get(String(order.assignedRoute)) || routesMap.get(order.assignedRoute?.toString());
    if (!route) {
      // skip or throw - we'll treat as skip with penalty
      continue;
    }

    // assign driver round-robin (if no drivers, assign null -> all orders late)
    const driver = candidateDrivers.length > 0 ? candidateDrivers[driverIndex % candidateDrivers.length] : null;
    driverIndex += 1;

    // base time:
    const baseTime = route.baseTimeMinutes; // minutes

    // compute time multiplier for driver fatigue:
    const timeMultiplier = driver ? getTimeMultiplier(driver) : 1.0;
    const actualTimeMinutes = Math.round(baseTime * timeMultiplier);

    // compute if late: late if actual > base + 10
    const deliveredOnTime = actualTimeMinutes <= (baseTime + 10);

    // penalties
    const penalty = deliveredOnTime ? 0 : 50;

    // bonus
    const bonus = (order.valueRs > 1000 && deliveredOnTime) ? (order.valueRs * 0.10) : 0;

    // fuel cost:
    let perKm = 5;
    if (route.trafficLevel === "High") perKm += 2; // +2/km
    const fuelCost = perKm * route.distanceKm;

    // profit for this order:
    const profit = (order.valueRs + bonus - penalty - fuelCost);

    totalProfit += profit;
    fuelCostTotal += fuelCost;
    if (deliveredOnTime) onTimeCount += 1; else lateCount += 1;

    results.push({
      orderId: order.orderId,
      assignedDriver: driver ? driver._id : null,
      baseTimeMinutes: baseTime,
      actualTimeMinutes,
      deliveredOnTime,
      penalty,
      bonus,
      fuelCost,
      profit
    });

    // Update driver hours tracking (we should add actual time in hours to current shift)
    // but do not persist here because this util is pure; persist in controller if desired
  }

  const totalDeliveries = results.length;
  const efficiencyScore = totalDeliveries === 0 ? 0 : (onTimeCount / totalDeliveries) * 100;

  return {
    totalProfit: Number(totalProfit.toFixed(2)),
    efficiencyScore: Number(efficiencyScore.toFixed(2)),
    onTimeDeliveries: onTimeCount,
    lateDeliveries: lateCount,
    fuelCostTotal: Number(fuelCostTotal.toFixed(2)),
    orders: results
  };
}
