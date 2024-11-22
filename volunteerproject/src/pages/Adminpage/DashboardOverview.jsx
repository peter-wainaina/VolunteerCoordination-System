import React from 'react';
import { Users, Building2, Clock, BarChart2, CheckSquare, Download } from 'lucide-react';
import { Bar, BarChart, Line, LineChart, Pie, PieChart, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { Card } from './Cardss';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import html2canvas from 'html2canvas';
import Header from './Header';
import StatCard from './statscard';
import useAdminDashboard from './useAdminDashboard';
import Loading1 from './loading1';

const COLORS = {
  primary: '#4F46E5',
  secondary: '#06B6D4',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  chart: ['#4F46E5', '#06B6D4', '#10B981', '#F59E0B', '#3B82F6', '#8B5CF6']
};

// Time period selector component
const TimeSelector = ({ value, onChange }) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="px-2 py-1 text-sm bg-white border rounded-md shadow-smhover:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-24"
  >
    <option value="daily">Daily</option>
    <option value="weekly">Weekly</option>
    <option value="monthly">Monthly</option>
    <option value="yearly">Yearly</option>
  </select>
);




export default function DashboardOverview({ isSidebarOpen }) {
  const {
    stats = {totalVolunteers: 0,totalOrganizations: 0,volunteerHours: 0,ongoingOpportunities: 0,completedOpportunities: 0},
    changes = {totalVolunteers: 0,totalOrganizations: 0,volunteerHours: 0,opportunities: 0},
    chartData = {volunteerEngagement: [],volunteerMetrics: [],userSignups: [],applicationTrends: [],opportunityTypes: []},
    loading,
    error,
    adminProfile,
    notifications,
    timePeriods,
    handlePeriodChange,
    // downloadReport,
    exportData
  } = useAdminDashboard();

  const downloadReport = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(18);
    doc.text('Dashboard Overview Report', 14, 22);
    
    // Add stats summary
    doc.setFontSize(12);
    doc.text('Summary Statistics:', 14, 35);
    const statsData = [
      ['Total Volunteers', stats?.totalVolunteers || 0],
      ['Total Organizations', stats?.totalOrganizations || 0],
      ['Volunteer Hours', stats?.volunteerHours || 0],
      ['Ongoing Opportunities', stats?.ongoingOpportunities || 0],
      ['Completed Opportunities', stats?.completedOpportunities || 0]
    ];
    doc.autoTable({
      startY: 40,
      head: [['Metric', 'Value']],
      body: statsData,
      theme: 'grid'
    });
  
    // Function to capture chart as image
    const captureChart = (chartId) => {
      const chartElement = document.getElementById(chartId);
      if (!chartElement) return null;
      
      // Use html2canvas to capture the chart
      return html2canvas(chartElement).then(canvas => {
        return canvas.toDataURL('image/png');
      });
    };
  
    // Add volunteer engagement data and chart
    const currentY = doc.lastAutoTable.finalY + 15;
    doc.text('Volunteer Engagement:', 14, currentY);
    doc.autoTable({
      startY: currentY + 5,
      head: [['Period', 'Value']],
      body: chartData?.volunteerEngagement?.map(item => [item.name, item.value]) || [],
      theme: 'grid'
    });
  
    // Add user signups data and chart
    const signupsY = doc.lastAutoTable.finalY + 15;
    doc.text('User Sign-ups:', 14, signupsY);
    doc.autoTable({
      startY: signupsY + 5,
      head: [['Period', 'Volunteers', 'Organizations']],
      body: chartData?.userSignups?.map(item => [
        item.period,
        item.volunteers,
        item.organizations
      ]) || [],
      theme: 'grid'
    });
  
    // Add volunteer metrics data and chart
    const metricsY = doc.lastAutoTable.finalY + 15;
    doc.text('Volunteer Metrics:', 14, metricsY);
    doc.autoTable({
      startY: metricsY + 5,
      head: [['Period', 'Volunteers', 'Hours', 'Projects']],
      body: chartData?.volunteerMetrics?.map(item => [
        item.name,
        item.volunteers,
        item.hours,
        item.projects
      ]) || [],
      theme: 'grid'
    });
  
    // Add application trends data and chart
    const trendsY = doc.lastAutoTable.finalY + 15;
    doc.text('Application Trends:', 14, trendsY);
    doc.autoTable({
      startY: trendsY + 5,
      head: [['Period', 'Applications', 'Accepted', 'Pending']],
      body: chartData?.applicationTrends?.map(item => [
        item.period,
        item.applications,
        item.accepted,
        item.pending
      ]) || [],
      theme: 'grid'
    });
  
    // Add opportunity types data and chart
    const typesY = doc.lastAutoTable.finalY + 15;
    doc.text('Opportunity Types:', 14, typesY);
    doc.autoTable({
      startY: typesY + 5,
      head: [['Type', 'Opportunities', 'Applications']],
      body: chartData?.opportunityTypes?.map(item => [
        item.type,
        item.opportunities,
        item.applications
      ]) || [],
      theme: 'grid'
    });
  
    // Capture and add all charts
    Promise.all([
      captureChart('volunteerEngagementChart'),
      captureChart('userSignupsChart'),
      captureChart('volunteerMetricsChart'),
      captureChart('applicationTrendsChart'),
      captureChart('opportunityTypesChart')
    ]).then(chartImages => {
      // this feature adds a new page for the image(chart)
      doc.addPage();
      doc.text('Charts and Visualizations', 14, 22);
  
      let yPosition = 40;
      chartImages.forEach((chartImage, index) => {
        if (chartImage) {
          const titles = [
            'Volunteer Engagement Chart',
            'User Sign-ups Chart',
            'Volunteer Metrics Chart',
            'Application Trends Chart',
            'Opportunity Types Chart'
          ];
          
          if (yPosition > 250) {
            doc.addPage();
            yPosition = 40;
          }
  
          doc.text(titles[index], 14, yPosition - 5);
          doc.addImage(chartImage, 'PNG', 14, yPosition, 180, 100);
          yPosition += 120;
        }
      });
  
      doc.save('dashboard_report.pdf');
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <Loading1 />
        <p className="mt-4 text-lg text-gray-600 animate-pulse">Loading dashboard data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="p-4 bg-red-50 rounded-lg text-red-600">
          <p className="font-semibold">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gray-50 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
      <Header
         adminProfile={adminProfile || {}}
         notifications={notifications || []}
         isSidebarOpen={isSidebarOpen}
      />
      
      <div className="max-w-7xl mx-auto p-12 space-y-8">
        {/* Dashboard Header */}
        <div className="bg-white rounded-xl p-8 text-black shadow-lg">
          <h2 className="text-3xl font-bold">Dashboard Overview</h2>
          <p className="mt-2 opacity-90">Welcome to your volunteer coordination dashboard</p>
        </div>

        
        <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-5">
          <StatCard
            title="Total Volunteers"
            value={stats?.totalVolunteers || 0}
            icon={<Users className="h-6 w-6 text-indigo-600" />}
            change={changes?.totalVolunteers || 0}
            className="transform hover:scale-105 transition-transform duration-300"
          />
          <StatCard
            title="Total Organizations"
            value={stats?.totalOrganizations || 0}
            icon={<Building2 className="h-6 w-6 text-cyan-600" />}
            change={changes.totalOrganizations}
            className="transform hover:scale-105 transition-transform duration-300"
          />
          <StatCard
            title="Volunteer Hours"
            value={stats?.volunteerHours || 0}
            icon={<Clock className="h-6 w-6 text-emerald-600" />}
            change={changes?.volunteerHours || 0}
            className="transform hover:scale-105 transition-transform duration-300"
          />
          <StatCard
            title="Ongoing Opportunities"
            value={stats?.ongoingOpportunities || 0}
            icon={<BarChart2 className="h-6 w-6 text-blue-600" />}
            change={changes?.opportunities || 0}
            className="transform hover:scale-105 transition-transform duration-300"
          />
          <StatCard
            title="Completed Opportunities"
            value={stats?.completedOpportunities || 0}
            icon={<CheckSquare className="h-6 w-6 text-purple-600" />}
            className="transform hover:scale-105 transition-transform duration-300"
          />
        </div>

        
        <div className="grid gap-6 lg:grid-cols-2">
          
          <Card className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Volunteer Engagement</h3>
              <TimeSelector
                value={timePeriods?.volunteerEngagement || 'weekly'}
                onChange={(period) => handlePeriodChange('volunteerEngagement', period)}
              />
            </div>
            <div id ="volunteerEngagementchart">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData?.volunteerEngagement || []}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '8px' }} />
                <Bar dataKey="value" fill={COLORS.chart[0]} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            </div>
          </Card>

         
          <Card className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">User Sign-ups</h3>
              <TimeSelector
                value={timePeriods.userSignups }
                onChange={(period) => handlePeriodChange('userSignups', period)}
              />
            </div>
            <div id="Usersignupschart">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData.userSignups}>
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '8px' }} />
                <Legend />
                <Bar dataKey="volunteers" fill={COLORS.chart[0]} radius={[4, 4, 0, 0]} />
                <Bar dataKey="organizations" fill={COLORS.chart[1]} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            </div>
          </Card>

          
          <Card className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Volunteer Metrics</h3>
              <TimeSelector
                value={timePeriods?.volunteerMetrics}
                onChange={(period) => handlePeriodChange('volunteerMetrics', period)}
              />
            </div>
            <div id =" VolunteerMetricschart">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData.volunteerMetrics}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '8px' }} />
                <Legend />
                <Line type="monotone" dataKey="volunteers" stroke={COLORS.chart[0]} strokeWidth={2} />
                <Line type="monotone" dataKey="hours" stroke={COLORS.chart[1]} strokeWidth={2} />
                <Line type="monotone" dataKey="projects" stroke={COLORS.chart[2]} strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
            </div>
          </Card>

          
          <Card className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Application Trends</h3>
              <TimeSelector
                value={timePeriods.applicationTrends}
                onChange={(period) => handlePeriodChange('applicationTrends', period)}
              />
            </div>
            <div id ="ApplicationTrendschart">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData.applicationTrends}>
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '8px' }} />
                <Legend />
                <Line type="monotone" dataKey="applications" stroke={COLORS.chart[0]} strokeWidth={2} />
                <Line type="monotone" dataKey="accepted" stroke={COLORS.chart[1]} strokeWidth={2} />
                <Line type="monotone" dataKey="pending" stroke={COLORS.chart[2]} strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
            </div>
          </Card>

          
          <Card className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Opportunity Types</h3>
              <TimeSelector
                value={timePeriods.opportunityTypes}
                onChange={(period) => handlePeriodChange('opportunityTypes', period)}
              />
            </div>
            <div id ="OpportunityTypeschart">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData.opportunityTypes}>
                <XAxis dataKey="type" />
                <YAxis />
                <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '8px' }} />
                <Legend />
                <Bar dataKey="opportunities" fill={COLORS.chart[0]} radius={[4, 4, 0, 0]} />
                <Bar dataKey="applications" fill={COLORS.chart[1]} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            </div>
          </Card>
        </div>

        
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 p-6 bg-white rounded-xl shadow-md">
          <button
            className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white px-6 py-2 rounded-lg hover:from-indigo-700 hover:to-blue-600 transform hover:scale-105 transition-all duration-300"
            onClick={downloadReport}
          >
            <Download className="inline-block mr-2 h-4 w-4" /> Download Full Report
          </button>
          <div className="flex gap-4">
            <button
              className="border border-indigo-600 text-indigo-600 px-6 py-2 rounded-lg hover:bg-indigo-50 transform hover:scale-105 transition-all duration-300"
              onClick={downloadReport}
            >
              Export as PDF
            </button>
            <button
              className="border border-blue-600 text-blue-600 px-6 py-2 rounded-lg hover:bg-blue-50 transform hover:scale-105 transition-all duration-300"
              onClick={() => exportData('CSV')}
            >
              Export as CSV
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}