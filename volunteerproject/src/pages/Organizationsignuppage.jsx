import React, { useState } from 'react';
import './orgsignup.css';
import { Link, useNavigate } from 'react-router-dom';

const Organizationsignuppage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:3000/auth/signup/organization', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.message); 
        return;
      }

      alert("Organization created successfully!");
      navigate('/login/organization'); // Redirect to login page after successful signup
    } catch (error) {
      console.error('Error:', error);
      alert("An error occurred during signup. Please try again.");
    }
  };

  return (
    <div className="container">
      <div className="heading">Sign up Organization</div>
      <form className="form" onSubmit={handleSubmit}>
        <input
          required
          className="input"
          type="text"
          name="username"
          id="username"
          placeholder="Enter Organization name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          required
          className="input"
          type="email"
          name="email"
          id="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          required
          className="input"
          type="password"
          name="password"
          id="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input className="login-button" type="submit" value="Sign Up" />
      </form>
      <div className="login-link">
        <span>Already have an account? </span>
        <Link to="/login/organization" className='text-blue-500'>Log in</Link>
      </div>
    </div>
  );
};

export default Organizationsignuppage;