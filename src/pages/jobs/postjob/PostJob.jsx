import { useState } from 'react'; 
import api from '../../../restAPI/api';
import { useNavigate } from 'react-router-dom';
import './PostJob.css';

const PostJobForm = () => {
const navigate = useNavigate();
const [formData, setFormData] = useState({
email: '',
username: '',
advert_title: '',
location: '',
is_remote: false,
job_type: 'Full Time',
category: 'Technology',
description: '',
closing_date: '',
application_email_url: '',
salary: '',
salary_currency: 'USD',
salary_unit: 'Month',
company_name: '',
company_website: '',
company_tagline: '',
company_video: '',
company_twitter: '',
logo_path: '',
experience_level: 'Mid Level',
education_required: 'Bachelor Degree'
});

const [errors, setErrors] = useState({});
const [isSubmitting, setIsSubmitting] = useState(false);
const [activeTab, setActiveTab] = useState('form');

const jobTypes = [
'Full Time', 'Part Time', 'Contract', 'Temporary',
'Internship', 'Consultancy', 'Freelance', 'Volunteer'
];

const categories = [
'Technology', 'Finance', 'Healthcare', 'Education',
'Marketing', 'Design', 'Customer Service', 'Human Resources',
'Engineering', 'Sales', 'Operations', 'Other'
];

const experienceLevels = [
'Entry Level', 'Mid Level', 'Senior Level', 'Executive'
];

const educationLevels = [
'High School', 'Associate Degree', 'Bachelor Degree',
'Master Degree', 'PhD', 'No Requirement'
];

const currencies = ['USD', 'EUR', 'GBP', 'CAD', 'AUD'];
const salaryUnits = ['Hour', 'Day', 'Week', 'Month', 'Year'];

const handleChange = (e) => {
const { name, value, type, checked } = e.target;
setFormData(prev => ({
    ...prev,
    [name]: type === 'checkbox' ? checked : value
}));

// Clear error when user starts typing
if (errors[name]) {
    setErrors(prev => {
    const newErrors = { ...prev };
    delete newErrors[name];
    return newErrors;
    });
}
};

const validateForm = () => {
const newErrors = {};

// Required fields from backend
if (!formData.email.trim()) newErrors.email = 'Email is required';
else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Please enter a valid email';

if (!formData.username.trim()) newErrors.username = 'Username is required';

if (!formData.advert_title.trim()) newErrors.advert_title = 'Job title is required';

if (!formData.job_type.trim()) newErrors.job_type = 'Job type is required';

if (!formData.category.trim()) newErrors.category = 'Category is required';

if (!formData.description.trim()) newErrors.description = 'Description is required';

if (!formData.application_email_url.trim()) {
    newErrors.application_email_url = 'Application email/URL is required';
} else if (!/^([^\s@]+@[^\s@]+\.[^\s@]+)|(https?:\/\/\S+)$/.test(formData.application_email_url)) {
    newErrors.application_email_url = 'Please enter a valid email or URL';
}

if (!formData.company_name.trim()) newErrors.company_name = 'Company name is required';

setErrors(newErrors);
return Object.keys(newErrors).length === 0;
};

const handleSubmit = async (e) => {
e.preventDefault();

if (!validateForm()) {
    // Scroll to the first error
    const firstErrorField = Object.keys(errors)[0];
    if (firstErrorField) {
    document.querySelector(`[name="${firstErrorField}"]`)?.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
    });
    }
    return;
}

setIsSubmitting(true);

try {
    await api.post('/job_postings', formData);
    navigate('/jobs', { state: { success: 'Job posted successfully!' } });
} catch (error) {
    console.error('Error posting job:', error);
    let errorMessage = 'Failed to post job. Please try again.';
    
    if (error.response) {
    if (error.response.status === 400) {
        errorMessage = error.response.data.error || 'Missing required fields';
    } else if (error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
    }
    }
    
    setErrors({
    submit: errorMessage
    });
    
    window.scrollTo({
    top: 0,
    behavior: 'smooth'
    });
} finally {
    setIsSubmitting(false);
}
};

const formatSalary = () => {
if (!formData.salary) return 'Not specified';
return `${formData.salary_currency} ${formData.salary} per ${formData.salary_unit}`;
};

const formatDate = (dateString) => {
if (!dateString) return 'Not specified';
const options = { year: 'numeric', month: 'long', day: 'numeric' };
return new Date(dateString).toLocaleDateString(undefined, options);
};

const renderPreview = () => (
<div className="job-preview">
    <h2>Job Preview</h2>
    <p><strong>Job Title:</strong> {formData.advert_title}</p>
    <p><strong>Company:</strong> {formData.company_name}</p>
    <p><strong>Salary:</strong> {formatSalary()}</p>
    <p><strong>Closing Date:</strong> {formatDate(formData.closing_date)}</p>
    <p><strong>Description:</strong> {formData.description}</p>
    {/* Add more fields as necessary */}
</div>
);

const renderForm = () => (
<form onSubmit={handleSubmit} className="job-form">
    {errors.submit && <div className="form-error">{errors.submit}</div>}

    <div className="form-section">
    <h2>Basic Information</h2>
    <div className="form-grid">
        <div className={`form-group ${errors.email ? 'error' : ''}`}>
        <label>Contact Email*</label>
        <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="hr@yourcompany.com"
        />
        {errors.email && <span className="error-message">{errors.email}</span>}
        </div>

        <div className={`form-group ${errors.username ? 'error' : ''}`}>
        <label>Your Username*</label>
        <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="recruiter123"
        />
        {errors.username && <span className="error-message">{errors.username}</span>}
        </div>

        <div className={`form-group ${errors.advert_title ? 'error' : ''}`}>
        <label>Job Title*</label>
        <input
            type="text"
            name="advert_title"
            value={formData.advert_title}
            onChange={handleChange}
            placeholder="Senior Software Engineer"
        />
        {errors.advert_title && <span className="error-message">{errors.advert_title}</span>}
        </div>

        <div className="form-group">
        <label>Location</label>
        <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="New York, NY"
        />
        </div>

        <div className={`form-group ${errors.job_type ? 'error' : ''}`}>
        <label>Job Type*</label>
        <select
            name="job_type"
            value={formData.job_type}
            onChange={handleChange}
        >
            {jobTypes.map(type => (
            <option key={type} value={type}>{type}</option>
            ))}
        </select>
        {errors.job_type && <span className="error-message">{errors.job_type}</span>}
        </div>

        <div className={`form-group ${errors.category ? 'error' : ''}`}>
        <label>Category*</label>
        <select
            name="category"
            value={formData.category}
            onChange={handleChange}
        >
            {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
            ))}
        </select>
        {errors.category && <span className="error-message">{errors.category}</span>}
        </div>

        <div className="form-group checkbox-group">
        <label>
            <input
            type="checkbox"
            name="is_remote"
            checked={formData.is_remote}
            onChange={handleChange}
            />
            Remote Position
        </label>
        </div>
    </div>
    </div>

    <div className="form-section">
    <h2>Job Details</h2>
    <div className="form-grid">
        <div className={`form-group ${errors.description ? 'error' : ''}`}>
        <label>Description*</label>
        <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Detailed job description..."
            rows={5}
        />
        {errors.description && <span className="error-message">{errors.description}</span>}
        </div>

        <div className="form-group">
        <label>Closing Date</label>
        <input
            type="date"
            name="closing_date"
            value={formData.closing_date}
            onChange={handleChange}
        />
        </div>

        <div className={`form-group ${errors.application_email_url ? 'error' : ''}`}>
        <label>Application Email/URL*</label>
        <input
            type="text"
            name="application_email_url"
            value={formData.application_email_url}
            onChange={handleChange}
            placeholder="jobs@company.com or https://apply.com"
        />
        {errors.application_email_url && (
            <span className="error-message">{errors.application_email_url}</span>
        )}
        </div>
    </div>
    </div>

    <div className="form-section">
    <h2>Salary Information</h2>
    <div className="form-grid">
        <div className="form-group">
        <label>Salary Amount</label>
        <input
            type="number"
            name="salary"
            value={formData.salary}
            onChange={handleChange}
            placeholder="e.g. 75000"
            min="0"
            step="0.01"
        />
        </div>

        <div className="form-group">
        <label>Currency</label>
        <select
            name="salary_currency"
            value={formData.salary_currency}
            onChange={handleChange}
        >
            {currencies.map(currency => (
            <option key={currency} value={currency}>{currency}</option>
            ))}
        </select>
        </div>

        <div className="form-group">
        <label>Salary Unit</label>
        <select
            name="salary_unit"
            value={formData.salary_unit}
            onChange={handleChange}
        >
            {salaryUnits.map(unit => (
            <option key={unit} value={unit}>{unit}</option>
            ))}
        </select>
        </div>
    </div>
    </div>

    <div className="form-section">
    <h2>Company Information</h2>
    <div className="form-grid">
        <div className={`form-group ${errors.company_name ? 'error' : ''}`}>
        <label>Company Name*</label>
        <input
            type="text"
            name="company_name"
            value={formData.company_name}
            onChange={handleChange}
            placeholder="Your Company Inc."
        />
        {errors.company_name && <span className="error-message">{errors.company_name}</span>}
        </div>

        <div className="form-group">
        <label>Company Website</label>
        <input
            type="url"
            name="company_website"
            value={formData.company_website}
            onChange={handleChange}
            placeholder="https://company.com"
        />
        </div>

        <div className="form-group">
        <label>Tagline</label>
        <input
            type="text"
            name="company_tagline"
            value={formData.company_tagline}
            onChange={handleChange}
            placeholder="Brief company tagline"
            maxLength="255"
        />
        </div>

        <div className="form-group">
        <label>Company Video URL</label>
        <input
            type="url"
            name="company_video"
            value={formData.company_video}
            onChange={handleChange}
            placeholder="https://youtube.com/your-video"
        />
        </div>

        <div className="form-group">
        <label>Twitter Handle</label>
        <input
            type="text"
            name="company_twitter"
            value={formData.company_twitter}
            onChange={handleChange}
            placeholder="@company"
        />
        </div>

        <div className="form-group">
        <label>Logo Path</label>
        <input
            type="text"
            name="logo_path"
            value={formData.logo_path}
            onChange={handleChange}
            placeholder="/path/to/logo.png"
        />
        </div>
    </div>
    </div>

    <div className="form-section">
    <h2>Requirements</h2>
    <div className="form-grid">
        <div className="form-group">
        <label>Experience Level</label>
        <select
            name="experience_level"
            value={formData.experience_level}
            onChange={handleChange}
        >
            {experienceLevels.map(level => (
            <option key={level} value={level}>{level}</option>
            ))}
        </select>
        </div>

        <div className="form-group">
        <label>Education Required</label>
        <select
            name="education_required"
            value={formData.education_required}
            onChange={handleChange}
        >
            {educationLevels.map(level => (
            <option key={level} value={level}>{level}</option>
            ))}
        </select>
        </div>
    </div>
    </div>
</form>
);

// ... (keep the existing renderPreview, formatSalary, formatDate functions)

return (
<div className="post-job-container">
    <h1>Post a New Job</h1>
    
    <div className="form-tabs">
    <button
        type="button"
        className={`tab-button ${activeTab === 'form' ? 'active' : ''}`}
        onClick={() => setActiveTab('form')}
    >
        Fill Form
    </button>
    <button
        type="button"
        className={`tab-button ${activeTab === 'preview' ? 'active' : ''}`}
        onClick={() => {
        if (validateForm()) {
            setActiveTab('preview');
        } else {
            // Scroll to the first error
            const firstErrorField = Object.keys(errors)[0];
            if (firstErrorField) {
            document.querySelector(`[name="${firstErrorField}"]`)?.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
            }
        }
        }}
    >
        Preview
    </button>
    </div>

    {activeTab === 'form' ? renderForm() : renderPreview()}

    <div className="form-actions">
    {activeTab === 'form' ? (
        <>
        <button
            type="button"
            className="preview-button"
            onClick={() => {
            if (validateForm()) {
                setActiveTab('preview');
            } else {
                const firstErrorField = Object.keys(errors)[0];
                if (firstErrorField) {
                document.querySelector(`[name="${firstErrorField}"]`)?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
                }
            }
            }}
        >
            Preview Job Post
        </button>
        <button
            type="submit"
            className="submit-button"
            disabled={isSubmitting}
            onClick={handleSubmit}
        >
            {isSubmitting ? 'Posting...' : 'Post Job'}
        </button>
        </>
    ) : (
        <>
        <button
            type="button"
            className="edit-button"
            onClick={() => setActiveTab('form')}
        >
            Back to Edit
        </button>
        <button
            type="button"
            className="submit-button"
            disabled={isSubmitting}
            onClick={handleSubmit}
        >
            {isSubmitting ? 'Posting...' : 'Submit Job Post'}
        </button>
        </>
    )}
    </div>
</div>
);
};

export default PostJobForm;