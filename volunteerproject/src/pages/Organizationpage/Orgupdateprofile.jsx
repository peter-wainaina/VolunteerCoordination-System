import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { Box, Typography, CircularProgress, Container } from '@mui/material';

const RedirectPage = ({ countdown }) => {
  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>Profile Updated Successfully!</Typography>
        <CircularProgress sx={{ mt: 4, mb: 2 }} />
        <Typography variant="body1">Redirecting to homepage in {countdown} seconds...</Typography>
      </Box>
    </Container>
  );
};

const Orgupdateprofile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ username: '', email: '', currentPassword: '', newPassword: '', confirmPassword: '', showCurrentPassword: false, showNewPassword: false, showConfirmPassword: false });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showRedirect, setShowRedirect] = useState(false);
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    const fetchOrgProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) { navigate('/login'); return; }
        const response = await axios.get('http://localhost:3000/api/organization/profile', { headers: { Authorization: `Bearer ${token}` } });
        setFormData(prev => ({ ...prev, username: response.data.username, email: response.data.email }));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError('Failed to load organization profile');
        setLoading(false);
      }
    };
    fetchOrgProfile();
  }, [navigate]);

  useEffect(() => {
    let timer;
    if (showRedirect && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      navigate('/home/organization');
    }
    return () => clearInterval(timer);
  }, [countdown, showRedirect, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(''); setSuccess('');
  };

  const togglePasswordVisibility = (field) => setFormData(prev => ({ ...prev, [field]: !prev[field] }));
  const handleSubmit = (e) => { e.preventDefault(); setShowConfirmation(true); };

  const confirmUpdate = async () => {
    setError(''); setSuccess(''); setShowConfirmation(false);
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match'); return;
    }
    try {
      const token = localStorage.getItem('token');
      const updateData = {
        username: formData.username,
        email: formData.email,
        ...(formData.currentPassword && { currentPassword: formData.currentPassword }),
        ...(formData.newPassword && { newPassword: formData.newPassword })
      };
      await axios.put('http://localhost:3000/api/organization/update-profile', updateData, { headers: { Authorization: `Bearer ${token}` } });
      setSuccess('Profile updated successfully');
      setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
      setShowRedirect(true);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    }
  };

  if (loading) return <div className="max-w-md mx-auto mt-10 p-6"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div></div>;
  
  if (showRedirect) {
    return <RedirectPage countdown={countdown} />;
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Update Organization Profile</h2>
      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">{error}</div>}
      {success && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">{success}</div>}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-700 text-sm font-semibold mb-2">Username</label>
          <input type="text" name="username" value={formData.username} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Enter username" />
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-semibold mb-2">Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Enter email" />
        </div>

        {/* Password Fields */}
        {['current', 'new', 'confirm'].map((type) => (
          <div className="relative" key={type}>
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              {type.charAt(0).toUpperCase() + type.slice(1)} {type !== 'confirm' ? 'Password' : 'New Password'}
            </label>
            <div className="relative">
              <input
                type={formData[`show${type.charAt(0).toUpperCase() + type.slice(1)}Password`] ? "text" : "password"}
                name={`${type}Password`}
                value={formData[`${type}Password`]}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={`Enter ${type} password`}
              />
              <button type="button" onClick={() => togglePasswordVisibility(`show${type.charAt(0).toUpperCase() + type.slice(1)}Password`)} className="absolute right-3 top-1/2 -translate-y-1/2">
                {formData[`show${type.charAt(0).toUpperCase() + type.slice(1)}Password`] ? <EyeSlashIcon className="h-5 w-5 text-gray-400" /> : <EyeIcon className="h-5 w-5 text-gray-400" />}
              </button>
            </div>
          </div>
        ))}

        <button type="submit" className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors">
          Update Profile
        </button>
      </form>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Confirm Update</h3>
            <div className="mb-4">
              <p className="text-gray-600">The following changes will be made:</p>
              <ul className="mt-2 space-y-1 text-sm text-gray-600">
                <li>• Username: {formData.username}</li>
                <li>• Email: {formData.email}</li>
                {formData.newPassword && <li>• Password will be updated</li>}
              </ul>
            </div>
            <div className="flex justify-end space-x-4">
              <button onClick={() => setShowConfirmation(false)} className="px-4 py-2 text-gray-600 hover:text-gray-800">Cancel</button>
              <button onClick={confirmUpdate} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Confirm</button>
            </div>
          </div>
        </div>
      )}

      {/* Success message with redirect notification */}
      {success && (
        <div className="fixed bottom-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg shadow-md">
          <p>{success}</p>
          <p className="text-sm">Redirecting to home page...</p>
        </div>
      )}
    </div>
  );
};

export default Orgupdateprofile;