import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CalendarToday, 
  LocationOn, 
  People, 
  Bookmark, 
  AccessTime, 
  Business,
  ArrowForward 
} from '@mui/icons-material';
import axios from 'axios';

const Volunteercard = ({ opportunity, onNotification }) => {
  const navigate = useNavigate();
  const [isApplying, setIsApplying] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    const bookmarkedOpportunities = JSON.parse(localStorage.getItem('bookmarkedOpportunities')) || [];
    setIsBookmarked(bookmarkedOpportunities.includes(opportunity.id));
  }, [opportunity.id]);

  const handleApply = async () => {
    setIsApplying(true);
    try {
      navigate(`/opportunity/apply/${opportunity.id}`);
    } catch (error) {
      console.error('Navigation error:', error);
    } finally {
      setIsApplying(false);
    }
  };

  const handleBookmarkToggle = async () => {
    const token = localStorage.getItem('token');
    try {
      if (isBookmarked) {
        const response = await axios.delete(`http://localhost:3000/api/bookmarks/${opportunity.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.status === 200) {
          setIsBookmarked(false);
          onNotification('Bookmark removed.');
          updateLocalStorage(opportunity.id, false);
        }
      } else {
        const response = await axios.post('http://localhost:3000/api/bookmarks', { opportunityId: opportunity.id }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.status === 201) {
          setIsBookmarked(true);
          onNotification('Opportunity bookmarked!');
          updateLocalStorage(opportunity.id, true);
        }
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    }
  };

  const updateLocalStorage = (id, isBookmarked) => {
    const bookmarkedOpportunities = JSON.parse(localStorage.getItem('bookmarkedOpportunities')) || [];
    if (isBookmarked) {
      if (!bookmarkedOpportunities.includes(id)) {
        bookmarkedOpportunities.push(id);
      }
    } else {
      const index = bookmarkedOpportunities.indexOf(id);
      if (index > -1) {
        bookmarkedOpportunities.splice(index, 1);
      }
    }
    localStorage.setItem('bookmarkedOpportunities', JSON.stringify(bookmarkedOpportunities));
  };

  const renderSkills = (skills) => {
    if (typeof skills === 'string') {
      return skills.split(',').slice(0, 3).map((skill, index) => (
        <span key={index} className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-600">
          {skill.trim()}
        </span>
      ));
    } else if (Array.isArray(skills)) {
      return skills.slice(0, 3).map((skill, index) => (
        <span key={index} className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-600">
          {skill}
        </span>
      ));
    }
    return null;
  };
  const renderMatchingInfo = () => {
    if (opportunity.matching_skills > 0) {
      return (
        <div className="flex items-center gap-2 text-emerald-600 text-sm mt-2">
          <span className="font-medium">
            {opportunity.matching_skills} matching skills
          </span>
          {opportunity.match_percentage && (
            <span className="text-xs bg-emerald-50 px-2 py-0.5 rounded-full">
              {Math.round(opportunity.match_percentage)}% match
            </span>
          )}
        </div>
      );
    }
    return null;
  };

  const getStatusColor = (status) => {
    if (!status) return 'bg-gray-100 text-gray-800';
    switch (status.toLowerCase()) {
      case 'ongoing':
        return 'bg-green-100 text-green-800';
      case 'upcoming':
        return 'bg-emerald-100 text-emerald-700';
      case 'completed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="relative h-[420px]">
      <div className="group relative w-full h-full">
        {/* Base Card - Always Visible */}
        <div className="absolute inset-0 bg-white rounded-xl shadow-sm transition-all duration-300 ease-in-out z-10">
          <div className="h-full flex flex-col">
            {/* Card Image */}
            <div className="relative h-40 overflow-hidden rounded-t-xl">
              <img
                src={opportunity.image_url || 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3'}
                alt={opportunity.title}
                className="w-full h-full object-cover transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 to-transparent"/>
            </div>

            {/* Basic Content */}
            <div className="p-5 flex-1 flex flex-col">
              <div className="flex-1">
                {/* Organization & Title */}
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-sm font-medium text-emerald-600">
                      {opportunity.organization}
                    </p>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {opportunity.title}
                    </h3>
                  </div>
                  {opportunity.status && (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(opportunity.status)}`}>
                      {opportunity.status}
                    </span>
                  )}
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="flex items-center text-gray-600">
                    <CalendarToday className="h-4 w-4 mr-2 text-gray-400" />
                    <span className="text-sm truncate">
                      {new Date(opportunity.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <LocationOn className="h-4 w-4 mr-2 text-gray-400" />
                    <span className="text-sm truncate">{opportunity.location}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <AccessTime className="h-4 w-4 mr-2 text-gray-400" />
                    <span className="text-sm truncate">{opportunity.type}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <People className="h-4 w-4 mr-2 text-gray-400" />
                    <span className="text-sm truncate">{opportunity.availability} needed</span>
                  </div>
                </div>

                {/* Brief Description */}
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {opportunity.description}
                </p>

                {/* Skills Preview */}
                <div className="flex flex-wrap gap-1.5">
                  {renderSkills(opportunity.skills)}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between items-center mt-3">
                <button 
                  onClick={handleApply}
                  className={`flex-1 mr-2 flex items-center justify-center space-x-2 bg-emerald-50 hover:bg-emerald-100 
                           text-emerald-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                             isApplying ? 'opacity-75 cursor-not-allowed' : ''
                           }`}
                  disabled={isApplying}
                >
                  <span>{isApplying ? "Loading..." : "Apply Now"}</span>
                  <ArrowForward className="h-4 w-4" />
                </button>
                <button
                  onClick={handleBookmarkToggle}
                  className={`p-2 rounded-full hover:bg-gray-100 transition-colors ${
                    isBookmarked ? 'text-yellow-500' : 'text-gray-400'
                  }`}
                >
                  <Bookmark className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Extended Card - Shown on Hover */}
        <div className="absolute inset-0 bg-white rounded-xl shadow-lg transition-all duration-300 ease-in-out 
                      opacity-0 group-hover:opacity-100 group-hover:-translate-y-4 
                      pointer-events-none group-hover:pointer-events-auto z-20">
          <div className="h-full flex flex-col">
            {/* Same structure as base card but with more details */}
            <div className="relative h-40 overflow-hidden rounded-t-xl">
              <img
                src={opportunity.image_url || 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3'}
                alt={opportunity.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 to-transparent"/>
            </div>

            <div className="p-5 flex-1 flex flex-col">
              <div className="flex-1">
                {/* Same header structure */}
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-sm font-medium text-emerald-600">
                      {opportunity.organization}
                    </p>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {opportunity.title}
                    </h3>
                  </div>
                  {opportunity.status && (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(opportunity.status)}`}>
                      {opportunity.status}
                    </span>
                  )}
                </div>

                {/* Full Description */}
                <p className="text-sm text-gray-600 mb-3">
                  {opportunity.description}
                </p>

                {/* Detailed Info */}
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="flex items-center text-gray-600">
                    <CalendarToday className="h-4 w-4 mr-2 text-gray-400" />
                    <span className="text-sm">
                      {new Date(opportunity.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <LocationOn className="h-4 w-4 mr-2 text-gray-400" />
                    <span className="text-sm">{opportunity.location}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <AccessTime className="h-4 w-4 mr-2 text-gray-400" />
                    <span className="text-sm">{opportunity.type}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <People className="h-4 w-4 mr-2 text-gray-400" />
                    <span className="text-sm">{opportunity.availability} needed</span>
                  </div>
                </div>

                {/* All Skills */}
                <div className="flex flex-wrap gap-1.5">
                  {renderSkills(opportunity.skills)}
                </div>
              </div>

              {/* Same Action Buttons */}
              <div className="flex justify-between items-center mt-3">
                <button 
                  onClick={handleApply}
                  className={`flex-1 mr-2 flex items-center justify-center space-x-2 bg-emerald-50 hover:bg-emerald-100 
                           text-emerald-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                             isApplying ? 'opacity-75 cursor-not-allowed' : ''
                           }`}
                  disabled={isApplying}
                >
                  <span>{isApplying ? "Loading..." : "Apply Now"}</span>
                  <ArrowForward className="h-4 w-4" />
                </button>
                <button
                  onClick={handleBookmarkToggle}
                  className={`p-2 rounded-full hover:bg-gray-100 transition-colors ${
                    isBookmarked ? 'text-yellow-500' : 'text-gray-400'
                  }`}
                >
                  <Bookmark className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Volunteercard;