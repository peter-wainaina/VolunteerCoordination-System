import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Loading1 from '../loading1';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BusinessIcon from '@mui/icons-material/Business';
import ContactEmergencyIcon from '@mui/icons-material/ContactEmergency';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import WorkHistoryIcon from '@mui/icons-material/WorkHistory';
import InterestsIcon from '@mui/icons-material/Interests';
import InfoIcon from '@mui/icons-material/Info';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

function ApplicationPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [opportunity, setOpportunity] = useState(null);
  const [startDate, setStartDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    address: '',
    emergencyContact: '',
    emergencyPhone: '',
    availability: [],
    experience: '',
    interests: '',
    additionalInfo: '',
  });

  useEffect(() => {
    const fetchOpportunity = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/opportunities/get/${id}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (!result.success) {
          throw new Error(result.message || 'Failed to fetch opportunity');
        }
        
        setOpportunity(result.data);
      } catch (error) {
        console.error('Error loading opportunity:', error);
        alert(`Failed to load opportunity details: ${error.message}`);
        navigate('/home/volunteer');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOpportunity();
  }, [id, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (day) => {
    setFormData(prev => {
      const availability = prev.availability.includes(day)
        ? prev.availability.filter(d => d !== day)
        : [...prev.availability, day];
      return { ...prev, availability };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          opportunityId: id,
          ...formData
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit application');
      }

      alert('Application submitted successfully!');
      navigate('/home/volunteer');
    } catch (error) {
      console.error('Error submitting application:', error);
      alert(error.message || 'Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loading1 />
          <p className="mt-4 text-gray-600">Loading application form...</p>
        </div>
      </div>
    );
  }

  if (!opportunity) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center text-red-600">Opportunity not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-8 text-white">
          <h1 className="text-2xl font-bold mb-4">Apply for {opportunity.title}</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <BusinessIcon className="text-blue-200" />
              <span className="text-blue-100">{opportunity.organization}</span>
            </div>
            <div className="flex items-center space-x-2">
              <LocationOnIcon className="text-blue-200" />
              <span className="text-blue-100">{opportunity.location}</span>
            </div>
            <div className="flex items-center space-x-2">
              <CalendarTodayIcon className="text-blue-200" />
              <span className="text-blue-100">{new Date(opportunity.date).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <PersonIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="firstName"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleInputChange}
                required
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <PersonIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="lastName"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleInputChange}
                required
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <EmailIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <PhoneIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="tel"
                id="phone"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleInputChange}
                required
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
              />
            </div>

            <div className="relative">
  <label htmlFor="dateOfBirth" className="absolute -top-2 left-2 px-1 bg-white text-sm text-gray-600">
    Date of Birth
  </label>
  <input
    type="date"
    id="dateOfBirth"
    name="dateOfBirth"
    value={formData.dateOfBirth}
    onChange={handleInputChange}
    required
    className="block w-full px-4 py-3 mt-1 border border-gray-300 rounded-lg 
              focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 
              transition-all duration-200"
  />
</div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LocationOnIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="address"
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleInputChange}
                required
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <ContactEmergencyIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="emergencyContact"
                name="emergencyContact"
                placeholder="Emergency Contact Name"
                value={formData.emergencyContact}
                onChange={handleInputChange}
                required
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <PhoneIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="tel"
                id="emergencyPhone"
                name="emergencyPhone"
                placeholder="Emergency Contact Phone"
                value={formData.emergencyPhone}
                onChange={handleInputChange}
                required
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
              />
            </div>
          </div>

          <div className="mt-8">
            <h3 className="flex items-center text-lg font-semibold text-gray-700 mb-4">
              <AccessTimeIcon className="mr-2 text-blue-600" />
              Availability
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-7 gap-4">
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                <label key={day} className="relative flex items-center justify-center">
                  <input
                    type="checkbox"
                    checked={formData.availability.includes(day)}
                    onChange={() => handleCheckboxChange(day)}
                    className="peer sr-only"
                  />
                  <div className="w-full py-2 text-sm text-center border rounded-lg cursor-pointer transition-all peer-checked:bg-blue-600 peer-checked:text-white peer-checked:border-blue-600 hover:bg-gray-50">
                    {day}
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="mt-8 space-y-6">
            <div className="relative">
              <div className="absolute top-3 left-3">
                <WorkHistoryIcon className="text-gray-400" />
              </div>
              <textarea
                id="experience"
                name="experience"
                placeholder="Previous Volunteer Experience"
                value={formData.experience}
                onChange={handleInputChange}
                rows="4"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out resize-none"
              />
            </div>

            <div className="relative">
              <div className="absolute top-3 left-3">
                <InterestsIcon className="text-gray-400" />
              </div>
              <textarea
                id="interests"
                name="interests"
                placeholder="Interests and Motivations"
                value={formData.interests}
                onChange={handleInputChange}
                rows="4"
                required
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out resize-none"
              />
            </div>

            <div className="relative">
              <div className="absolute top-3 left-3">
                <InfoIcon className="text-gray-400" />
              </div>
              <textarea
                id="additionalInfo"
                name="additionalInfo"
                placeholder="Additional Information"
                value={formData.additionalInfo}
                onChange={handleInputChange}
                rows="4"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out resize-none"
              />
            </div>
          </div>

          <div className="mt-8">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="w-2 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                  Processing...
                </div>
              ) : (
                "Submit Application"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ApplicationPage;