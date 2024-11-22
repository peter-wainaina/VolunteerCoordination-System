import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './OpportunitiesList.css'; // Add your styles here

const OpportunitiesList = () => {
  const [opportunities, setOpportunities] = useState([]);

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        const response = await axios.get('http://localhost:3000/opportunities');
        setOpportunities(response.data);
      } catch (error) {
        console.error("Error fetching opportunities", error);
      }
    };

    fetchOpportunities();
  }, []);

  return (
    <div className="opportunities-list">
      <h2>Posted Opportunities</h2>
      {opportunities.length === 0 ? (
        <p>No opportunities posted yet.</p>
      ) : (
        opportunities.map((opportunity) => (
          <div key={opportunity.id} className="opportunity-card">
            <h3>{opportunity.title}</h3>
            <p>{opportunity.description}</p>
            <p>Time: {new Date(opportunity.time).toLocaleString()}</p>
            <p>Location: {opportunity.location}</p>
            {opportunity.image && <img src={opportunity.image} alt={opportunity.title} />}
          </div>
        ))
      )}
    </div>
  );
};

export default OpportunitiesList;
