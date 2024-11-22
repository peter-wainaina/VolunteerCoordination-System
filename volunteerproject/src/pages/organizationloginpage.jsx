import React, { useState } from 'react';
import { Link,useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loading from './loading';

const Organizationloginpage = () => {
  const [values, setValues] = useState({
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChanges = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:3000/auth/login/organization', values);

      if (response.status === 200) {
        const { token, organization } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('organizationId', organization.id);
        localStorage.setItem('organizationName', organization.username);
        alert("You've logged into your account");
        navigate('/home/Organization');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert(error.response?.data?.message || "Failed to login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      {loading && <Loading />}
      <div className="heading">Reconnect with volunteers</div>
      <form className="form" onSubmit={handleSubmit}>
        <input
          required
          className="input"
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChanges}
        />
        <input
          required
          className="input"
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChanges}
        />
      <input className="login-button" type="submit" value="Login" />
      </form>
      <div className="login-link">
        <span>Don't Have an Account? </span>
        <Link to="/signup/organization" className='text-blue-500'>Signup</Link>
      </div>
    </div>
  );
};

export default Organizationloginpage;