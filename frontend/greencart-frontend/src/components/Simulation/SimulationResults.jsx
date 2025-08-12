import React from 'react';

function SimulationResults({ data }) {
  if (!data) return null; // or some message

  return (
    <div style={{ marginTop: '2rem' }}>
      <h2>Simulation Summary</h2>
      <ul>
        <li><strong>Total Profit:</strong> ₹{data.totalProfit}</li>
        <li><strong>Efficiency:</strong> {data.efficiency}%</li>
        <li><strong>Total Deliveries:</strong> {data.totalDeliveries}</li>
        <li><strong>On-time Deliveries:</strong> {data.onTimeDeliveries}</li>
      </ul>

      <h3>Orders</h3>
      <table style={{ border: '1px solid black', width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid black' }}>Order ID</th>
            <th style={{ border: '1px solid black' }}>Driver ID</th>
            <th style={{ border: '1px solid black' }}>Route ID</th>
            <th style={{ border: '1px solid black' }}>Delivery Time (min)</th>
            <th style={{ border: '1px solid black' }}>Late Penalty (₹)</th>
            <th style={{ border: '1px solid black' }}>Bonus (₹)</th>
            <th style={{ border: '1px solid black' }}>Fuel Cost (₹)</th>
            <th style={{ border: '1px solid black' }}>Profit (₹)</th>
            <th style={{ border: '1px solid black' }}>On Time?</th>
          </tr>
        </thead>
        <tbody>
          {data.orders.map(order => (
            <tr key={order.orderId}>
              <td style={{ border: '1px solid black', padding: '4px' }}>{order.orderId}</td>
              <td style={{ border: '1px solid black', padding: '4px' }}>{order.driverId}</td>
              <td style={{ border: '1px solid black', padding: '4px' }}>{order.routeId}</td>
              <td style={{ border: '1px solid black', padding: '4px' }}>{order.deliveryTimeMinutes}</td>
              <td style={{ border: '1px solid black', padding: '4px' }}>{order.latePenalty}</td>
              <td style={{ border: '1px solid black', padding: '4px' }}>{order.highValueBonus.toFixed(2)}</td>
              <td style={{ border: '1px solid black', padding: '4px' }}>{order.fuelCost}</td>
              <td style={{ border: '1px solid black', padding: '4px' }}>{order.profit.toFixed(2)}</td>
              <td style={{ border: '1px solid black', padding: '4px' }}>{order.onTime ? "✅" : "❌"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Driver Workload (hours)</h3>
      <ul>
        {data.driverWorkload.map((hours, idx) => (
          <li key={idx}>Driver {idx + 1}: {hours.toFixed(2)} hrs</li>
        ))}
      </ul>
    </div>
  );
}

export default SimulationResults;
