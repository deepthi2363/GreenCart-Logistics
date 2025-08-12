import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, NavLink, Navigate } from "react-router-dom";
import './styles/global.css';
import './components/Layout/Navbar.css';




import Dashboard from './components/Dashboard/Dashboard';
import SimulationForm from './components/Simulation/SimulationForm';
import SimulationResults from './components/Simulation/SimulationResults'; 
import SimulationHistory from './components/Simulation/SimulationHistory';

import Drivers from './components/Management/Drivers';
import RoutesPage from './components/Management/Routes';
import Orders from './components/Management/Orders';

import OrdersManagement from './pages/OrdersManagement';  // Adjust the path based on where you put it

import Login from "./components/Auth/Login";
import { AuthContext } from "./context/AuthContext";

const SimulationPage = () => {
  const [simulationResult, setSimulationResult] = React.useState(null);

  return (
    <div className="page-container">
      <h1>Run Simulation</h1>
      <SimulationForm onSimulationComplete={setSimulationResult} />
      {simulationResult && (
        <div className="simulation-result">
          <h2>Simulation Results</h2>
          {/* Replace plain JSON with your table */}
          <SimulationResults data={simulationResult} />
        </div>
      )}
    </div>
  );
};

function App() {
  const { token, logout, user } = useContext(AuthContext);

  if (!token) {
    // If not logged in, show login page
    return <Login />;
  }

  return (
    <Router>
      <nav className="navbar">
        <NavLink to="/" end className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>Dashboard</NavLink>
        <NavLink to="/simulation" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>Simulation</NavLink>
        <NavLink to="/simulation/history" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')} > Simulation History </NavLink>


        <NavLink to="/management/drivers" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>Drivers</NavLink>
        <NavLink to="/management/routes" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>Routes</NavLink>
        <NavLink to="/management/orders" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>Orders</NavLink>

        <button onClick={logout} style={{ marginLeft: "auto" }}>
          Logout ({user?.username})
        </button>
      </nav>

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/simulation" element={<SimulationPage />} />
        <Route path="/simulation/history" element={<SimulationHistory />} />


        <Route path="/management/drivers" element={<Drivers />} />
        <Route path="/management/routes" element={<RoutesPage />} />
        <Route path="/management/orders" element={<OrdersManagement />} />

        {/* Redirect unknown routes to dashboard */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
