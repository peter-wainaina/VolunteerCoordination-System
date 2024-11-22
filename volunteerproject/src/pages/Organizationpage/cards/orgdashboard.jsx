import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { motion } from 'framer-motion'
import { FiUsers, FiFileText, FiClipboard, FiUser, FiBriefcase } from 'react-icons/fi'

const Card = ({ icon: Icon, title, value }) => (
  <motion.div 
    className="bg-white rounded-lg shadow p-5 transition-all duration-300 hover:shadow-md"
    whileHover={{ scale: 1.03 }}
    whileTap={{ scale: 0.98 }}
  >
    <div className="flex items-center">
      <Icon className="w-10 h-10 text-indigo-500" />
      <div className="ml-4">
        <h3 className="text-base font-semibold text-gray-700">{title}</h3>
        <p className="text-2xl font-bold text-indigo-600">{value}</p>
      </div>
    </div>
  </motion.div>
)

const RecentItem = ({ icon: Icon, title, subtitle, date }) => (
  <motion.li 
    className="py-3 px-5 hover:bg-gray-50 transition-colors duration-200"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.2 }}
  >
    <div className="flex justify-between items-center">
      <div className="flex items-center">
        <Icon className="w-5 h-5 text-indigo-500 mr-3" />
        <div>
          <p className="text-sm font-medium text-indigo-600">{title}</p>
          <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
        </div>
      </div>
      <span className="text-xs text-gray-400">
        {new Date(date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })}
      </span>
    </div>
  </motion.li>
)

export default function OrganizationDashboard() {
  const [dashboardData, setDashboardData] = useState({
    totalApplications: 0,
    totalApplicants: 0,
    totalOpportunities: 0,
    recentApplicants: [],
    recentOpportunities: []
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };

        const [applicantsRes, opportunitiesRes, recentApplicantsRes, recentOpportunitiesRes] = await Promise.all([
          axios.get('http://localhost:3000/api/organizations/applicants', { headers }),
          axios.get('http://localhost:3000/api/Organization/view-opportunities', { headers }),
          axios.get('http://localhost:3000/api/organizations/recent-applicants', { headers }),
          axios.get('http://localhost:3000/api/organizations/recent-opportunities', { headers })
        ]);

        setDashboardData({
          totalApplications: applicantsRes.data.length,
          totalApplicants: new Set(applicantsRes.data.map(app => app.user_id)).size,
          totalOpportunities: opportunitiesRes.data.length,
          recentApplicants: recentApplicantsRes.data,
          recentOpportunities: recentOpportunitiesRes.data
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="bg-gray-100 p-6 sm:p-8 h-screen ">
      <div className="max-w-7xl mx-auto">
        <motion.h1 
          className="text-3xl font-bold text-gray-900 mb-8 text-center"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          Organization Dashboard
        </motion.h1>
        
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
          <Card icon={FiUsers} title="Total Applicants" value={dashboardData.totalApplicants} />
          <Card icon={FiFileText} title="Total Applications" value={dashboardData.totalApplications} />
          <Card icon={FiClipboard} title="Total Opportunities" value={dashboardData.totalOpportunities} />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <motion.div 
            className="bg-white shadow rounded-lg overflow-hidden"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-xl font-semibold text-gray-800 p-5 bg-gray-50">Recent Applicants</h2>
            <ul className="divide-y divide-gray-200 max-h-80 overflow-y-auto">
              {dashboardData.recentApplicants.map((applicant, index) => (
                <RecentItem 
                  key={applicant.id || index}
                  icon={FiUser}
                  title={applicant.name}
                  subtitle={`Applied for: ${applicant.applied_for}`}
                  date={applicant.date}
                />
              ))}
            </ul>
          </motion.div>

          <motion.div 
            className="bg-white shadow rounded-lg overflow-hidden"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-xl font-semibold text-gray-800 p-5 bg-gray-50">Recent Opportunities</h2>
            <ul className="divide-y divide-gray-200 max-h-80 overflow-y-auto">
              {dashboardData.recentOpportunities.map((opportunity, index) => (
                <RecentItem 
                  key={opportunity.id || index}
                  icon={FiBriefcase}
                  title={opportunity.title}
                  subtitle={`${opportunity.applicants} applicant(s)`}
                  date={opportunity.datePosted}
                />
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </div>
  )
}