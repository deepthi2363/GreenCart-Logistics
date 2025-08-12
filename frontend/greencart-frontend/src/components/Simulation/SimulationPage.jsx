import React, { useState } from 'react';
import SimulationForm from './SimulationForm';
import SimulationResults from './SimulationResults';

const SimulationPage = () => {
  const [simulationResult, setSimulationResult] = useState(null);

  return (
    <div className="page-container">
      <h1>Run Simulation</h1>
      <SimulationForm onSimulationComplete={setSimulationResult} />
      {simulationResult ? (
        <>
          <h2>Simulation Results</h2>
          <SimulationResults data={simulationResult} />
        </>
      ) : (
        <p>No simulation run yet.</p>
      )}
    </div>
  );
};

export default SimulationPage;
