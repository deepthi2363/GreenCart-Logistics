import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api'; // Update as per your backend URL

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Interceptor to add token header dynamically (you can customize it)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const loginUser = (credentials) => api.post("/auth/login", credentials);
export const registerUser = (data) => api.post("/auth/register", data);


// Dashboard KPIs fetch
export const fetchSimulationKPIs = () => api.get('/simulation');

// Run simulation
export const runSimulation = (data) => api.post('/simulation', data);

// simulation history
export const fetchSimulationHistory = () => axios.get('/api/simulations/history');

// CRUD Drivers
export const fetchDrivers = () => api.get('/drivers');
export const addDriver = (driver) => api.post('/drivers', driver);
export const updateDriver = (id, driver) => api.put(`/drivers/${id}`, driver);
export const deleteDriver = (id) => api.delete(`/drivers/${id}`);

// CRUD Routes
export const fetchRoutes = () => api.get('/routes');
export const addRoute = (route) => api.post('/routes', route);
export const updateRoute = (id, route) => api.put(`/routes/${id}`, route);
export const deleteRoute = (id) => api.delete(`/routes/${id}`);

// CRUD Orders
export const fetchOrders = () => api.get('/orders');
export const addOrder = (order) => api.post('/orders', order);
export const updateOrder = (id, order) => api.put(`/orders/${id}`, order);
export const deleteOrder = (id) => api.delete(`/orders/${id}`);

export default api;
