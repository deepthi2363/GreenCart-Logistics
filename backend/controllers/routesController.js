import Route from "../models/Route.js";

// GET all routes
export const getRoutes = async (req, res) => {
  try {
    const routes = await Route.find();
    res.json(routes);
  } catch (err) {
    res.status(500).json({ error: { message: err.message } });
  }
};

// GET route by ID (async)
export const getRouteById = async (id) => {
  if (!id) {
    console.log("getRouteById: id is missing");
    return null;
  }
  try {
    const route = await Route.findById(id).lean();
    return route;
  } catch (err) {
    console.log("getRouteById error:", err);
    return null;
  }
};

// CREATE new route
export const createRoute = async (req, res) => {
  try {
    const route = new Route(req.body);
    await route.save();
    res.status(201).json(route);
  } catch (err) {
    res.status(400).json({ error: { message: err.message } });
  }
};

// UPDATE route by ID
export const updateRoute = async (req, res) => {
  try {
    const route = await Route.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!route) return res.status(404).json({ error: { message: "Route not found" } });
    res.json(route);
  } catch (err) {
    res.status(400).json({ error: { message: err.message } });
  }
};

// DELETE route by ID
export const deleteRoute = async (req, res) => {
  try {
    const route = await Route.findByIdAndDelete(req.params.id);
    if (!route) return res.status(404).json({ error: { message: "Route not found" } });
    res.json({ message: "Route deleted" });
  } catch (err) {
    res.status(500).json({ error: { message: err.message } });
  }
};
