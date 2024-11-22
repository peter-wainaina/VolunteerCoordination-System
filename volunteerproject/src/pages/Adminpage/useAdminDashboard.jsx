import  {useState,useEffect} from 'react'
import { saveAs } from 'file-saver'; 
import axios from 'axios';

const useAdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('home');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [currentChart, setCurrentChart] = useState('signups');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [feedbacks, setFeedbacks] = useState([]);
    const [users, setUsers] = useState([]);
    const [dateRange, setDateRange] = useState('daily');
    const [volunteers, setVolunteers] = useState([]);
    // const [organizations, setOrganizations] = useState([]);
    const [stats, setStats] = useState({totalVolunteers: 0,totalOrganizations: 0,volunteerHours: 0,ongoingOpportunities: 0,completedOpportunities: 0 });
    const [changes, setChanges] = useState({totalVolunteers: 0,totalOrganizations: 0,volunteerHours: 0,opportunities: 0 });
    const [chartData, setChartData] = useState({volunteerEngagement: [],volunteerMetrics: [],userSignups: [],applicationTrends: [],opportunityTypes: []});
    const [timePeriods, setTimePeriods] = useState({volunteerEngagement: 'weekly',volunteerMetrics: 'weekly',userSignups: 'monthly',applicationTrends: 'monthly',opportunityTypes: 'monthly'});
    const [editingId, setEditingId] = useState(null);
    const [newUser, setNewUser] = useState({ type: 'volunteer', username: '', password: '', email: '', phone: '', name: '', availability: '', skills: [] });

   
    const [adminProfile, setAdminProfile] = useState({
      username: 'admin',
      email: 'admin@example.com',
      password: '********'
    });
    const [notifications, setNotifications] = useState([ { id: 1, message: 'New volunteer registration', read: false },
      { id: 2, message: 'New opportunity posted', read: false }]);
    
      const fetchDashboardStats = async () => {
        try {
          const response = await axios.get('http://localhost:3000/api/dashboard-stats');
          console.log('API response:', response.data);
          setStats(response.data); // Ensure stats is always an object
          setChanges(response.data.changes);
          setLoading(false);
        } catch (err) {

          console.error('Error fetching dashboard stats:', err);
          setError('Failed to fetch dashboard stats');
          setLoading(false);
        }
      };
      const fetchChartData = async (endpoint, period) => {
        try {
          const response = await axios.get(`http://localhost:3000/api/stats/${endpoint}`, {
            params: { period }
          });
          return response.data;
        } catch (error) {
          console.error(`Error fetching ${endpoint} data:`, error);
          return [];
        }
      };
      // Update all chart data
  const updateChartData = async () => {
    try {
      const [engagement, metrics, signups, trends, types] = await Promise.all([
        fetchChartData('volunteer-engagement', timePeriods.volunteerEngagement),
        fetchChartData('volunteer-metrics', timePeriods.volunteerMetrics),
        fetchChartData('user-signups', timePeriods.userSignups),
        fetchChartData('application-trends', timePeriods.applicationTrends),
        fetchChartData('opportunity-types', timePeriods.opportunityTypes)
      ]);

      setChartData({
        volunteerEngagement: engagement,
        volunteerMetrics: metrics,
        userSignups: signups,
        applicationTrends: trends,
        opportunityTypes: types
      });
    } catch (error) {
      console.error('Error updating chart data:', error);
      setError('Failed to update chart data');
    }
  };
  const handlePeriodChange = (chartType, period) => {
    setTimePeriods(prev => ({
      ...prev,
      [chartType]: period
    }));
  };
      

 

    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/users');
        setUsers(response.data);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError(err.response?.data?.message || 'Failed to fetch users');
      }
    };
  
    const updateUser = async (id, userData) => {
      try {
        const token = localStorage.getItem('adminToken');
        await axios.put(`http://localhost:3000/api/users/${id}`, userData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchUsers(); // Refresh the user list
      } catch (err) {
        console.error('Error updating user:', err);
        setError(err.response?.data?.message || 'Failed to update user');
      }
    };
  
    const deleteUser = async (id) => {
      try {
        const token = localStorage.getItem('adminToken');
        await axios.delete(`http://localhost:3000/api/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchUsers(); // Refresh the user list
      } catch (err) {
        console.error('Error deleting user:', err);
        setError(err.response?.data?.message || 'Failed to delete user');
      }
    };
    const handleEdit = (id) => setEditingId(id);
    const handleSave = () => setEditingId(null);
    const handleChange = (id, field, value, isVolunteer) => {
      const updateFunction = isVolunteer ? setVolunteers : setOrganizations;
      updateFunction(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
    };
  
    const handleDelete = (id, isVolunteer) => {
      const updateFunction = isVolunteer ? setVolunteers : setOrganizations;
      updateFunction(prev => prev.filter(item => item.id !== id));
    };
  
    // const handleAddUser = (e) => {
    //   e.preventDefault();
    //   if (newUser.type === 'volunteer') {
    //     setVolunteers([...volunteers, { ...newUser, id: volunteers.length + 1, totalHours: 0 }]);
    //   } else {
    //     setOrganizations([...organizations, { ...newUser, id: organizations.length + 1, activeProjects: 0 }]);
    //   }
    //   setNewUser({ type: 'volunteer', username: '', password: '', email: '', phone: '', name: '', availability: '', skills: [] });
    // };
    const toggleChart = () => {
      const charts = ['signups', 'opportunities', 'applications', 'skills'];
      const currentIndex = charts.indexOf(currentChart);
      const nextIndex = (currentIndex + 1) % charts.length;
      setCurrentChart(charts[nextIndex]);
    };

    const [organizations, setOrganizations] = useState([])
   

    useEffect(() => {
      fetchOrganizations()
    }, [])
  
    const fetchOrganizations = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/organizations')
        setOrganizations(response.data)
      } catch (error) {
        console.error('Error fetching organizations:', error)
        setError('Failed to fetch organizations')
      }
    }
  
    const updateOrganization = async (id, data) => {
      try {
        await axios.put(`http://localhost:3000/api/organizations/${id}`, data)
        await fetchOrganizations()
      } catch (error) {
        console.error('Error updating organization:', error)
        setError('Failed to update organization')
      }
    }
  
    const deleteOrganization = async (id) => {
      try {
        await axios.delete(`http://localhost:3000/api/organizations/${id}`)
        await fetchOrganizations()
      } catch (error) {
        console.error('Error deleting organization:', error)
        setError('Failed to delete organization')
      }
    }

    const handleAddUser = async (userData) => {
      try {
        const response = await axios.post('http://localhost:3000/api/users', userData);
        const newUser = response.data;
  
        // Update the appropriate state based on the user type
        if (userData.type === 'volunteer') {
          setVolunteers(prevVolunteers => [...prevVolunteers, newUser]);
        } else if (userData.type === 'organization') {
          setOrganizations(prevOrgs => [...prevOrgs, newUser]);
        } else if (userData.type === 'admin') {
          // Assuming you have a state for admins, update it here
          // setAdmins(prevAdmins => [...prevAdmins, newUser]);
        }
  
        // Add a notification
        const notificationMessage = `New ${userData.type} added: ${newUser.name || newUser.username}`;
        addNotification(notificationMessage);
  
        return newUser;
      } catch (error) {
        console.error('Error adding user:', error);
        throw error;
      }
    };
    const addNotification = (message) => {
      const newNotification = {
        id: Date.now(),
        message,
        read: false,
      };
      setNotifications(prevNotifications => [newNotification, ...prevNotifications]);
    };
  
    const markNotificationAsRead = (notificationId) => {
      setNotifications(prevNotifications =>
        prevNotifications.map(notification =>
          notification.id === notificationId
            ? { ...notification, read: true }
            : notification
        )
      );
    };
    const fetchFeedbacks = async () => {
      try {
        setLoading(true);
        const [volunteerResponse, organizationResponse] = await Promise.all([
          axios.get('http://localhost:3000/api/volunteer-feedback'),
          axios.get('http://localhost:3000/api/organization-feedback')
        ]);
    
        const volunteerFeedbacks = volunteerResponse.data.map(feedback => ({
          ...feedback,
          type: 'Volunteer',
          displayName: feedback.name,
          projectOrOpportunity: feedback.opportunity,
          uniqueId: `volunteer-${feedback.id}` // Add unique identifier
        }));
    
        const organizationFeedbacks = organizationResponse.data.map(feedback => ({
          ...feedback,
          type: 'Organization',
          displayName: feedback.organization_name,
          projectOrOpportunity: feedback.project_name,
          uniqueId: `org-${feedback.id}` // Add unique identifier
        }));
    
        const allFeedbacks = [...volunteerFeedbacks, ...organizationFeedbacks]
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    
        setFeedbacks(allFeedbacks);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching feedbacks:', err);
        setError('Failed to fetch feedbacks');
        setLoading(false);
      }
    };

    // const downloadReport = async (type) => {
    //   try {
    //     const data = {
    //       stats,
    //       changes,
    //       chartData
    //     };
        
    //     const blob = new Blob([JSON.stringify(data, null, 2)], {
    //       type: 'application/json'
    //     });
    //     saveAs(blob, `${type}-report-${new Date().toISOString()}.json`);
    //   } catch (error) {
    //     console.error('Error downloading report:', error);
    //   }
    // };
    
    const exportData = async (format) => {
      try {
        const data = {
          stats,
          changes,
          chartData
        };
  
        if (format === 'CSV') {
          // Convert data to CSV format
          const csvContent = Object.entries(stats)
            .map(([key, value]) => `${key},${value}`)
            .join('\n');
          const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
          saveAs(blob, `dashboard-report-${new Date().toISOString()}.csv`);
        } else if (format === 'PDF') {
          // Handle PDF export (you'll need a PDF library)
          console.log('PDF export not implemented');
        }
      } catch (error) {
        console.error('Error exporting data:', error);
      }
    };
    useEffect(() => {
      const fetchInitialData = async () => {
        setLoading(true);
        try {
          await Promise.all([
            fetchDashboardStats(),
            updateChartData()
          ]);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching initial data:', error);
          setError('Failed to load dashboard data');
          setLoading(false);
        }
      };
  
      fetchInitialData();
    }, []);

    useEffect(() => {
      updateChartData();
    }, [timePeriods]);

  
    return {
      activeTab,
      setActiveTab,
      isSidebarOpen,
      setIsSidebarOpen,
      currentChart,
      setCurrentChart,
      dateRange,
      setDateRange,
      volunteers,
      setVolunteers,
      organizations,
      setOrganizations,
      stats,
      changes,
      editingId,
      loading, 
      error,
      users,
      chartData,
      timePeriods,
      handlePeriodChange,
      fetchOrganizations,
      fetchFeedbacks,
      updateOrganization,
      deleteOrganization,
      handleAddUser,
      fetchUsers,
      updateUser,
      deleteUser,
      setEditingId,
      newUser,
      setNewUser,
      feedbacks,
      adminProfile,
      setAdminProfile,
      notifications,
      setNotifications,
      addNotification,
      markNotificationAsRead,
      handleEdit,
      handleSave,
      handleChange,
      handleDelete,
      handleAddUser,
      exportData,
      toggleChart,
    };
  
}

export default useAdminDashboard;
