import React, { useState,useEffect } from 'react';
import { Button, Card, CardContent, CardHeader, TextField, Radio, RadioGroup, FormControlLabel, FormLabel, Snackbar,  CircularProgress,Typography} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { useNavigate } from 'react-router-dom';

function Orgform() {
  const [showToast, setShowToast] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    project: '',
    satisfaction: '',
    feedback: ''
  });
  
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  

  useEffect(() => {
    let redirectTimer;
    if (isRedirecting) {
      redirectTimer = setTimeout(() => {
        navigate('/home/organization');
      }, 3000); // Redirect after 3 seconds
    }
    return () => clearTimeout(redirectTimer);
  }, [isRedirecting, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/organization-feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      setShowToast(true);
      setFormData({
        name: '',
        email: '',
        project: '',
        satisfaction: '',
        feedback: ''
      });
      setTimeout(() => {
         setIsRedirecting(true);
      }, 100);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      // You might want to show an error toast here
    }
    finally {
      setIsSubmitting(false);
    }
  };
  const handleCloseNotification = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setShowNotification(false);
  };

  if (isRedirecting) {
    return (
      <Card sx={{ maxWidth: 500, margin: 'auto', mt: 4, textAlign: 'center', padding: 4 }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Thank you for your feedback. Redirecting to home page...
        </Typography>
      </Card>
    );
  }


  return (
    <Card sx={{ maxWidth: 500, margin: 'auto', mt: 4, maxHeight: '90vh', overflow: 'auto' }}>
      <CardHeader 
        title="Organization Feedback Form" 
        subheader="We value your input! Please share your experience as an organization."
      />
      <CardContent>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Organization Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            margin="normal"
            required
            size="small"
          />
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
            required
            size="small"
          />
          <TextField
            fullWidth
            label="Project Name"
            name="project"
            value={formData.project}
            onChange={handleChange}
            margin="normal"
            size="small"
          />
          <FormLabel component="legend" sx={{ mt: 2 }}>How satisfied were you with the volunteer collaboration?</FormLabel>
          <RadioGroup
            name="satisfaction"
            value={formData.satisfaction}
            onChange={handleChange}
          >
            <FormControlLabel value="very-satisfied" control={<Radio />} label="Very Satisfied" />
            <FormControlLabel value="satisfied" control={<Radio />} label="Satisfied" />
            <FormControlLabel value="neutral" control={<Radio />} label="Neutral" />
            <FormControlLabel value="dissatisfied" control={<Radio />} label="Dissatisfied" />
            <FormControlLabel value="very-dissatisfied" control={<Radio />} label="Very Dissatisfied" />
          </RadioGroup>
          <TextField
            fullWidth
            label="Additional Feedback"
            name="feedback"
            value={formData.feedback}
            onChange={handleChange}
            margin="normal"
            multiline
            rows={2}
            size="small"
          />
          <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            sx={{ mt: 2 }}
            endIcon={<SendIcon />}
          >
            Submit Feedback
          </Button>
        </form>
      </CardContent>
      <Snackbar
        open={showToast}
        autoHideDuration={100}
        onClose={() => setShowToast(false)}
        message="Feedback submitted successfully!"
      />
    </Card>
  );
}

export default Orgform;