import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

// Routes
import authRouter from "./routes/auth.js";
import driversRouter from "./routes/drivers.js";
import routesRouter from "./routes/routes.js";
import ordersRouter from "./routes/orders.js";
import authMiddleware from "./middlewares/authMiddleware.js";
import simulationRouter from "./routes/simulation.js";
import simulationHistoryRoutes from './routes/simulationHistoryRoutes.js';



dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));
app.use(express.json());




// Use routes
app.use("/api/auth", authRouter);
app.use("/api/drivers", driversRouter);
app.use("/api/routes", routesRouter);
app.use("/api/orders", ordersRouter);

// Example for simulation route (only accessible by manager)
app.use('/api/simulation', authMiddleware, simulationRouter);
app.use('/api', simulationHistoryRoutes);




const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on ${PORT}`));
  })
  .catch(err => {
    console.error("DB connection failed", err);
  });
