import React, { useState } from 'react';
import { runSimulation } from '../../api/api';
import './Simulation.css'; 


const SimulationForm = ({ onSimulationComplete }) => {
  const [drivers, setDrivers] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [maxHours, setMaxHours] = useState('');

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!drivers || !startTime || !maxHours) {
      setError('All fields are required.');
      return;
    }
    if (drivers <= 0 || maxHours <= 0) {
      setError('Drivers and Max Hours must be positive numbers.');
      return;
    }

    setLoading(true);
    try {
      const response = await runSimulation({
        availableDrivers: Number(drivers),
        routeStartTime: startTime,
        maxHoursPerDriver: Number(maxHours),
      });
      onSimulationComplete(response.data);
    } catch {
      setError('Simulation failed. Please try again.');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="simulation-form">
      <div className="form-group">
        <label>Number of Available Drivers:</label>
        <input
          type="number"
          value={drivers}
          onChange={(e) => setDrivers(e.target.value)}
          min="1"
        />
      </div>
      <div className="form-group">
        <label>Route Start Time (HH:MM):</label>
        <input
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Max Hours per Driver per Day:</label>
        <input
          type="number"
          value={maxHours}
          onChange={(e) => setMaxHours(e.target.value)}
          min="1"
          max="24"
        />
      </div>
      {error && <p className="error">{error}</p>}
      <button type="submit" disabled={loading}>
        {loading ? 'Running Simulation...' : 'Run Simulation'}
      </button>
    </form>
  );
};

export default SimulationForm;
