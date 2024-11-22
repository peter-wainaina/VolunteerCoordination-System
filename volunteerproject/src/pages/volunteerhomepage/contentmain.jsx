import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Volunteercard from './card/volunteercard';
import ContentTop from './contentTop';
import NotFound from './error/Notfound';
import Loading1 from './loading1';
import { mockOpportunities } from './mockdata';
import axios from 'axios';

const fetchOpportunities = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await axios.get('http://localhost:3000/suggestions', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching opportunities:', error);
    throw error;
  }
};

export default function ContentMain() {
  const [bookmarkedOpportunities, setBookmarkedOpportunities] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [allOpportunities, setAllOpportunities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [useMockData, setUseMockData] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const loadOpportunities = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Check if we have updated suggestions from profile update
        const matchedOpportunities = localStorage.getItem('matchedOpportunities');
        
        if (location.state?.updatedSkills && matchedOpportunities) {
          // Use the matched opportunities from profile update
          const parsedOpportunities = JSON.parse(matchedOpportunities);
          setAllOpportunities(parsedOpportunities);
          setOpportunities(parsedOpportunities);
          // Clear the stored matched opportunities
          localStorage.removeItem('matchedOpportunities');
          // Show notification about updated matches
          handleNotification('Profile updated! Showing matched opportunities.');
        } else if (useMockData) {
          setAllOpportunities(mockOpportunities);
          setOpportunities(mockOpportunities);
        } else {
          const data = await fetchOpportunities();
          setAllOpportunities(data);
          setOpportunities(data);
        }
      } catch (err) {
        if (err.response && err.response.status === 401) {
          navigate('/login');
        } else {
          setError("Failed to load opportunities. Please try again later.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadOpportunities();
  }, [useMockData, navigate, location.state?.updatedSkills]);

  const handleBookmark = (id) => {
    setBookmarkedOpportunities(prev => 
      prev.includes(id) ? prev.filter(oppId => oppId !== id) : [...prev, id]
    );
  };

  const handleApply = (id) => {
    console.log(`Applying for opportunity ${id}`);
  };

  const handleSearch = (query, results) => {
    setSearchQuery(query);
    setOpportunities(results);
  };

  const handleNotification = (message) => {
    setNotification(message);
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
      setTimeout(() => setNotification(''), 300);
    }, 3000);
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <ContentTop 
        setOpportunities={handleSearch} 
        allOpportunities={allOpportunities} 
        useMockData={useMockData} 
        setUseMockData={setUseMockData} 
      />
      
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-screen">
          <Loading1 />
          <p className="mt-4 text-black-900">Loading opportunities...</p>
        </div>
      ) : error ? (
        <p className="text-red-500 text-center mt-8">{error}</p>
      ) : opportunities.length > 0 ? (
        <div className="box mx-auto px-4 py-8">
          <div className={`fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md transition-opacity duration-300 ${showNotification ? 'opacity-100' : 'opacity-0'}`}>
            {notification}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
            {opportunities.map((opportunity) => (
              <Volunteercard 
                key={opportunity.id} 
                opportunity={opportunity}
                isBookmarked={bookmarkedOpportunities.includes(opportunity.id)}
                onBookmark={() => handleBookmark(opportunity.id)}
                onApply={() => handleApply(opportunity.id)}
                onNotification={handleNotification}
              />
            ))}
          </div>
        </div>
      ) : (
        <NotFound searchQuery={searchQuery} />
      )}
    </div>
  );
}