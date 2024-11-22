import React from 'react';
import './volunteerhome.css'
const OpportunityCard = ({ opportunity }) => {
  return (
    <div className="opportunity-item"> 
      <h4>{opportunity.title}</h4>
      <p>{opportunity.description}</p>
      <p><strong>Organization:</strong> {opportunity.organization}</p>
      <button onClick={() => alert(`Applying for ${opportunity.title}`)}>Apply</button>
    </div>
  );
};

export default OpportunityCard;
