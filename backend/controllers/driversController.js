import Driver from "../models/Driver.js";

// GET all drivers
export const getDrivers = async (req, res) => {
  try {
    const drivers = await Driver.find();
    res.json(drivers);
  } catch (err) {
    res.status(500).json({ error: { message: err.message } });
  }
};

// GET driver by ID
export const getDriverById = async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id);
    if (!driver) return res.status(404).json({ error: { message: "Driver not found" } });
    res.json(driver);
  } catch (err) {
    res.status(500).json({ error: { message: err.message } });
  }
};

// CREATE new driver
export const createDriver = async (req, res) => {
  try {
    const driver = new Driver(req.body);
    await driver.save();
    res.status(201).json(driver);
  } catch (err) {
    res.status(400).json({ error: { message: err.message } });
  }
};

// UPDATE driver by ID
export const updateDriver = async (req, res) => {
  try {
    const driver = await Driver.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!driver) return res.status(404).json({ error: { message: "Driver not found" } });
    res.json(driver);
  } catch (err) {
    res.status(400).json({ error: { message: err.message } });
  }
};

// DELETE driver by ID
export const deleteDriver = async (req, res) => {
  try {
    const driver = await Driver.findByIdAndDelete(req.params.id);
    if (!driver) return res.status(404).json({ error: { message: "Driver not found" } });
    res.json({ message: "Driver deleted" });
  } catch (err) {
    res.status(500).json({ error: { message: err.message } });
  }
};
