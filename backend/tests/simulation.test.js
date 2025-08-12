import { runSimulation } from "../utils/simulation.js";

test("applies high value bonus only when on time", () => {
  const drivers = [{ _id: "d1", name: "A", past7DaysHours: [9], isActive: true }];
  const route = { _id: "r1", routeId: "r1", distanceKm: 10, trafficLevel: "Low", baseTimeMinutes: 20 };
  const routeMap = new Map([["r1", route]]);
  const orders = [{ orderId: "o1", valueRs: 1500, assignedRoute: "r1", deliveryTimestamp: new Date().toISOString() }];

  const res = runSimulation({ drivers, routesMap: routeMap, orders, inputs: { availableDrivers: 1, routeStartTime: "09:00", maxHoursPerDriver: 8 }});
  // since driver fatigued (past7DaysHours last = 9) -> timeMultiplier 1.3 -> actualTime = 26 -> base + 10 = 30 -> delivered on time -> bonus applies
  expect(res.orders[0].bonus).toBeGreaterThan(0);
});
// exampleeeeeeeee