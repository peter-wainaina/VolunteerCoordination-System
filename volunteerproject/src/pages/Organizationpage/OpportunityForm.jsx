import React, { useState } from 'react';
import axios from 'axios';
import './OpportunityForm.css'; // Add your styles here

const OpportunityForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    time: '',
    location: '',
    image: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataObj = new FormData();
    for (const key in formData) {
      formDataObj.append(key, formData[key]);
    }

    try {
      await axios.post('http://localhost:3000/opportunities', formDataObj);
      // Handle successful submission (e.g., show a success message)
    } catch (error) {
      console.error("Error posting opportunity", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="opportunity-form">
      <input type="text" name="title" placeholder="Opportunity Title" onChange={handleChange} required />
      <textarea name="description" placeholder="Description" onChange={handleChange} required />
      <input type="datetime-local" name="time" onChange={handleChange} required />
      <input type="text" name="location" placeholder="Location" onChange={handleChange} required />
      <input type="file" accept="image/*" onChange={handleImageChange} required />
      <button type="submit">Post Opportunity</button>
    </form>
  );
};

export default OpportunityForm;
