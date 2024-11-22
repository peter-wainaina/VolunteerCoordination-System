import React, { useState, useEffect } from 'react'
import { Search, Calendar, Briefcase, User } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function ApplicantsPage() {
  const [applicants, setApplicants] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/organizations/applicants', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        setApplicants(response.data)
        setLoading(false)
      } catch (err) {
        console.error('Error fetching applicants:', err)
        setError('Failed to fetch applicants. Please try again.')
        setLoading(false)
      }
    }

    fetchApplicants()
  }, [])

  const filteredApplicants = applicants.filter(applicant =>
    `${applicant.first_name} ${applicant.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    applicant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    applicant.applied_for.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusColor = (status) => {
    switch (status) {
      case 'Accepted':
        return 'bg-green-100 text-green-800'
      case 'Rejected':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-yellow-100 text-yellow-800'
    }
  }

  const handleViewDetails = (id) => {
    navigate(`/application/applicant/${id}`)
  }

  if (loading) return <div className="text-center mt-8">Loading...</div>
  if (error) return <div className="text-center mt-8 text-red-600">{error}</div>

  return (
    <div className="holder mx-auto py-10 px-4">
      <h1 className="text-4xl font-bold mb-8">Applicants for Your Opportunities</h1>
      <div className="mb-6 relative">
        <input
          type="text"
          placeholder="Search applicants, opportunities..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md p-2 pl-10 border rounded"
        />
        <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredApplicants.map((applicant) => (
          <div key={applicant.id} className="border rounded-lg p-6 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center space-x-4 mb-4">
              <div className="bg-gray-200 rounded-full h-12 w-12 flex items-center justify-center">
                <User className="h-6 w-6 text-gray-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">{applicant.first_name} {applicant.last_name}</h2>
                <p className="text-sm text-gray-500">{applicant.email}</p>
              </div>
            </div>
            <div className="space-y-2 mb-4">
              <p className="flex items-center text-sm text-gray-600">
                <Briefcase className="h-4 w-4 mr-2" />
                {applicant.applied_for}
              </p>
              <p className="flex items-center text-sm text-gray-600">
                <Calendar className="h-4 w-4 mr-2" />
                Applied on {new Date(applicant.application_date).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(applicant.status)}`}>
                {applicant.status}
              </span>
              <button
                onClick={() => handleViewDetails(applicant.id)}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}