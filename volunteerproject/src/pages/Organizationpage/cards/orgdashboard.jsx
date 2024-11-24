import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { motion } from 'framer-motion'
import { FiUsers, FiFileText, FiClipboard, FiUser, FiBriefcase } from 'react-icons/fi'

const Card = ({ icon: Icon, title, value }) => (
  <motion.div 
    className="bg-gradient-to-br from-white to-indigo-50 rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl border border-indigo-100"
    whileHover={{ scale: 1.03, y: -5 }}
    whileTap={{ scale: 0.98 }}
  >
    <div className="flex items-center space-x-4">
      <div className="p-3 bg-indigo-100 rounded-lg">
        <Icon className="w-8 h-8 text-indigo-600" />
      </div>
      <div>
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        <p className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          {value}
        </p>
      </div>
    </div>
  </motion.div>
)

const RecentItem = ({ icon: Icon, title, subtitle, date }) => (
  <motion.li 
    className="py-4 px-6 hover:bg-indigo-50 transition-all duration-200 cursor-pointer"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ x: 5 }}
    transition={{ duration: 0.2 }}
  >
    <div className="flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <div className="p-2 bg-indigo-100 rounded-lg">
          <Icon className="w-5 h-5 text-indigo-600" />
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-800">{title}</p>
          <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
        </div>
      </div>
      <span className="text-xs font-medium text-indigo-400 bg-indigo-50 px-2 py-1 rounded-full">
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 p-6 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <motion.h1 
          className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-8 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Organization Dashboard
        </motion.h1>
        
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
          <Card icon={FiUsers} title="Total Applicants" value={dashboardData.totalApplicants} />
          <Card icon={FiFileText} title="Total Applications" value={dashboardData.totalApplications} />
          <Card icon={FiClipboard} title="Total Opportunities" value={dashboardData.totalOpportunities} />
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <motion.div 
            className="bg-white shadow-lg rounded-xl overflow-hidden border border-indigo-100"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-xl font-semibold text-gray-800 p-5 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-indigo-100">
              Recent Applicants
            </h2>
            <ul className="divide-y divide-indigo-100 max-h-[500px] overflow-y-auto">
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
            className="bg-white shadow-lg rounded-xl overflow-hidden border border-indigo-100"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-xl font-semibold text-gray-800 p-5 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-indigo-100">
              Recent Opportunities
            </h2>
            <ul className="divide-y divide-indigo-100 max-h-[500px] overflow-y-auto">
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