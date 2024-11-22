import React, { useEffect, useState } from 'react';
import axios from 'axios';

function SuggestedOpportunities() {
  const [opportunities, setOpportunities] = useState([]);

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        const token = localStorage.getItem('jwt-secret-key'); // Assume token is stored in localStorage
        const response = await axios.get('http://localhost:3001/volunteer/suggestions', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOpportunities(response.data);
      } catch (err) {
        console.error('Failed to fetch opportunities', err);
      }
    };

    fetchOpportunities();
  }, []);

  return (
    <div>
      <h2>Suggested Opportunities</h2>
      <ul>
        {opportunities.map((opportunity) => (
          <li key={opportunity.id}>
            {opportunity.title} - {opportunity.matching_skills} matching skills
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SuggestedOpportunities;