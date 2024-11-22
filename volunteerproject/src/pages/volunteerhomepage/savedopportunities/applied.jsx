import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Icon components
const IconPending = () => (
  <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const IconAccepted = () => (
  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const IconInterview = () => (
  <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const IconRejected = () => (
  <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const IconBookmark = () => (
  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
  </svg>
);

const IconLocation = () => (
  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const IconCalendar = () => (
  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const Applied = () => {
  const [activeTab, setActiveTab] = useState('applications');
  const [applications, setApplications] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    const fetchApplications = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }

      try {
        const response = await axios.get('http://localhost:3000/api/applications', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setApplications(response.data);
      } catch (error) {
        console.error('Error fetching applications:', error);
      }
    };

    const fetchBookmarks = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }

      try {
        const response = await axios.get('http://localhost:3000/api/bookmarks', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setBookmarks(response.data);
      } catch (error) {
        console.error('Error fetching bookmarks:', error);
      }
    };

    fetchApplications();
    fetchBookmarks();
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Accepted':
        return <IconAccepted />;
      case 'Pending':
        return <IconPending />;
      case 'Interview':
        return <IconInterview />;
      case 'Rejected':
        return <IconRejected />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Accepted':
        return 'text-green-500';
      case 'Pending':
        return 'text-yellow-500';
      case 'Interview':
        return 'text-blue-500';
      case 'Rejected':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Applications</h1>
        
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              <button
                onClick={() => setActiveTab('applications')}
                className={`w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'applications'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Applications ({applications.length})
              </button>
              <button
                onClick={() => setActiveTab('bookmarks')}
                className={`w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'bookmarks'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Bookmarked ({bookmarks.length})
              </button>
            </nav>
          </div>

          <div className="p-4 sm:p-6 lg:p-8">
            {activeTab === 'applications' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Application Statuses</h2>
                <div className="space-y-6">
                  {applications.map((application) => (
                    <div key={application.id} className="bg-gray-50 rounded-lg p-4 shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          {getStatusIcon(application.status)}
                          <span className={`font-semibold ml-2 ${getStatusColor(application.status)}`}>
                            {application.status}
                          </span>
                        </div>
                        <span className="text-sm text-gray-500">
                          Applied: {formatDate(application.application_date)}
                        </span>
                      </div>
                      <h3 className="text-lg font-medium text-gray-800">
                        {application.opportunity_title}
                      </h3>
                      <p className="text-gray-600">{application.organization_name}</p>
                      <div className="mt-2 text-sm text-gray-500">
                        <p>Name: {application.first_name} {application.last_name}</p>
                        <p>Email: {application.email}</p>
                        <p>Phone: {application.phone}</p>
                      </div>
                    </div>
                  ))}
                  {applications.length === 0 && (
                    <p className="text-gray-500 text-center py-4">
                      No applications found. Start applying for opportunities!
                    </p>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'bookmarks' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Bookmarked Opportunities
                </h2>
                <div className="space-y-6">
                  {bookmarks.map((bookmark) => (
                    <div key={bookmark.id} className="bg-gray-50 rounded-lg p-4 shadow-sm">
                      <h3 className="text-lg font-medium text-gray-800">{bookmark.title}</h3>
                      <p className="text-gray-600">{bookmark.description}</p>
                      {/* Add more details as needed */}
                    </div>
                  ))}
                  {bookmarks.length === 0 && (
                    <p className="text-gray-500 text-center py-4">
                      No bookmarks found. Start bookmarking opportunities!
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Applied;