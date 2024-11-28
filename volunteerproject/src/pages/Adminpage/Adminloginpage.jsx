import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loading from '../loading';

const Adminloginpage = () => {
  const [values, setValues] = useState({
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [error, setError] = useState('');
  
  const handleChanges = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('Attempting admin login with:', values.email); // Debug log
  
      // Configure axios with proper headers
      const response = await axios.post('http://localhost:3000/auth/login/admin', 
        {
          email: values.email,
          password: values.password
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
  
      console.log('Login response:', response.data); // Debug log
  
      if (response.data.token) {
        // Store token with 'adminToken' key to distinguish from regular user tokens
        localStorage.setItem('adminToken', response.data.token);
        
        // Store admin info
        localStorage.setItem('adminInfo', JSON.stringify({
          id: response.data.admin.id,
          username: response.data.admin.username,
          email: response.data.admin.email,
          role: 'admin'
        }));
        
        // Configure axios defaults for future requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        
        setLoading(false);
        navigate('/admin/dashboard');
      } else {
        setLoading(false);
        setError('Invalid credentials');
      }
    } catch (error) {
      setLoading(false);
      console.error('Login error:', error.response?.data || error.message);
      
      if (error.response?.status === 404) {
        setError('Admin not found');
      } else if (error.response?.status === 401) {
        setError('Invalid credentials');
      } else {
        setError('Login failed. Please try again.');
      }
    }
  };

  return (
    <div className="container">
      {loading && <Loading />}
      <div className="heading">Oversee and Inspire</div>
      <form className="form" onSubmit={handleSubmit}>
        {error && <div className="error-message text-red-500 mb-4">{error}</div>}
        <input
          required
          className="input"
          type="email"
          name="email"
          placeholder="Admin Email"
          onChange={handleChanges}
        />
        <input
          required
          className="input"
          type="password"
          name="password"
          placeholder="Admin Password"
          onChange={handleChanges}
        />
        <input 
          className="login-button" 
          type="submit" 
          value={loading ? "Logging in..." : "Login"} 
          disabled={loading}
        />
      </form>
      <div className="login-link">
        <span>Return to </span>
        <Link to="/" className='text-blue-500'>Home</Link>
      </div>
    </div>
  );
};

export default Adminloginpage;
