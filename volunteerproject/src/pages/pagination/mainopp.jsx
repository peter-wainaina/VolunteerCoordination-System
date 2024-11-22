import React, { useState, useEffect } from 'react';

import SearchAndFilter from './searchandfilter';
import OpportunityCard from '../volunteerhomepage/opportunitycard';
import Pagination from './pagination';

import './styles.css';

const OpportunitiesPage = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [filteredOpportunities, setFilteredOpportunities] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    // Fetch opportunities data from an API or static JSON
    const fetchedOpportunities = [
      { title: 'Health Outreach', location: 'Kenya', description: 'Provide health services...' },
      { title: 'Education Assistance', location: 'Nepal', description: 'Assist with teaching...' },
      // Add more opportunities here
    ];
    setOpportunities(fetchedOpportunities);
    setFilteredOpportunities(fetchedOpportunities);
  }, []);

  const handleSearch = (searchTerm, category) => {
    const filtered = opportunities.filter(
      (opp) =>
        opp.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (category ? opp.category === category : true)
    );
    setFilteredOpportunities(filtered);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const displayedOpportunities = filteredOpportunities.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="opportunities-page">
      <SearchAndFilter onSearch={handleSearch} />
      <div className="opportunities-list">
        {displayedOpportunities.map((opp, index) => (
          <OpportunityCard
            key={index}
            title={opp.title}
            location={opp.location}
            description={opp.description}
          />
        ))}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(filteredOpportunities.length / itemsPerPage)}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default OpportunitiesPage;
