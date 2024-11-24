import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Search, ChevronRight, Users, MapPin, Calendar, Building, ChevronDown,Download } from 'lucide-react'
import { jsPDF } from 'jspdf'
import 'jspdf-autotable'

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
  const downloadOpportunityReport = (opportunity, applicantsList) => {
    const doc = new jsPDF()
    
    // Add opportunity details
    doc.setFontSize(16)
    doc.text('Opportunity Report', 14, 15)
    
    doc.setFontSize(12)
    doc.text(`Title: ${opportunity.title}`, 14, 25)
    doc.text(`Organization: ${opportunity.organization}`, 14, 35)
    doc.text(`Location: ${opportunity.location}`, 14, 45)
    doc.text(`Date: ${new Date(opportunity.date).toLocaleDateString()}`, 14, 55)
    doc.text('Applicants List:', 14, 70)
    
    const tableData = applicantsList.map(applicant => [
      applicant.name,
      applicant.status
    ])
    
    doc.autoTable({
      startY: 75,
      head: [['Applicant Name', 'Status']],
      body: tableData,
    })
    
    // Download the PDF
    doc.save(`${opportunity.title}_report.pdf`)
  }

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-xl text-gray-600">Loading...</div>
    </div>
  )

  if (error) return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-xl text-red-500">{error}</div>
    </div>
  )
  return (
    // Main container
    <div className="min-h-screen bg-white-100">
      {/* Content wrapper */}
      <div className="w-full mx-auto bg-white rounded-2xl shadow-lg min-h-screen">
        {/* Header section */}
        <div className="p-8 bg-white rounded-t-2xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <h2 className="text-3xl font-bold text-gray-800">Recent Opportunities</h2>
            
            {/* Search bar */}
            <div className="relative w-full md:w-96">
              <input
                type="text"
                placeholder="Search opportunities..."
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-white-700 text-gray-700 
                         placeholder-gray-400 focus:outline-none focus:ring-2 
                         focus:ring-gray-600 text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            </div>
          </div>
        </div>

        {/* Opportunities list */}
        <div className="overflow-y-auto max-h-[calc(110vh-16rem)]">
          <ul className="divide-y divide-gray-100">
            {filteredOpportunities.map((opportunity) => (
              <li key={opportunity.id} className="hover:bg-gray-50 transition-all duration-200">
                {/* Opportunity card */}
                <div className="p-8 cursor-pointer" onClick={() => handleOpportunityClick(opportunity)}>
                  {/* Opportunity header */}
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold text-gray-800">{opportunity.title}</h3>
                    <ChevronDown 
                      className={`text-gray-400 transition-transform duration-300 
                                ${expandedOpportunityId === opportunity.id ? 'rotate-180' : ''}`} 
                      size={24} 
                    />
                  </div>

                  {/* Opportunity details */}
                  <div className="mt-4 flex flex-wrap items-center gap-6 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Building className="mr-2" size={18} />
                      <span>{opportunity.organization}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="mr-2" size={18} />
                      <span>{opportunity.location}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="mr-2" size={18} />
                      <span>{new Date(opportunity.date).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Expanded section with applicants */}
                  {expandedOpportunityId === opportunity.id && (
                    <div className="mt-6 bg-gray-50 p-6 rounded-xl border border-gray-200">
                      {/* Applicants header */}
                      <div className="flex justify-between items-center mb-6">
                        <h4 className="text-lg font-medium text-gray-700">Applicants</h4>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            downloadOpportunityReport(opportunity, applicants);
                          }}
                          className="flex items-center px-5 py-2.5 text-sm text-gray-700 
                                   bg-white hover:bg-gray-50 border border-gray-200 
                                   rounded-lg transition-all duration-200 shadow-sm
                                   hover:shadow-md"
                        >
                          <Download size={18} className="mr-2" />
                          Download Report
                        </button>
                      </div>

                      {/* Applicants list */}
                      {applicants.length > 0 ? (
                        <ul className="space-y-4">
                          {applicants.map((applicant) => (
                            <li key={applicant.id} 
                                className="flex items-center justify-between bg-white p-5 
                                         rounded-xl border border-gray-100 hover:border-gray-300 
                                         transition-all duration-200">
                              <div className="flex items-center">
                                <Users className="text-gray-400 mr-3" size={20} />
                                <span className="text-base font-medium text-gray-800">
                                  {applicant.name}
                                </span>
                              </div>
                              <span className={`px-4 py-1.5 text-sm font-medium rounded-full 
                                             ${applicant.status === 'Approved' ? 'bg-green-50 text-green-700' :
                                               applicant.status === 'Declined' ? 'bg-red-50 text-red-700' :
                                               'bg-yellow-50 text-yellow-700'}`}>
                                {applicant.status}
                              </span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-center py-8 text-gray-500">
                          No applicants yet
                        </p>
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
