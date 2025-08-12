import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext'; // Adjust path
import { Pie, Bar } from 'react-chartjs-2';
import './Dashboard.css';

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js';

import KPICard from './KPICard';
import { fetchSimulationKPIs } from '../../api/api';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

const Dashboard = () => {
  const { token } = useContext(AuthContext);  // Get token here
  const [kpis, setKpis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) {
      setError("Not authorized");
      setLoading(false);
      return;
    }
    fetchSimulationKPIs(token)
      .then((res) => {
        setKpis(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.response?.data?.message || "Failed to fetch data");
        setLoading(false);
      });
  }, [token]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!kpis) return <p>No data available.</p>;

  const totalProfit = parseFloat(kpis.totalProfit) || 0;
  const efficiencyScore = parseFloat(kpis.efficiency) || 0;
  const lateDeliveries = (kpis.totalDeliveries || 0) - (kpis.onTimeDeliveries || 0);
  const baseFuelCost = kpis.orders
    ? kpis.orders.reduce((acc, order) => acc + (order.fuelCost || 0), 0)
    : 0;
  const trafficSurcharge = 0;

  const onTimeLateData = {
    labels: ['On-Time Deliveries', 'Late Deliveries'],
    datasets: [
      {
        data: [kpis.onTimeDeliveries || 0, lateDeliveries],
        backgroundColor: ['#4caf50', '#f44336'],
      },
    ],
  };

  const fuelCostData = {
    labels: ['Base Fuel Cost', 'Traffic Surcharge'],
    datasets: [
      {
        label: 'Fuel Cost Breakdown (₹)',
        data: [baseFuelCost, trafficSurcharge],
        backgroundColor: ['#2196f3', '#ff9800'],
      },
    ],
  };

  return (
    <div className="page-container">
      <h1>GreenCart Logistics Dashboard</h1>

      <div className="kpi-cards-container" style={{ display: 'flex', gap: '20px' }}>
        <KPICard title="Total Profit (₹)" value={totalProfit.toFixed(2)} />
        <KPICard title="Efficiency Score (%)" value={efficiencyScore.toFixed(2)} />
      </div>

      <div className="charts-container" style={{ display: 'flex', gap: '40px', marginTop: '40px' }}>
        <div className="chart" style={{ width: '400px' }}>
          <h3>On-Time vs Late Deliveries</h3>
          <Pie data={onTimeLateData} />
        </div>

        <div className="chart" style={{ width: '400px' }}>
          <h3>Fuel Cost Breakdown</h3>
          <Bar data={fuelCostData} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
