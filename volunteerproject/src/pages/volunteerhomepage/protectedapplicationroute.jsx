import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Loading1 from './loading1';

const ProtectedApplicationRoute = ({ children }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        alert('Please log in to apply for opportunities');
        navigate('/login/volunteer');
        return;
      }

      try {
        // Verify token with backend
        const response = await fetch('http://localhost:3000/api/auth/verify', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Token verification failed');
        }

        setIsAuthenticated(true);
      } catch (error) {
        console.error('Authentication error:', error);
        localStorage.removeItem('token');
        alert('Your session has expired. Please log in again.');
        navigate('/login/volunteer');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loading1 />
      </div>
    );
  }

  return isAuthenticated ? children : null;
};

export default ProtectedApplicationRoute;