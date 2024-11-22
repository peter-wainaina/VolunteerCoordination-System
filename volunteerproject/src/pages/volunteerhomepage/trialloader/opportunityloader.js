import { useState, useEffect } from 'react';
import Socialcard from './socialcard';

const Opportunityloader = () => {
    const [opportunities, setOpportunities] = useState([]);

    useEffect(() => {
        (async () => {
            let opportunityData;
            try {
                const response = await fetch('https://www.volunteerconnector.org/api/search/?ac=5&ac=131&ac=59&cc=64');
                opportunityData = await response.json();
                // Use opportunityData.results to access the opportunities
            } catch (error) {
                console.log(error);
                opportunityData = { results: [] }; // Default to an empty results array
            }

            setOpportunities(opportunityData.results || []); // Adjust based on the actual data structure
        })();
    }, []);

    return (
        <div className='loader'>
            {opportunities.map((opportunity, index) => (
                <Socialcard userData={opportunity} key={index} />
            ))}
        </div>
    );
};

export default Opportunityloader;
