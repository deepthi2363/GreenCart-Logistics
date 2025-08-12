import Order from "../models/Order.js";
import Driver from "../models/Driver.js";
import { getRouteById } from "./routesController.js"; // async function to get route by ID
import SimulationHistory from '../models/SimulationHistory.js';




let lastSimulationResult = null; // store last simulation result

export const simulateDelivery = async (req, res) => {
  try {
    const { availableDrivers, routeStartTime, maxHoursPerDriver } = req.body;

    if (
      !availableDrivers || availableDrivers <= 0 ||
      !routeStartTime || !maxHoursPerDriver || maxHoursPerDriver <= 0
    ) {
      return res.status(400).json({ error: { message: "Invalid simulation inputs" } });
    }

    const orders = await Order.find().lean();
    const drivers = await Driver.find().lean();

    if (availableDrivers > drivers.length) {
      return res.status(400).json({ error: { message: "Available drivers exceeds total drivers" } });
    }

    // Parse start time
    const [startHour, startMinute] = routeStartTime.split(":").map(Number);

    // Initialize workloads and fatigue factors
    const driverWorkload = Array(availableDrivers).fill(0);
    const driverFatigue = drivers.slice(0, availableDrivers).map(d => {
      const past7DayAvg = d.past7DayHours || 0;
      return past7DayAvg > 8 ? 0.7 : 1;
    });

    // Initialize driver available time to routeStartTime (Date objects)
    const driverAvailableTimes = [];
    for (let i = 0; i < availableDrivers; i++) {
      const date = new Date();
      date.setHours(startHour, startMinute, 0, 0);
      driverAvailableTimes.push(date.getTime());
    }

    let totalProfit = 0;
    let totalDeliveries = 0;
    let onTimeDeliveries = 0;
    const orderResults = [];

    // Assign orders dynamically respecting maxHoursPerDriver
    for (let i = 0; i < orders.length; i++) {
      // Find the next driver who can take this order (workload < max)
      let assignedDriverIndex = null;
      for (let d = 0; d < availableDrivers; d++) {
        if (driverWorkload[d] < maxHoursPerDriver) {
          assignedDriverIndex = d;
          break;
        }
      }
      if (assignedDriverIndex === null) {
        // No available driver with free hours -> skip remaining orders
        break;
      }

      const driverIndex = assignedDriverIndex;
      const route = await getRouteById(orders[i].assignedRoute);
      if (!route) {
        return res.status(400).json({ error: { message: `Route not found for order ${orders[i]._id}` } });
      }

      const speedFactor = driverFatigue[driverIndex];
      const baseTimeMin = route.base_time_min;
      const adjustedTimeMin = baseTimeMin / speedFactor;

      // Calculate delivery start and end times
      const deliveryStartTimeMs = driverAvailableTimes[driverIndex];
      const deliveryEndTimeMs = deliveryStartTimeMs + adjustedTimeMin * 60000;

      driverAvailableTimes[driverIndex] = deliveryEndTimeMs; // update driver's next available time

      const deliveryEndTime = new Date(deliveryEndTimeMs);

      // Calculate workload in hours
      const workloadHours = adjustedTimeMin / 60;
      driverWorkload[driverIndex] += workloadHours;

      // Calculate lateness in minutes compared to route start time
      const deliveryMinutesFromStart = (deliveryEndTime.getHours() - startHour) * 60 + (deliveryEndTime.getMinutes() - startMinute);

      const lateByMinutes = deliveryMinutesFromStart - (baseTimeMin + 10);
      const latePenalty = lateByMinutes > 0 ? 50 : 0;

      const highValueBonus = (orders[i].value_rs > 1000 && latePenalty === 0) ? orders[i].value_rs * 0.1 : 0;

      const trafficSurcharge = route.traffic_level === "High" ? 2 : 0;
      const fuelCost = (5 + trafficSurcharge) * route.distance_km;

      const profit = orders[i].value_rs + highValueBonus - latePenalty - fuelCost;

      totalProfit += profit;
      totalDeliveries++;
      if (latePenalty === 0) onTimeDeliveries++;

      orderResults.push({
        orderId: orders[i].order_id || orders[i]._id,
        driverId: drivers[driverIndex]._id,
        routeId: route._id,
        deliveryTimeMinutes: adjustedTimeMin,
        latePenalty,
        highValueBonus,
        fuelCost,
        profit,
        onTime: latePenalty === 0,
      });
    }

    const efficiency = totalDeliveries > 0 ? (onTimeDeliveries / totalDeliveries) * 100 : 0;

    const responsePayload = {
      totalProfit: totalProfit.toFixed(2),
      efficiency: efficiency.toFixed(2),
      totalDeliveries,
      onTimeDeliveries,
      orders: orderResults,
      driverWorkload,
    };

    lastSimulationResult = responsePayload; // store for GET
    // inside simulateDelivery after creating responsePayload:
    // Save simulation result to database
  try {
    const savedSimulation = new SimulationHistory(responsePayload);
    await savedSimulation.save();
    console.log('Simulation saved with id:', savedSimulation._id);
  } catch (err) {
    console.error('Failed to save simulation:', err);
    // optionally handle the error, but don't block response
  }


    return res.json(responsePayload);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: { message: "Server error during simulation" } });
  }
};


export const getSimulationKPIs = async (req, res) => {
  try {
    if (lastSimulationResult) {
      return res.json(lastSimulationResult);
    } else {
      return res.status(404).json({ error: { message: "No simulation data available. Run simulation first." } });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: { message: "Server error fetching KPIs" } });
  }
};
