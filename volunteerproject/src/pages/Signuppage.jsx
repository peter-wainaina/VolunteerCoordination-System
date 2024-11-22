import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loading from './loading';
import Select from 'react-select';
import './signuppage.css';

const Signuppage = () => {
  const [values, setValues] = useState({
    name: '',
    email: '',
    password: '',
    phonenumber: '',
    skills: [],
    customSkills: '',
    availability: '',
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

  const skillsOptions = [
   { value: 'Agriculture', label: 'Agriculture' },
    { value: 'Water Management', label: 'Water Management' },
    { value: 'HIV/AIDS Awareness', label: 'HIV/AIDS Awareness' },
    { value: 'Maternal Health', label: 'Maternal Health' },
    { value: 'Child Education', label: 'Child Education' },
    { value: 'Wildlife Conservation', label: 'Wildlife Conservation' },
    { value: 'Microfinance', label: 'Microfinance' },
    { value: 'Sustainable Energy', label: 'Sustainable Energy' },
    { value: 'Community Health', label: 'Community Health' },
    { value: 'Gender Equality', label: 'Gender Equality' },
    { value: 'Youth Empowerment', label: 'Youth Empowerment' },
    { value: 'Digital Literacy', label: 'Digital Literacy' },
    { value: 'Entrepreneurship', label: 'Entrepreneurship' },
    { value: 'Conflict Resolution', label: 'Conflict Resolution' },
    { value: 'Refugee Support', label: 'Refugee Support' },
    { value: 'Environmental Conservation', label: 'Environmental Conservation' },
    { value: 'Malaria Prevention', label: 'Malaria Prevention' },
    { value: 'Sanitation', label: 'Sanitation' },
    { value: 'Food Security', label: 'Food Security' },
    { value: 'Teacher Training', label: 'Teacher Training' },
    { value: 'Artisan Skills', label: 'Artisan Skills' },
    { value: 'Eco-Tourism', label: 'Eco-Tourism' },
    { value: 'Human Rights Advocacy', label: 'Human Rights Advocacy' },
    { value: 'Disaster Preparedness', label: 'Disaster Preparedness' },
    { value: 'Climate Change Adaptation', label: 'Climate Change Adaptation' },
    { value: 'Orphan Care', label: 'Orphan Care' },
    { value: 'Rural Development', label: 'Rural Development' },
    { value: 'Urban Planning', label: 'Urban Planning' },
    { value: 'Waste Management', label: 'Waste Management' },
    { value: 'Reforestation', label: 'Reforestation' },
    { value: 'Vocational Training', label: 'Vocational Training' },
    { value: 'Disability Inclusion', label: 'Disability Inclusion' },
    { value: 'Mental Health Support', label: 'Mental Health Support' },
    { value: 'Elderly Care', label: 'Elderly Care' },
    { value: 'Nutrition Education', label: 'Nutrition Education' },
    { value: 'Sports Coaching', label: 'Sports Coaching' },
    { value: 'Cultural Preservation', label: 'Cultural Preservation' },
    { value: 'Civic Education', label: 'Civic Education' },
    { value: 'Peacebuilding', label: 'Peacebuilding' },
    { value: 'Mobile Health', label: 'Mobile Health' }
  ];

  const availabilityOptions = ['Weekdays', 'Weekends', 'Flexible'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const finalSkills = [
        ...values.skills.map((skill) => skill.value), 
        ...(values.customSkills ? values.customSkills.split(',') : []), 
      ].join(', ');

      const response = await axios.post('http://localhost:3000/auth/signup', {
        ...values,
        skills: finalSkills,
      });

      if (response.status === 201) {
        alert('Your registration was successful!');
        navigate('/login/volunteer');
      }
    } catch (error) {
      console.error(error);
      if (error.response) {
        alert(`Error: ${error.response.data.message}`);
      } else if (error.request) {
        alert('No response from server. Please try again later.');
      } else {
        alert('An error occurred. Please try again.');
      }
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="signup-container">
      {loading && <Loading />}
      <div className="signup-form">
        <h2 className="form-title">Become a Volunteer</h2>
        <form onSubmit={handleSubmit}>
          <input
            required
            className="form-input"
            type="text"
            name="name"
            placeholder="Enter username"
            value={values.name}
            onChange={handleChanges}
          />
          <input
            required
            className="form-input"
            type="email"
            name="email"
            placeholder="Enter email"
            value={values.email}
            onChange={handleChanges}
          />
          <input
            required
            className="form-input"
            type="password"
            name="password"
            placeholder="Enter password"
            value={values.password}
            onChange={handleChanges}
          />
          <input
            required
            className="form-input"
            type="text"
            name="phonenumber"
            placeholder="Enter Phone Number"
            value={values.phonenumber}
            onChange={handleChanges}
          />
          <Select 
            isMulti
            name="skills"
            value={values.skills}
            onChange={handleChanges}
            options={skillsOptions}
            placeholder="Select your area of interest"
            className="react-select-container"
            classNamePrefix="react-select"
          />
          <input
            className="form-input"
            type="text"
            name="customSkills"
            placeholder="Enter additional skills"
            value={values.customSkills}
            onChange={handleChanges}
          />
          <select
            name="availability"
            value={values.availability}
            onChange={handleChanges}
            className="form-input"
          >
            <option value="">When are you available</option>
            {availabilityOptions.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
          <button type="submit" className="submit-button">
            Sign Up
          </button>
        </form>
        <div className="login-link">
          <span>Already have an account? </span>
          <Link to="/login/volunteer">Log in</Link>
        </div>
      </div>
    </div>
  );
};

export default Signuppage;