import React, { useEffect, useState } from 'react';
import ContentToppostpage from './contentToppostpage';
import SearchToggle from './SearchToggle';
import axios from 'axios';
import Opportunitycard from './opportunitycard';
import OpportunityModal from './OpportunityModal';

function PostOpportunity({ organization_id }) {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentOpportunity, setCurrentOpportunity] = useState(null);

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/opportunities/organization', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setData(response.data);
        setFilteredData(response.data);
      } catch (err) {
        console.error('Error fetching opportunities:', err);
      }
    };

    fetchOpportunities();
  }, []);

  const handleEdit = (opportunity) => {
    setCurrentOpportunity(opportunity);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    axios.delete(`http://localhost:3000/opportunities/${id}`)
      .then(() => {
        setData(data.filter(opportunity => opportunity.id !== id));
        setFilteredData(filteredData.filter(opportunity => opportunity.id !== id));
      })
      .catch(err => console.log(err));
  };

  const handleStatusChange = (id, newStatus) => {
    axios.put(`http://localhost:3000/opportunities/${id}`, { status: newStatus })
      .then(res => {
        const updatedOpportunities = data.map(opportunity =>
          opportunity.id === id ? { ...opportunity, status: newStatus } : opportunity
        );
        setData(updatedOpportunities);
        setFilteredData(updatedOpportunities);
      })
      .catch(err => console.log(err));
  };

  const handleModalSubmit = (formData) => {
    if (currentOpportunity) {
      const updatedOpportunity = { ...currentOpportunity, ...formData };
      axios.put(`http://localhost:3000/opportunities/${currentOpportunity.id}`, updatedOpportunity)
        .then(res => {
          const updatedOpportunities = data.map(opportunity =>
            opportunity.id === currentOpportunity.id ? res.data : opportunity
          );
          setData(updatedOpportunities);
          setFilteredData(updatedOpportunities);
        })
        .catch(err => console.log(err));
    } else {
      const newOpportunity = { ...formData, organization_id, status: 'upcoming' };
      axios.post('http://localhost:3000/opportunities', newOpportunity)
        .then(res => {
          setData([...data, res.data]);
          setFilteredData([...data, res.data]);
        })
        .catch(err => console.log(err));
    }

    setCurrentOpportunity(null);
    setIsModalOpen(false);
  };

  return (
    <div className="main-content bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ContentToppostpage />
        <div className="filter-container flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-8">
          <div className="w-full sm:w-2/3">
            <SearchToggle setOpportunities={setFilteredData} allOpportunities={data} />
          </div>
          <button
            className="add-button w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105"
            onClick={() => {
              setCurrentOpportunity(null);
              setIsModalOpen(true);
            }}
          >
            Add Opportunity
          </button>
        </div>
        <div className="opportunities-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredData.map((opportunity, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
              <Opportunitycard
                data={opportunity}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                handleStatusChange={handleStatusChange}
              />
            </div>
          ))}
        </div>
      </div>
      <OpportunityModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        currentOpportunity={currentOpportunity}
        onSubmit={handleModalSubmit}
        organizationId={organization_id}
      />
    </div>
  );
}

export default PostOpportunity;