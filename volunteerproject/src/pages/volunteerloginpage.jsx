import React , { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loading from './loading';
import './volunteerlogin.css'

const Loginpage = () => {
  const [values, setValues] = useState({
    
    email: '',
    password: '',
   
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); 

  const handleChanges = (e) => {
    if (e.target) {
      setValues({ ...values, [e.target.name]: e.target.value });
    } else {
      setValues({ ...values, skills: e });
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);


    try {
      const response = await axios.post('http://localhost:3000/auth/login', {
        ...values,
        
      });
 if (response.status === 201) {
        const { token, user } = response.data;
        
        // Store the token in localStorage
        localStorage.setItem('token', token);
        
        // Store user info if needed
        localStorage.setItem('user', JSON.stringify(user));

        alert("You've logged into your account");
        navigate('/home/volunteer'); 
      }
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to login. Please try again.");
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="container">
      {loading && <Loading />}
      <div className="heading">Reconnect with Your Mission</div>
      <form className="form" onSubmit={handleSubmit}>
        <input
          required
          className="input"
          type="email"
          name="email"
          placeholder="Enter email"
          value={values.email}
          onChange={handleChanges}
        />
        <input
          required
          className="input"
          type="password"
          name="password"
          placeholder="Enter password"
          value={values.password}
          onChange={handleChanges}
        />
        
        <input className="login-button" type="submit" value="Login" />
      </form>
      <div className="login-link">
        <span>Don't have Account? </span>
        <Link to="/signup/volunteer" className='text-blue-500'>Signup</Link>
      </div>
    </div>
  );
}

export default Loginpage;