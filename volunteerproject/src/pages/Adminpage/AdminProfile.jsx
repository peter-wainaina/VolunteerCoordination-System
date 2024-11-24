import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, CardContent, Typography, TextField, Button, Box, 
  Grid, IconButton, Alert, Snackbar
} from '@mui/material';
import { 
  Save as SaveIcon, Person as PersonIcon, Email as EmailIcon, 
  Lock as LockIcon, Edit as EditIcon
} from '@mui/icons-material';
import useAdminDashboard from './useAdminDashboard';
import Sidebar from './Sidebar';
import axios from 'axios';

export default function AdminProfile() {
  const navigate = useNavigate(); 
  const { activeTab, setActiveTab, isSidebarOpen, setIsSidebarOpen } = useAdminDashboard();
  
  const [adminProfile, setAdminProfile] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  
  const handleNotificationClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setShowNotification(false);
  };

  useEffect(() => {
    fetchAdminProfile();
  }, []);

  const fetchAdminProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication token not found');
        return;
      }

      const response = await axios.get('http://localhost:3000/auth/admin/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setAdminProfile(prev => ({
        ...prev,
        username: response.data.username,
        email: response.data.email,
        password: '',
        confirmPassword: ''
      }));
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError(err.response?.data?.message || 'Failed to fetch profile');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAdminProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // Validate passwords match if being updated
    if (adminProfile.password || adminProfile.confirmPassword) {
      if (adminProfile.password !== adminProfile.confirmPassword) {
        setError('Passwords do not match');
        setLoading(false);
        return;
      }
    }

    try {
      const token = localStorage.getItem('token');
      const updateData = {
        username: adminProfile.username,
        email: adminProfile.email,
        ...(adminProfile.password && { password: adminProfile.password })
      };

      const response = await axios.put(
        'http://localhost:3000/auth/admin/profile',
        updateData,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      setSuccess('Profile updated successfully');
      setIsEditing(false);
      // Clear password fields
      setAdminProfile(prev => ({
        ...prev,
        password: '',
        confirmPassword: ''
      }));

      setTimeout(() => {
        navigate('/admin/dashboard');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#f5f5f5]">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      <main className={`flex-1 p-12 bg-white transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
      <Snackbar
          open={showNotification}
          autoHideDuration={2000}
          onClose={handleNotificationClose}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert 
            onClose={handleNotificationClose} 
            severity="success" 
            sx={{ width: '100%' }}
          >
            Profile updated successfully! Redirecting...
          </Alert>
        </Snackbar>
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <Card sx={{ maxWidth: 600, width: '100%' }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h5" component="h2" fontWeight="bold" color="primary">
                  Admin Profile
                </Typography>
                <IconButton 
                  color="primary" 
                  onClick={() => setIsEditing(!isEditing)}
                  aria-label="edit profile"
                >
                  <EditIcon />
                </IconButton>
              </Box>

              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
              )}
              {success && (
                <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>
              )}

              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Username"
                      name="username"
                      value={adminProfile.username}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      InputProps={{
                        startAdornment: <PersonIcon color="action" sx={{ mr: 1 }} />,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Email"
                      name="email"
                      type="email"
                      value={adminProfile.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      InputProps={{
                        startAdornment: <EmailIcon color="action" sx={{ mr: 1 }} />,
                      }}
                    />
                  </Grid>
                  {isEditing && (
                    <>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="New Password"
                          name="password"
                          type="password"
                          value={adminProfile.password}
                          onChange={handleInputChange}
                          InputProps={{
                            startAdornment: <LockIcon color="action" sx={{ mr: 1 }} />,
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Confirm New Password"
                          name="confirmPassword"
                          type="password"
                          value={adminProfile.confirmPassword}
                          onChange={handleInputChange}
                          InputProps={{
                            startAdornment: <LockIcon color="action" sx={{ mr: 1 }} />,
                          }}
                        />
                      </Grid>
                    </>
                  )}
                  {isEditing && (
                    <Grid item xs={12}>
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        startIcon={<SaveIcon />}
                        fullWidth
                        disabled={loading}
                        sx={{ 
                          bgcolor: '#3B8FF3', 
                          '&:hover': { bgcolor: 'rgba(59, 143, 243, 0.9)' }
                        }}
                      >
                        {loading ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </Grid>
                  )}
                </Grid>
              </form>
            </CardContent>
          </Card>
        </Box>
      </main>
    </div>
  );
}