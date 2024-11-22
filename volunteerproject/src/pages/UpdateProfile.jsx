import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  TextField, Button, Container, Box, Typography, MenuItem, 
  CircularProgress, Paper, Snackbar, Alert, Select, FormControl, 
  InputLabel, Chip, Dialog, DialogTitle, DialogContent, 
  DialogActions, IconButton, InputAdornment
} from '@mui/material';
import { Visibility, VisibilityOff, Add as AddIcon } from '@mui/icons-material';

const availabilityOptions = ['Weekdays', 'Weekends', 'Flexible'];
const skillsOptions = [
  'Agriculture', 'Water Management', 'HIV/AIDS Awareness', 'Maternal Health', 
  'Child Education', 'Wildlife Conservation', 'Microfinance', 'Sustainable Energy', 
  'Community Health', 'Gender Equality', 'Youth Empowerment', 'Digital Literacy', 
  'Entrepreneurship', 'Conflict Resolution', 'Refugee Support', 
  'Environmental Conservation', 'Malaria Prevention', 'Sanitation', 
  'Food Security', 'Teacher Training'
];

const UpdateProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [values, setValues] = useState({
    name: '',
    email: '',
    phonenumber: '',
    skills: [],
    availability: '',
    password: '',
    confirmPassword: '',
    customSkill: '',
    showPassword: false,
    showConfirmPassword: false
  });
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) { navigate('/login'); return; }
        const response = await axios.get('http://localhost:3000/auth/profile', 
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setValues(prev => ({
          ...prev,
          name: response.data.name || '',
          email: response.data.email || '',
          phonenumber: response.data.phonenumber || '',
          skills: response.data.skills ? response.data.skills.split(',').map(s => s.trim()) : [],
          availability: response.data.availability || ''
        }));
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Failed to load profile data');
      }
    };
    fetchUserData();
  }, [navigate]);

  const handleCustomSkillAdd = () => {
    if (values.customSkill.trim() && !values.skills.includes(values.customSkill.trim())) {
      setValues(prev => ({
        ...prev,
        skills: [...prev.skills, prev.customSkill.trim()],
        customSkill: ''
      }));
    }
  };

  const handlePasswordVisibility = (field) => {
    setValues(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const validatePasswords = () => {
    if (values.password && values.password !== values.confirmPassword) {
      setPasswordError("Passwords don't match");
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (values.password && !validatePasswords()) {
      return;
    }
    setOpenConfirmDialog(true);
  };

  const handleConfirmUpdate = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const updateData = {
        name: values.name,
        email: values.email,
        phonenumber: values.phonenumber,
        skills: values.skills.join(','),
        availability: values.availability,
        ...(values.password && { password: values.password })
      };

      const response = await axios.put(
        'http://localhost:3000/auth/update-profile',
        updateData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.status === 200) {
        if (response.data.updatedSuggestions) {
          localStorage.setItem('matchedOpportunities', 
            JSON.stringify(response.data.updatedSuggestions)
          );
        }
        setSuccess(true);
        setTimeout(() => navigate('/home/volunteer', { state: { updatedSkills: true } }), 2000);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(error.response?.data?.message || 'Error updating profile');
    } finally {
      setLoading(false);
      setOpenConfirmDialog(false);
    }
  };

  if (success) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom>Profile Updated Successfully!</Typography>
          <CircularProgress sx={{ mt: 4, mb: 2 }} />
          <Typography variant="body1">Redirecting to homepage...</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" gutterBottom>Update Profile</Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField 
            fullWidth 
            margin="normal" 
            label="Name" 
            name="name" 
            value={values.name} 
            onChange={(e) => setValues({ ...values, name: e.target.value })} 
            required 
          />
          
          <TextField 
            fullWidth 
            margin="normal" 
            label="Email" 
            name="email" 
            type="email" 
            value={values.email} 
            onChange={(e) => setValues({ ...values, email: e.target.value })} 
            required 
          />
          
          <TextField 
            fullWidth 
            margin="normal" 
            label="Phone Number" 
            name="phonenumber" 
            value={values.phonenumber} 
            onChange={(e) => setValues({ ...values, phonenumber: e.target.value })} 
          />

          <FormControl fullWidth margin="normal">
            <InputLabel id="skills-label">Skills</InputLabel>
            <Select
              labelId="skills-label"
              multiple
              value={values.skills}
              onChange={(e) => setValues({ ...values, skills: e.target.value })}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} />
                  ))}
                </Box>
              )}
            >
              {skillsOptions.map((skill) => (
                <MenuItem key={skill} value={skill}>{skill}</MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Custom skill input */}
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <TextField
              fullWidth
              label="Add Custom Skill"
              value={values.customSkill}
              onChange={(e) => setValues({ ...values, customSkill: e.target.value })}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleCustomSkillAdd();
                }
              }}
            />
            <Button
              onClick={handleCustomSkillAdd}
              variant="contained"
              sx={{ minWidth: 'auto' }}
            >
              <AddIcon />
            </Button>
          </Box>

          <FormControl fullWidth margin="normal">
            <InputLabel id="availability-label">Availability</InputLabel>
            <Select
              labelId="availability-label"
              value={values.availability}
              label="Availability"
              onChange={(e) => setValues({ ...values, availability: e.target.value })}
            >
              {availabilityOptions.map((option) => (
                <MenuItem key={option} value={option}>{option}</MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Password fields */}
          <TextField
            fullWidth
            margin="normal"
            label="New Password"
            type={values.showPassword ? 'text' : 'password'}
            value={values.password}
            onChange={(e) => setValues({ ...values, password: e.target.value })}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => handlePasswordVisibility('showPassword')}>
                    {values.showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            margin="normal"
            label="Confirm Password"
            type={values.showConfirmPassword ? 'text' : 'password'}
            value={values.confirmPassword}
            onChange={(e) => setValues({ ...values, confirmPassword: e.target.value })}
            error={!!passwordError}
            helperText={passwordError}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => handlePasswordVisibility('showConfirmPassword')}>
                    {values.showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button 
            type="submit" 
            variant="contained" 
            fullWidth 
            sx={{ mt: 3 }} 
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Update Profile'}
          </Button>
        </Box>
      </Paper>

      {/* Confirmation Dialog */}
      <Dialog open={openConfirmDialog} onClose={() => setOpenConfirmDialog(false)}>
        <DialogTitle>Confirm Profile Update</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to update your profile?</Typography>
          {values.password && (
            <Typography color="warning.main" sx={{ mt: 1 }}>
              Note: Your password will also be updated.
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirmDialog(false)}>Cancel</Button>
          <Button onClick={handleConfirmUpdate} variant="contained" color="primary">
            Confirm Update
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError('')}>
        <Alert severity="error" onClose={() => setError('')}>{error}</Alert>
      </Snackbar>
    </Container>
  );
};

export default UpdateProfile;