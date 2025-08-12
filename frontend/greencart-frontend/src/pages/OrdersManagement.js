import React, { useEffect, useState } from 'react';
import axios from 'axios';

const token = localStorage.getItem('authToken');

export default function OrdersCRUD() {
  const [mode, setMode] = useState('view'); // default to 'view'
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    orderId: '',
    driverId: '',
    routeId: '',
    deliveryTimeMinutes: '',
    latePenalty: '',
    highValueBonus: '',
    fuelCost: '',
    profit: '',
    onTime: false,
  });

  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    setLoading(true);
    try {
      const res = await axios.get('/api/orders', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data);
    } catch (err) {
      console.error('Fetch orders error:', err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setFormData({
      orderId: '',
      driverId: '',
      routeId: '',
      deliveryTimeMinutes: '',
      latePenalty: '',
      highValueBonus: '',
      fuelCost: '',
      profit: '',
      onTime: false,
    });
    setSelectedOrder(null);
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }

  async function createOrder(e) {
    e.preventDefault();
    try {
      await axios.post('/api/orders', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Order created!');
      resetForm();
      fetchOrders();
      setMode('view');
    } catch (err) {
      console.error('Create order error:', err);
      alert('Error creating order');
    }
  }

  async function updateOrder(e) {
    e.preventDefault();
    if (!selectedOrder) return alert('Select an order to update');
    try {
      await axios.put(`/api/orders/${selectedOrder._id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Order updated!');
      resetForm();
      fetchOrders();
      setMode('view');
    } catch (err) {
      console.error('Update order error:', err);
      alert('Error updating order');
    }
  }

  async function deleteOrder(orderId) {
    if (!window.confirm('Are you sure you want to delete this order?')) return;
    try {
      await axios.delete(`/api/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Order deleted!');
      fetchOrders();
      setMode('view');
    } catch (err) {
      console.error('Delete order error:', err);
      alert('Error deleting order');
    }
  }

  function selectOrderToEdit(order) {
    setSelectedOrder(order);
    setFormData({
      orderId: order.orderId,
      driverId: order.driverId,
      routeId: order.routeId,
      deliveryTimeMinutes: order.deliveryTimeMinutes,
      latePenalty: order.latePenalty,
      highValueBonus: order.highValueBonus,
      fuelCost: order.fuelCost,
      profit: order.profit,
      onTime: order.onTime,
    });
  }

  // DEBUG: Log current mode to verify dropdown works
  console.log('Current mode:', mode);

  return (
    <div style={{ maxWidth: 900, margin: 'auto', padding: 20, fontFamily: 'Arial' }}>
      <h1>Orders Management</h1>

      <label>
        Select Operation:{' '}
        <select
          value={mode}
          onChange={(e) => {
            setMode(e.target.value);
            resetForm();
          }}
          style={{ marginBottom: 15, padding: 5 }}
        >
          <option value="create">Create Order</option>
          <option value="view">View Orders</option>
          <option value="update">Update Order</option>
          <option value="delete">Delete Order</option>
        </select>
      </label>

      <hr />

      {/* CREATE */}
      {mode === 'create' && (
        <>
          <h2>Create Order</h2>
          <form onSubmit={createOrder} style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: 400 }}>
            <input name="orderId" placeholder="Order ID" value={formData.orderId} onChange={handleChange} required />
            <input name="driverId" placeholder="Driver ID" value={formData.driverId} onChange={handleChange} required />
            <input name="routeId" placeholder="Route ID" value={formData.routeId} onChange={handleChange} required />
            <input
              name="deliveryTimeMinutes"
              placeholder="Delivery Time (mins)"
              type="number"
              value={formData.deliveryTimeMinutes}
              onChange={handleChange}
              required
            />
            <input
              name="latePenalty"
              placeholder="Late Penalty"
              type="number"
              value={formData.latePenalty}
              onChange={handleChange}
              required
            />
            <input
              name="highValueBonus"
              placeholder="High Value Bonus"
              type="number"
              value={formData.highValueBonus}
              onChange={handleChange}
              required
            />
            <input
              name="fuelCost"
              placeholder="Fuel Cost"
              type="number"
              value={formData.fuelCost}
              onChange={handleChange}
              required
            />
            <input
              name="profit"
              placeholder="Profit"
              type="number"
              value={formData.profit}
              onChange={handleChange}
              required
            />
            <label>
              On Time:
              <input type="checkbox" name="onTime" checked={formData.onTime} onChange={handleChange} />
            </label>
            <button type="submit" style={{ width: 120, marginTop: 10 }}>
              Create
            </button>
          </form>
        </>
      )}

      {/* VIEW */}
      {mode === 'view' && (
        <>
          <h2>View Orders</h2>
          {loading ? (
            <p>Loading orders...</p>
          ) : orders.length === 0 ? (
            <p>No orders found.</p>
          ) : (
            <table
              border="1"
              cellPadding="8"
              cellSpacing="0"
              style={{ width: '100%', marginTop: 10, borderCollapse: 'collapse' }}
            >
              <thead style={{ backgroundColor: '#ddd' }}>
                <tr>
                  <th>Order ID</th>
                  <th>Driver ID</th>
                  <th>Route ID</th>
                  <th>Delivery Time</th>
                  <th>Late Penalty</th>
                  <th>High Value Bonus</th>
                  <th>Fuel Cost</th>
                  <th>Profit</th>
                  <th>On Time</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o._id}>
                    <td>{o.orderId}</td>
                    <td>{o.driverId}</td>
                    <td>{o.routeId}</td>
                    <td>{o.deliveryTimeMinutes}</td>
                    <td>{o.latePenalty}</td>
                    <td>{o.highValueBonus}</td>
                    <td>{o.fuelCost}</td>
                    <td>{o.profit}</td>
                    <td>{o.onTime ? 'Yes' : 'No'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}

      {/* UPDATE */}
      {mode === 'update' && (
        <>
          <h2>Update Order</h2>
          {loading ? (
            <p>Loading orders...</p>
          ) : orders.length === 0 ? (
            <p>No orders available to update.</p>
          ) : (
            <>
              <label>
                Select order to update:
                <select
                  onChange={(e) => {
                    const order = orders.find((o) => o._id === e.target.value);
                    selectOrderToEdit(order);
                  }}
                  value={selectedOrder ? selectedOrder._id : ''}
                  style={{ marginLeft: 10, padding: 5 }}
                >
                  <option value="">-- Select Order --</option>
                  {orders.map((o) => (
                    <option key={o._id} value={o._id}>
                      {o.orderId} - {o.driverId}
                    </option>
                  ))}
                </select>
              </label>

              {selectedOrder && (
                <form onSubmit={updateOrder} style={{ marginTop: 20, maxWidth: 400, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <input
                    name="orderId"
                    placeholder="Order ID"
                    value={formData.orderId}
                    onChange={handleChange}
                    required
                  />
                  <input
                    name="driverId"
                    placeholder="Driver ID"
                    value={formData.driverId}
                    onChange={handleChange}
                    required
                  />
                  <input name="routeId" placeholder="Route ID" value={formData.routeId} onChange={handleChange} required />
                  <input
                    name="deliveryTimeMinutes"
                    placeholder="Delivery Time (mins)"
                    type="number"
                    value={formData.deliveryTimeMinutes}
                    onChange={handleChange}
                    required
                  />
                  <input
                    name="latePenalty"
                    placeholder="Late Penalty"
                    type="number"
                    value={formData.latePenalty}
                    onChange={handleChange}
                    required
                  />
                  <input
                    name="highValueBonus"
                    placeholder="High Value Bonus"
                    type="number"
                    value={formData.highValueBonus}
                    onChange={handleChange}
                    required
                  />
                  <input
                    name="fuelCost"
                    placeholder="Fuel Cost"
                    type="number"
                    value={formData.fuelCost}
                    onChange={handleChange}
                    required
                  />
                  <input
                    name="profit"
                    placeholder="Profit"
                    type="number"
                    value={formData.profit}
                    onChange={handleChange}
                    required
                  />
                  <label>
                    On Time:
                    <input type="checkbox" name="onTime" checked={formData.onTime} onChange={handleChange} />
                  </label>
                  <button type="submit" style={{ width: 120, marginTop: 10 }}>
                    Update
                  </button>
                </form>
              )}
            </>
          )}
        </>
      )}

      {/* DELETE */}
      {mode === 'delete' && (
        <>
          <h2>Delete Order</h2>
          {loading ? (
            <p>Loading orders...</p>
          ) : orders.length === 0 ? (
            <p>No orders available to delete.</p>
          ) : (
            <table
              border="1"
              cellPadding="8"
              cellSpacing="0"
              style={{ width: '100%', marginTop: 10, borderCollapse: 'collapse' }}
            >
              <thead style={{ backgroundColor: '#ddd' }}>
                <tr>
                  <th>Order ID</th>
                  <th>Driver ID</th>
                  <th>Route ID</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o._id}>
                    <td>{o.orderId}</td>
                    <td>{o.driverId}</td>
                    <td>{o.routeId}</td>
                    <td>
                      <button onClick={() => deleteOrder(o._id)} style={{ color: 'red' }}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  );
}
