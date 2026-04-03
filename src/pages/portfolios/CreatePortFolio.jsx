import React, { useState, useContext, useEffect } from 'react';
import api from '../../restAPI/api';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './CreatePortFolio.css';


const CreatePortFolio = () => {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    full_name: '',
    profession_title: '',
    phone: '',
    email: '',
    location: '',
    about_me: '',
    experience_years: '',
    skills: '',
    certifications: '',
    languages: '',
    availability: 'full-time',
    portfolio_url: '',
    profile_image_url: ''
  });

  useEffect(() => {
    if (!currentUser) {
      navigate('/register'); // redirect if not logged in
    } else {
      setFormData(prev => ({
        ...prev,
        email: currentUser.email // auto-fill email from authenticated user
      }));
    }
  }, [currentUser, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

  
    try {
      await api.post('/portfolios', formData, { withCredentials: true });
      alert('Portfolio created!');
      navigate('/portfolios');
    } catch (err) {
      console.error('Error submitting form:', err.response?.data || err.message);
      alert('Error creating portfolio');
    }
  };
  

  return (
    <div className="portfolio-form-container">
      <h2>Create Portfolio</h2>
      <form onSubmit={handleSubmit} className="portfolio-form">
        <input name="full_name" placeholder="Full Name" value={formData.full_name} onChange={handleChange} required />
        <input name="profession_title" placeholder="Title (e.g., Web Developer)" value={formData.profession_title} onChange={handleChange} required />
        <input name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} />
        <input name="email" placeholder="Email" value={formData.email} onChange={handleChange} disabled />
        <input name="location" placeholder="Location (e.g., Lusaka, Zambia)" value={formData.location} onChange={handleChange} required />
        <textarea name="about_me" placeholder="Tell us about yourself..." value={formData.about_me} onChange={handleChange} required />
        <input name="experience_years" type="number" placeholder="Years of Experience" value={formData.experience_years} onChange={handleChange} />
        <input name="skills" placeholder="Skills (comma separated)" value={formData.skills} onChange={handleChange} />
        <input name="certifications" placeholder="Certifications (comma separated)" value={formData.certifications} onChange={handleChange} />
        <input name="languages" placeholder="Languages (comma separated)" value={formData.languages} onChange={handleChange} />
        <select name="availability" value={formData.availability} onChange={handleChange}>
          <option value="full-time">Full-time</option>
          <option value="part-time">Part-time</option>
          <option value="freelance">Freelance</option>
          <option value="contract">Contract</option>
        </select>
        <input name="portfolio_url" placeholder="Portfolio Website URL" value={formData.portfolio_url} onChange={handleChange} />
        <input name="profile_image_url" placeholder="Profile Image URL" value={formData.profile_image_url} onChange={handleChange} />
        <button type="submit">Submit Portfolio</button>
      </form>
    </div>
  );
};

export default CreatePortFolio;
