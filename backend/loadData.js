import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import fs from "fs";

import Driver from "./models/Driver.js";
import Route from "./models/Route.js";
import Order from "./models/Order.js";

const MONGO = process.env.MONGO_URI;

async function load() {
  if (!MONGO) {
    throw new Error("❌ MONGO_URI is not defined in environment variables");
  }

  await mongoose.connect(MONGO);
  console.log("✅ MongoDB connected");

  // Load JSON
  const raw = JSON.parse(fs.readFileSync("./intial_data.json", "utf-8"));
  const { drivers, routes, orders } = raw;

  // Clear collections
  await Driver.deleteMany({});
  await Route.deleteMany({});
  await Order.deleteMany({});

  // Insert drivers
  await Driver.insertMany(drivers);

  // Insert routes & create routeId → ObjectId map
  const routeDocs = await Route.insertMany(routes);
  const routeMap = {};
  routeDocs.forEach(r => {
    routeMap[r.routeId] = r._id;
  });

  // Replace routeId strings with ObjectIds in orders
  const ordersWithIds = orders.map(o => ({
    ...o,
    assignedRoute: routeMap[o.assignedRoute]
  }));

  // Insert orders
  await Order.insertMany(ordersWithIds);

  console.log("✅ Data loaded successfully");
  await mongoose.disconnect();
  process.exit(0);
}

load().catch(e => {
  console.error("❌ Error:", e);
  process.exit(1);
});
