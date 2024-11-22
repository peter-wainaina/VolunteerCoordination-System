import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Check, X } from 'lucide-react'
import axios from 'axios'

const Applicants = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [applicant, setApplicant] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchApplicantDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/applicant/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        setApplicant(response.data)
        setLoading(false)
      } catch (err) {
        console.error('Error fetching applicant details:', err)
        setError('Failed to fetch applicant details. Please try again.')
        setLoading(false)
      }
    }

    fetchApplicantDetails()
  }, [id])

  const handleStatusUpdate = async (status) => {
    try {
      await axios.put(`http://localhost:3000/api/applicant/${id}/status`, 
        { status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      )
      setApplicant({ ...applicant, status })
    } catch (err) {
      console.error('Error updating applicant status:', err)
      setError('Failed to update applicant status. Please try again.')
    }
  }

  const handleApprove = () => handleStatusUpdate('Accepted')
  const handleDecline = () => handleStatusUpdate('Rejected')

  if (loading) return <div className="text-center mt-8">Loading...</div>
  if (error) return <div className="text-center mt-8 text-red-600">{error}</div>
  if (!applicant) return <div className="text-center mt-8">Applicant not found</div>

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <button onClick={() => navigate('/home/Organization/view-applications')} className="mb-6 flex items-center text-blue-600">
        <ArrowLeft className="mr-2" /> Back to Applicants
      </button>
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Applicant Details</h2>
          <span className={`px-2 py-1 rounded-full text-sm font-semibold ${
            applicant.status === 'Accepted' ? 'bg-green-100 text-green-800' :
            applicant.status === 'Rejected' ? 'bg-red-100 text-red-800' :
            'bg-yellow-100 text-yellow-800'
          }`}>
            {applicant.status}
          </span>
        </div>
        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: 'First Name', value: applicant.first_name },
              { label: 'Last Name', value: applicant.last_name },
              { label: 'Email', value: applicant.email, type: 'email' },
              { label: 'Phone', value: applicant.phone },
              { label: 'Date of Birth', value: applicant.date_of_birth, type: 'date' },
              { label: 'Address', value: applicant.address },
              { label: 'Emergency Contact', value: applicant.emergency_contact },
              { label: 'Emergency Phone', value: applicant.emergency_phone },
              { label: 'Applied For', value: applicant.applied_for },
              { label: 'Application Date', value: new Date(applicant.application_date).toLocaleDateString() },
            ].map((field, index) => (
              <div key={index}>
                <label className="block text-sm font-medium text-gray-700">{field.label}</label>
                <input
                  type={field.type || 'text'}
                  value={field.value}
                  readOnly
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            ))}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Availability</label>
            <textarea
              value={applicant.availability}
              readOnly
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Experience</label>
            <textarea
              value={applicant.experience}
              readOnly
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Interests</label>
            <textarea
              value={applicant.interests}
              readOnly
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Additional Information</label>
            <textarea
              value={applicant.additional_info}
              readOnly
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
        </form>
        <div className="mt-6 flex justify-end space-x-4">
          <button
            onClick={handleDecline}
            disabled={applicant.status !== 'Pending'}
            className={`px-4 py-2 rounded-md text-white ${
              applicant.status !== 'Pending'
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-red-500 hover:bg-red-600'
            }`}
          >
            <X className="inline-block mr-2" />
            Decline
          </button>
          <button
            onClick={handleApprove}
            disabled={applicant.status !== 'Pending'}
            className={`px-4 py-2 rounded-md text-white ${
              applicant.status !== 'Pending'
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-green-500 hover:bg-green-600'
            }`}
          >
            <Check className="inline-block mr-2" />
            Approve
          </button>
        </div>
      </div>
    </div>
  )
}

export default Applicants