import React from 'react';

const KPICard = ({ title, value }) => (
  <div className="kpi-card">
    <h3>{title}</h3>
    <p>{value}</p>
  </div>
);

export default KPICard;
