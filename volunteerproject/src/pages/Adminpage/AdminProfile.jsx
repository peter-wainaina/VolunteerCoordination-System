import React from 'react';
import { 
  Card, CardContent, Typography, TextField, Button, Box, Avatar,
  Grid, IconButton
} from '@mui/material';
import { 
  Save as SaveIcon, Person as PersonIcon, Email as EmailIcon, 
  Lock as LockIcon, Edit as EditIcon
} from '@mui/icons-material';
import  useAdminDashboard  from './useAdminDashboard';
import Sidebar from './Sidebar'

export default function AdminProfile() {
  const { adminProfile, setAdminProfile,activeTab,setActiveTab,isSidebarOpen,setIsSidebarOpen } = useAdminDashboard();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Updating admin profile:', adminProfile);
  };

  return (
    <div className="flex h-screen bg-[#f5f5f5]">
    <Sidebar
     activeTab={activeTab}
     setActiveTab={setActiveTab}
     isSidebarOpen={isSidebarOpen}
     setIsSidebarOpen={setIsSidebarOpen}
    />
 <main className={`flex-1 p-12  bg-white transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
    <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
      <Card sx={{ maxWidth: 600, width: '100%' }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h5" component="h2" fontWeight="bold" color="primary">
              Admin Profile
            </Typography>
            <IconButton color="primary" aria-label="edit profile">
              <EditIcon />
            </IconButton>
          </Box>
          <Typography variant="body2" color="text.secondary" mb={3}>
            View and edit your admin profile
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Username"
                  value={adminProfile.username}
                  onChange={(e) => setAdminProfile({...adminProfile, username: e.target.value})}
                  InputProps={{
                    startAdornment: <PersonIcon color="action" sx={{ mr: 1 }} />,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={adminProfile.email}
                  onChange={(e) => setAdminProfile({...adminProfile, email: e.target.value})}
                  InputProps={{
                    startAdornment: <EmailIcon color="action" sx={{ mr: 1 }} />,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  value={adminProfile.password}
                  onChange={(e) => setAdminProfile({...adminProfile, password: e.target.value})}
                  InputProps={{
                    startAdornment: <LockIcon color="action" sx={{ mr: 1 }} />,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  startIcon={<SaveIcon />}
                  fullWidth
                  sx={{ 
                    bgcolor: '#3B8FF3', 
                    '&:hover': { bgcolor: 'rgba(59, 143, 243, 0.9)' }
                  }}
                >
                  Save Changes
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Box>
    </main>
    </div>
  );
}