import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  IconButton,
  Typography,
  Box,
  Card,
  CardContent,
  CardHeader
} from '@mui/material';
import {
  Edit as EditIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  EmojiEvents as AwardIcon
} from '@mui/icons-material';

const ManageVolunteers = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedHours, setEditedHours] = useState('');
  const [openAwardDialog, setOpenAwardDialog] = useState(false);
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  const [achievementData, setAchievementData] = useState({
    title: '',
    description: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchVolunteerHours();
  }, []);

  const fetchVolunteerHours = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/api/organization/volunteer-hours', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setVolunteers(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch volunteer hours');
      setLoading(false);
    }
  };

  const handleVerify = async (id, status, note = '') => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:3000/api/organization/verify-hours/${id}`,
        { status, verification_note: note },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      fetchVolunteerHours();
    } catch (err) {
      setError('Failed to verify hours');
    }
  };


  const handleAwardDialogOpen = (volunteer) => {
    setSelectedVolunteer(volunteer);
    setOpenAwardDialog(true);
  };

  const handleAwardSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:3000/api/volunteer/achievements',
        {
          user_id: selectedVolunteer.user_id,
          title: achievementData.title,
          description: achievementData.description
        },
        { headers: { Authorization: `Bearer ${token}` }}
      );

      setOpenAwardDialog(false);
      setAchievementData({ title: '', description: '' });
      fetchVolunteerHours();
    } catch (err) {
      setError('Failed to award achievement');
    }
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box sx={{ p: 3 }}>
    <Card>
      <CardHeader
        title="Volunteer Hours Management"
        subheader="Verify hours and award achievements"
      />
      <CardContent>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Volunteer Name</TableCell>
                <TableCell>Opportunity</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Hours</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Current Achievements</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {volunteers.map((volunteer) => (
                <TableRow key={volunteer.id}>
                  <TableCell>{volunteer.volunteer_name}</TableCell>
                  <TableCell>{volunteer.opportunity_title}</TableCell>
                  <TableCell>{new Date(volunteer.date).toLocaleDateString()}</TableCell>
                  <TableCell>{volunteer.hours}</TableCell>
                  <TableCell>
                    <Chip
                      label={volunteer.status}
                      color={
                        volunteer.status === 'verified' ? 'success' :
                        volunteer.status === 'rejected' ? 'error' : 'warning'
                      }
                    />
                  </TableCell>
                  <TableCell>
                    {volunteer.achievements?.split(',').map((achievement, index) => (
                      <Chip
                        key={index}
                        label={achievement}
                        size="small"
                        sx={{ m: 0.5 }}
                      />
                    ))}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {volunteer.status === 'pending' && (
                        <>
                          <Button
                            size="small"
                            variant="contained"
                            color="success"
                            onClick={() => handleVerify(volunteer.id, 'verified')}
                          >
                            Verify
                          </Button>
                          <Button
                            size="small"
                            variant="contained"
                            color="error"
                            onClick={() => handleVerify(volunteer.id, 'rejected')}
                          >
                            Reject
                          </Button>
                        </>
                      )}
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => {
                          setSelectedVolunteer(volunteer);
                          setOpenAwardDialog(true);
                        }}
                      >
                        <AwardIcon />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>

    {/* Award Achievement Dialog */}
    <Dialog open={openAwardDialog} onClose={() => setOpenAwardDialog(false)}>
      <DialogTitle>Award Achievement</DialogTitle>
      <DialogContent>
        <Typography variant="subtitle1" gutterBottom>
          Award achievement to {selectedVolunteer?.volunteer_name}
        </Typography>
        <TextField
          autoFocus
          margin="dense"
          label="Achievement Title"
          fullWidth
          value={achievementData.title}
          onChange={(e) => setAchievementData({...achievementData, title: e.target.value})}
        />
        <TextField
          margin="dense"
          label="Description"
          fullWidth
          multiline
          rows={4}
          value={achievementData.description}
          onChange={(e) => setAchievementData({...achievementData, description: e.target.value})}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpenAwardDialog(false)}>Cancel</Button>
        <Button onClick={handleAwardSubmit} variant="contained" color="primary">
          Award Achievement
        </Button>
      </DialogActions>
    </Dialog>
  </Box>
);
};

export default ManageVolunteers; 