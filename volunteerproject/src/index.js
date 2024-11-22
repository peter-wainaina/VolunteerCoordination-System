import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import './styles/notifications.css';
import reportWebVitals from './reportWebVitals';
import Adminloginpage from './pages/Adminpage/Adminloginpage';
import Adminpage from './pages/Adminpage/Adminpage';
import VolunteerManagement from './pages/Adminpage/VolunteerManagement';
import OrganizationManagement from './pages/Adminpage/OrganizationManagement';
import AddUser from './pages/Adminpage/AddUser';
import Feedbacks from './pages/Adminpage/Feedback';
import AdminProfile from './pages/Adminpage/AdminProfile';
import Organizationpostpage from './pages/Organizationpage/organizationpostpage';
import OrganizationDashboard from './pages/Organizationpage/organizationdashboard';
import Orgfeedback from './pages/Organizationpage/Orgfeedback';
import Organizationsignuppage from './pages/Organizationsignuppage';
import Organizationloginpage from './pages/organizationloginpage';
import Signuppage from './pages/Signuppage';
import UpdateProfile from './pages/UpdateProfile';
import Volunteerdashboard from './pages/volunteerhomepage/volunteerdashboard';
import Volunteerloginpage from './pages/volunteerloginpage';
import Savedoppotunities from './pages/volunteerhomepage/savedopportunities/Savedopportunities';
import Volunteerstats from './pages/volunteerhomepage/volunteerstats/volunteerstats';
import ApplicationPage from './pages/volunteerhomepage/card/application';
import Applications from './pages/Organizationpage/applications/applications';
import Recent from './pages/Organizationpage/recentopportunities/recentopp';
import Applicants from './pages/Organizationpage/applications/applicants';
import ProtectedApplicationRoute from './pages/volunteerhomepage/protectedapplicationroute';
// import Opportunityloader from './pages/volunteerhomepage/opportunityloader';
import NotFound from './pages/volunteerhomepage/error/Notfound';
import OpportunitiesPage from'./pages/pagination/mainopp'
import SearchAndFilter from './pages/pagination/searchandfilter'
import OpportunityCard from './pages/volunteerhomepage/opportunitycard'
import Feedback from './pages/volunteerhomepage/feedback'
import Pagination from './pages/pagination/pagination'


import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";


const router = createBrowserRouter([
  {
    path: "/",
    element: 
    <App/>,
  },

  {
    path: "/home/volunteer",
    element: 
    <Volunteerdashboard/>,
  },
  {
    path: "/opportunity/apply/:id",
    element: <ApplicationPage />,
  },
  {
    path: "/opportunity/apply/:id",
    element: (
      <ProtectedApplicationRoute>
        <ApplicationPage />
      </ProtectedApplicationRoute>
    ),
  },
  {
    path: "/application/applicant/:id",
    element: (
    
        <Applicants />
     
    ),
  },
  //  {
  //    path: "/volunteer/suggestions",
  //    element: 
  //    <Opportunityloader/>,
  //  },
  {
    path: "*",
    element: <NotFound />,
  },
  {
    path: "/volunteer/profile",
    element: 
    <UpdateProfile/>,
  },

  {
    path: "/home/feedback",
    element: 
    <Feedback/>,
  },
  {
    path: "/home/stats",
    element: 
    <Volunteerstats />,
  },
  {
    path: "/home/saved-opportunities",
    element: 
    <Savedoppotunities />,
  },
  {
    path: "/login/Admin",
    element: 
    <Adminloginpage/>,
  },
  
  {
    path:"/admin/dashboard",
    element: 
    <Adminpage/>,
  },
  {
    path:"/admin/volunteermanagement",
    element: 
    <VolunteerManagement/>,
  },
  {
    path:"/admin/organizationmanagement",
    element: 
    <OrganizationManagement/>,
  },
 
  {
    path:"/admin/add-new-user",
    element: 
    <AddUser/>,
  },
 
  {
    path:"/admin/feedbacks",
    element: 
    <Feedbacks/>,
  },
  {
    path:"/admin/admin-profile",
    element: 
    <AdminProfile/>,
  },
 
 
  {
    path: "/home/Organization",
    element: 
    <OrganizationDashboard/>,
  },
  
  {
    path: "/home/Organization/post-opportunity",
    element: 
    <Organizationpostpage />,
  },
  {
    path: "/home/Organization/view-applications",
    element: 
    <Applications />,
  },
  {
    path: "/home/Organization/view-opportunities",
    element: 
    <Recent />,
  },
  {
    path: "/home/Organization-feedback",
    element: 
    <Orgfeedback />,
  },

  
  {
    path: "/signup/volunteer",
    element: 
    <Signuppage/>,
  },
  {
    path: "/login/volunteer",
    element: 
    < Volunteerloginpage/>,
  },
  {
    path: "/signup/organization",
    element: 
    < Organizationsignuppage/>,
  },
  
  {
    path: "/login/organization",
    element: 
    < Organizationloginpage/>,
  },
  {
    path: "/OpportunitiesPage",
    element: 
    < OpportunitiesPage/>,
  },
  {
    path: "/SearchAndFilter",
    element: 
    < SearchAndFilter/>,
  },
  {
    path: "/OpportunityCard ",
    element: 
    < OpportunityCard />,
  },
  {
    path: "/Pagination",
    element: 
    < Pagination/>,
  },
  
  
]);


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  
  <React.StrictMode>
    <RouterProvider router={router}>
    <App/> 
    </RouterProvider>
    
  </React.StrictMode>
  
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
