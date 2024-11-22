import React, { useState, useEffect } from 'react';
import { Typography, Table, TableBody, Box, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Select, MenuItem, FormControl, InputLabel, CircularProgress, TextField, InputAdornment } from '@mui/material';
import { Download as DownloadIcon, Search as SearchIcon } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import BusinessIcon from '@mui/icons-material/Business';
import Header from './Header';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Loading1 from './loading1';
import Sidebar from './Sidebar';
import useAdminDashboard from './useAdminDashboard';

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  maxHeight: 'calc(100vh - 300px)',
  overflow: 'auto',
  '& .MuiTableCell-root': { padding: theme.spacing(2) },
  '& .MuiTableHead-root': { position: 'sticky', top: 0, zIndex: 1, backgroundColor: theme.palette.background.paper },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  backgroundColor: '#3B8FF3',
  color: 'white',
  '&:hover': { backgroundColor: '#3B8FF3', opacity: 0.9 },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 'bold',
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
}));

const FiltersContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  marginBottom: theme.spacing(3),
  alignItems: 'center',
  flexWrap: 'wrap',
}));

const Feedbacks = () => {
  const { feedbacks, loading, error, downloadReport, adminProfile, notifications, activeTab, setActiveTab, isSidebarOpen, setIsSidebarOpen, fetchFeedbacks } = useAdminDashboard();
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => { fetchFeedbacks(); }, []);

  const satisfactionMap = {
    'very-satisfied': 'Very Satisfied',
    'satisfied': 'Satisfied',
    'neutral': 'Neutral',
    'dissatisfied': 'Dissatisfied',
    'very-dissatisfied': 'Very Dissatisfied'
  };

  const filteredFeedbacks = feedbacks.filter(feedback => {
    const matchesFilter = filter === 'All' || feedback.type === filter;
    const searchString = searchTerm.toLowerCase();
    const matchesSearch = (feedback.name || feedback.organization_name || '')?.toLowerCase().includes(searchString) || feedback.email?.toLowerCase().includes(searchString) || (feedback.opportunity || feedback.project_name || '')?.toLowerCase().includes(searchString) || feedback.feedback?.toLowerCase().includes(searchString);
    return matchesFilter && matchesSearch;
  });

  if (loading) return (<Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh"><Loading1 /></Box>);
  if (error) return (<Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh"><Typography color="error" variant="h6">{error}</Typography></Box>);

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Feedback Report', 14, 22);
    const headers = ['Type', 'Name', 'Email', 'Project/Opportunity', 'Satisfaction', 'Feedback', 'Date'];
    const data = feedbacks.map(feedback => [
      feedback.type,
      feedback.type === 'Volunteer' ? feedback.name : feedback.organization_name,
      feedback.email,
      feedback.type === 'Volunteer' ? feedback.opportunity : feedback.project_name,
      satisfactionMap[feedback.satisfaction],
      feedback.feedback,
      new Date(feedback.created_at).toLocaleDateString()
    ]);
    doc.autoTable({
      head: [headers],
      body: data,
      startY: 30,
    });

    // Save the PDF
    doc.save('feedback_report.pdf');
  };

  return (
    <div className="flex h-screen bg-[#1E1E2C]">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header adminProfile={adminProfile} notifications={notifications} isSidebarOpen={isSidebarOpen} />
        <main className={`flex-1 p-12 bg-white transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
          <Box sx={{ maxWidth: 1200, margin: 'auto', padding: 3 }}>
            <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold', color: '#1E1E2C', mb: 3 }}>Feedback and Suggestions</Typography>
            <FiltersContainer>
              <FormControl sx={{ minWidth: 120 }}>
                <InputLabel id="filter-label">Filter</InputLabel>
                <Select labelId="filter-label" value={filter} label="Filter" onChange={(e) => setFilter(e.target.value)}>
                  <MenuItem value="All">All</MenuItem>
                  <MenuItem value="Volunteer">Volunteer</MenuItem>
                  <MenuItem value="Organization">Organization</MenuItem>
                </Select>
              </FormControl>
              <TextField placeholder="Search feedback..." variant="outlined" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} sx={{ flexGrow: 1 }} 
                InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon /></InputAdornment>) }}
              />
            </FiltersContainer>
            {filteredFeedbacks.length > 0 ? (
              <StyledTableContainer component={Paper}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <StyledTableCell>User Type</StyledTableCell>
                      <StyledTableCell>Name</StyledTableCell>
                      <StyledTableCell>Email</StyledTableCell>
                      <StyledTableCell>Project/Opportunity</StyledTableCell>
                      <StyledTableCell>Satisfaction</StyledTableCell>
                      <StyledTableCell>Feedback</StyledTableCell>
                      <StyledTableCell>Date</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredFeedbacks.map((feedback, index) => (
                      <TableRow key={`${feedback.type}-${feedback.id}-${index}`} hover>
                        <TableCell>{feedback.type === 'Volunteer' ? <VolunteerActivismIcon color="primary" /> : <BusinessIcon color="secondary" />} {feedback.type}</TableCell>
                        <TableCell>{feedback.type === 'Volunteer' ? feedback.name : feedback.organization_name}</TableCell>
                        <TableCell>{feedback.email}</TableCell>
                        <TableCell>{feedback.type === 'Volunteer' ? feedback.opportunity : feedback.project_name}</TableCell>
                        <TableCell>{satisfactionMap[feedback.satisfaction]}</TableCell>
                        <TableCell>{feedback.feedback}</TableCell>
                        <TableCell>{new Date(feedback.created_at).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </StyledTableContainer>
            ) : (
              <Typography variant="h6" textAlign="center" color="text.secondary" py={4}>No feedback data available.</Typography>
            )}
            <StyledButton variant="contained" startIcon={<DownloadIcon />} onClick={downloadPDF} disabled={filteredFeedbacks.length === 0}>Download Report</StyledButton>
          </Box>
        </main>
      </div>
    </div>
  );
};

export default Feedbacks;