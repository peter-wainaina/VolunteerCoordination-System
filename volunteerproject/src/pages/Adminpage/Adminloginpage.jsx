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
      console.log('Attempting login with:', values.email); // Debug log
  
      const response = await axios.post('http://localhost:3000/auth/login/admin', {
        email: values.email,
        password: values.password
      });
  
      console.log('Login response:', response.data); // Debug log
  
      if (response.data.token) {
        // Store token
        localStorage.setItem('token', response.data.token);
        
        // Verify token was stored
        const storedToken = localStorage.getItem('token');
        console.log('Stored token:', storedToken);
  
        // Store admin info
        localStorage.setItem('adminInfo', JSON.stringify(response.data.admin));
        
        // Navigate to dashboard
        setLoading(false);
        navigate('/admin/dashboard');
      } else {
        setError('No token received from server');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error.response?.data?.message || 'Login failed');
    }
  };
  return (
    <div className="container">
      {loading && <Loading />}
      <div className="heading">Oversee and Inspire</div>
      <form className="form" onSubmit={handleSubmit}>
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
        <input className="login-button" type="submit" value="Login" />
      </form>
      <div className="login-link">
        <span>Return to </span>
        <Link to="/" className='text-blue-500'>Home</Link>
      </div>
    </div>
  );
};

export default Adminloginpage;