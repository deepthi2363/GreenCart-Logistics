import mongoose from "mongoose";
import Order from "../models/Order.js";

// GET all orders
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: { message: err.message } });
  }
};

// GET order by ID
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: { message: "Order not found" } });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: { message: err.message } });
  }
};

// CREATE order with field transformations


export const createOrder = async (req, res) => {
  try {
    const { order_id, value_rs, route_id, delivery_time, status } = req.body;

    const [hours, minutes] = delivery_time.split(":");

    const deliveryTimestamp = new Date();
    deliveryTimestamp.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    const orderData = {
      orderId: order_id,
      valueRs: value_rs,
      assignedRoute: mongoose.Types.ObjectId(route_id),
      deliveryTimestamp,
      status,
    };

    const order = new Order(orderData);
    await order.save();

    res.status(201).json(order);
  } catch (err) {
    console.error("createOrder error:", err);
    res.status(400).json({ error: { message: err.message } });
  }
};



// UPDATE order
export const updateOrder = async (req, res) => {
  try {
    // Optional: Transform fields in req.body if needed (similar to create)
    const updatedData = { ...req.body };

    // If delivery_time is present in update, convert to Date object
    if (updatedData.delivery_time) {
      const [hours, minutes] = updatedData.delivery_time.split(":");
      const deliveryTimestamp = new Date();
      deliveryTimestamp.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      updatedData.deliveryTimestamp = deliveryTimestamp;
      delete updatedData.delivery_time;
    }

    // Similarly transform snake_case to camelCase if present
    if (updatedData.order_id !== undefined) {
      updatedData.orderId = updatedData.order_id;
      delete updatedData.order_id;
    }
    if (updatedData.value_rs !== undefined) {
      updatedData.valueRs = updatedData.value_rs;
      delete updatedData.value_rs;
    }
    if (updatedData.route_id !== undefined) {
      updatedData.assignedRoute = updatedData.route_id;
      delete updatedData.route_id;
    }

    const order = await Order.findByIdAndUpdate(req.params.id, updatedData, { new: true });
    if (!order) return res.status(404).json({ error: { message: "Order not found" } });

    res.json(order);
  } catch (err) {
    res.status(400).json({ error: { message: err.message } });
  }
};

// DELETE order
export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ error: { message: "Order not found" } });
    res.json({ message: "Order deleted" });
  } catch (err) {
    res.status(500).json({ error: { message: err.message } });
  }
};
