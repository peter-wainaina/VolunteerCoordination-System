import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Search, ChevronRight, Users, MapPin, Calendar, Building, ChevronDown } from 'lucide-react'

export default function RecentOpportunities() {
  const [opportunities, setOpportunities] = useState([])
  const [expandedOpportunityId, setExpandedOpportunityId] = useState(null)
  const [applicants, setApplicants] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/Organization/view-opportunities', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        setOpportunities(response.data)
        setLoading(false)
      } catch (err) {
        setError('Failed to fetch opportunities')
        setLoading(false)
      }
    }
    fetchOpportunities()
  }, [])

  const fetchApplicants = async (opportunityId) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/opportunities/${opportunityId}/applicants`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      setApplicants(response.data)
    } catch (error) {
      console.error('Error fetching applicants:', error)
      setApplicants([])
    }
  }

  const handleOpportunityClick = (opportunity) => {
    if (expandedOpportunityId === opportunity.id) {
      setExpandedOpportunityId(null)
      setApplicants([])
    } else {
      setExpandedOpportunityId(opportunity.id)
      fetchApplicants(opportunity.id)
    }
  }

  const filteredOpportunities = opportunities.filter(opportunity =>
    opportunity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    opportunity.organization.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>
  if (error) return <div className="text-red-500 text-center">{error}</div>

  return (
    <div className="bg-gray-100 h-screen overflow-hidden">
      <div className="max-w-full mx-auto bg-white shadow-sm h-full flex flex-col">
        <div className="p-4 bg-blue-600 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Recent Opportunities</h2>
          <div className="relative w-1/3">
            <input
              type="text"
              placeholder="Search opportunities..."
              className="w-full pl-10 pr-4 py-2 rounded-full bg-white bg-opacity-20 text-white placeholder-white placeholder-opacity-70 focus:outline-none focus:ring-2 focus:ring-white text-base"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white opacity-70" size={20} />
          </div>
        </div>
        <div className="flex-grow overflow-y-auto">
          <ul className="divide-y divide-gray-200">
            {filteredOpportunities.map((opportunity) => (
              <li key={opportunity.id} className="hover:bg-gray-50 transition duration-150 ease-in-out">
                <div 
                  className="p-4 cursor-pointer"
                  onClick={() => handleOpportunityClick(opportunity)}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-900">{opportunity.title}</h3>
                    <ChevronDown 
                      className={`text-gray-400 transition-transform duration-200 ${expandedOpportunityId === opportunity.id ? 'transform rotate-180' : ''}`} 
                      size={20} 
                    />
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <Building className="mr-1" size={16} />
                    <span>{opportunity.organization}</span>
                    <MapPin className="ml-4 mr-1" size={16} />
                    <span>{opportunity.location}</span>
                    <Calendar className="ml-4 mr-1" size={16} />
                    <span>{new Date(opportunity.date).toLocaleDateString()}</span>
                  </div>
                  {expandedOpportunityId === opportunity.id && (
                    <div className="mt-3 bg-gray-50 p-3 rounded">
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Applicants</h4>
                      {applicants.length > 0 ? (
                        <ul className="space-y-2">
                          {applicants.map((applicant) => (
                            <li key={applicant.id} className="flex items-center justify-between bg-white p-3 rounded-md shadow-sm">
                              <div className="flex items-center">
                                <Users className="text-gray-400 mr-2" size={16} />
                                <span className="text-sm font-medium text-gray-900">{applicant.name}</span>
                              </div>
                              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                applicant.status === 'Approved' ? 'bg-green-100 text-green-800' :
                                applicant.status === 'Declined' ? 'bg-red-100 text-red-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {applicant.status}
                              </span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-gray-500">No applicants yet</p>
                      )}
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}