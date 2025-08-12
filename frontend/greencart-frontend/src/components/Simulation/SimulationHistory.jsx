import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function SimulationHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHistory() {
      try {
        const response = await axios.get('/api/simulation-history');
        setHistory(response.data);
      } catch (error) {
        console.error('Error fetching history:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchHistory();
  }, []);

  if (loading) return <p>Loading simulation history...</p>;
  if (history.length === 0) return <p>No simulation history found.</p>;

  return (
    <div>
      <h2>Simulation History</h2>
      <ul>
        {history.map(item => (
          <li key={item._id} style={{ marginBottom: '20px', borderBottom: '1px solid #ccc' }}>
            <strong>Total Profit:</strong> {item.totalProfit} <br />
            <strong>Efficiency:</strong> {item.efficiency} <br />
            <strong>Total Deliveries:</strong> {item.totalDeliveries} <br />
            <strong>On-time Deliveries:</strong> {item.onTimeDeliveries} <br />
            <strong>Number of Orders:</strong> {item.orders.length} <br />
            <details>
              <summary>Orders Details</summary>
              <ul>
                {item.orders.map(order => (
                  <li key={order._id}>
                    Order ID: {order.orderId}, Profit: {order.profit}, On Time: {order.onTime ? 'Yes' : 'No'}
                  </li>
                ))}
              </ul>
            </details>
          </li>
        ))}
      </ul>
    </div>
  );
}
