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
      const response = await axios.post('http://localhost:3000/auth/login/admin', values);

      if (response.status === 200 && response.data.token) {
        // Store the token in localStorage
        localStorage.setItem('adminToken', response.data.token);
        
        // Optionally, you can store admin info if needed
        localStorage.setItem('adminInfo', JSON.stringify(response.data.admin));

        alert("You've logged into your admin account");
        navigate('/admin/dashboard');
      } else {
        setError("Login failed. Please try again.");
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error.response?.data?.message || "Failed to login. Please try again.");
    } finally {
      setLoading(false);
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