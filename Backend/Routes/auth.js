export const getToken = () => {
  const userType = localStorage.getItem('userType');
  switch (userType) {
    case 'volunteer':
      return localStorage.getItem('volunteerToken');
    case 'organization':
      return localStorage.getItem('organizationToken');
    case 'admin':
      return localStorage.getItem('adminToken');
    default:
      return null;
  }
};

export const getUserInfo = () => {
  const userType = localStorage.getItem('userType');
  switch (userType) {
    case 'volunteer':
      return JSON.parse(localStorage.getItem('volunteerInfo'));
    case 'organization':
      return JSON.parse(localStorage.getItem('organizationInfo'));
    case 'admin':
      return JSON.parse(localStorage.getItem('adminInfo'));
    default:
      return null;
  }
};

export const logout = () => {
  localStorage.clear();
  delete axios.defaults.headers.common['Authorization'];
};
