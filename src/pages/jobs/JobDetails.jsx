import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../restAPI/api';
import { AuthContext } from '../../context/AuthContext';
import { 
FaBookmark, 
FaRegBookmark, 
FaMapMarkerAlt, 
FaBriefcase, 
FaGraduationCap, 
FaMoneyBillWave, 
FaGlobe, 
FaCalendarAlt, 
FaArrowLeft,
FaExternalLinkAlt
} from 'react-icons/fa';

// import { motion } from 'framer-motion'; 
import './JobDetails.css';

const JobDetails = () => {
const { id } = useParams();
const navigate = useNavigate();
const { currentUser } = useContext(AuthContext);

const [job, setJob] = useState(null);
const [similarJobs, setSimilarJobs] = useState([]);
const [loading, setLoading] = useState(false);
const [similarLoading, setSimilarLoading] = useState(false);
const [error, setError] = useState(null);
const [isSaved, setIsSaved] = useState(false);

// Redirect if user not logged in
useEffect(() => {
if (!id) return;

const fetchSimilarJobs = async (category) => {
    try {
    setSimilarLoading(true);
    const res = await api.get(
        `/job_postings?category=${encodeURIComponent(category)}&exclude=${id}&limit=4`
    );
    // Defensive alignment with standardized backend format
    const data = res.data || [];
    setSimilarJobs(Array.isArray(data) ? data : []);
    } catch (err) {
    console.error('❌ Failed to fetch similar jobs:', err);
    setSimilarJobs([]);
    } finally {
    setSimilarLoading(false);
    }
};

const fetchJobDetails = async () => {
    try {
    setLoading(true);
    const res = await api.get(`/job_postings/${id}`);
    // Defensive assignment for single item
    setJob(res.data || null);

    // Load similar jobs
    if (res.data?.category) fetchSimilarJobs(res.data.category);
    } catch (err) {
    setError(err.response?.data?.error || '❌ Failed to fetch job details');
    } finally {
    setLoading(false);
    }
};

fetchJobDetails();
}, [id]);

const handleSaveJob = async () => {
if (!currentUser?.id) {
    alert('⚠️ You must be logged in to save jobs.');
    return; // Just show the alert, do NOT redirect
}

try {
    await api.post(`/saved-jobs/${id}`, { userId: currentUser.id });
    setIsSaved(true);
} catch (err) {
    console.error('❌ Failed to save job:', err);
    alert(err.response?.data?.error || 'Something went wrong while saving the job.');
}
};


    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const renderSalary = () => {
        if (!job.salary) return 'Not disclosed';
        
        let salaryStr = `${job.salary_currency} ${job.salary.toLocaleString()}`;
        if (job.salary_max) {
            salaryStr += ` - ${job.salary_currency} ${job.salary_max.toLocaleString()}`;
        }
        salaryStr += `/${job.salary_unit}`;
        
        return salaryStr;
    };

    if (loading) return (
        <div className="job-details-loading">
            <div className="spinner"></div>
            <p>Loading job details...</p>
        </div>
    );

    if (error) return (
        <div className="job-details-error">
            <div className="error-icon">⚠️</div>
            <h3>Error Loading Job</h3>
            <p>{error}</p>
            <button onClick={() => navigate(-1)} className="back-button">
                <FaArrowLeft /> Go Back
            </button>
        </div>
    );

    if (!job) return (
        <div className="job-not-found">
            <h3>Job Not Found</h3>
            <p>The job you're looking for doesn't exist or may have been removed.</p>
            <button onClick={() => navigate(-1)} className="back-button">
                <FaArrowLeft /> Back to Jobs
            </button>
        </div>
    );

    return (
        <div className="job-details-container">
            <div className="job-details-header">
                <button onClick={() => navigate(-1)} className="back-button">
                    <FaArrowLeft /> Back to Jobs
                </button>
                <div className="header-actions">
                    <button 
                        onClick={handleSaveJob} 
                        className={`save-job-button ${isSaved ? 'saved' : ''}`}
                    >
                        {isSaved ? <FaBookmark /> : <FaRegBookmark />}
                        {isSaved ? ' Saved' : ' Save Job'}
                    </button>
                    <Link 
                        to={`/jobs/${job.id}/apply`}
                        className="apply-now-button"
                    >
                        Apply Now <FaExternalLinkAlt />
                    </Link>
                </div>
            </div>

            <div className="job-details-content">
                <div className="job-overview-card">
                    <div className="company-logo-container">
                        {job.company_logo ? (
                            <img src={job.company_logo} alt={`${job.company_name} logo`} className="company-logo" />
                        ) : (
                            <div className="company-logo-placeholder">
                                <div className="logo-initial">{job.company_name.charAt(0)}</div>
                            </div>
                        )}
                    </div>

                    <div className="job-title-section">
                        <h1>{job.advert_title}</h1>
                        <h2>{job.company_name}</h2>
                        <div className="job-meta-row">
                            <span className={`job-type ${job.job_type.toLowerCase().replace(' ', '-')}`}>
                                {job.job_type}
                            </span>
                            <span className="category-badge">{job.category}</span>
                        </div>
                    </div>

                    <div className="job-highlights">
                        <div className="highlight-item">
                            <FaMapMarkerAlt className="highlight-icon" />
                            <div>
                                <span className="highlight-label">Location</span>
                                <span className="highlight-value">
                                    {job.is_remote ? 'Remote' : job.location}
                                </span>
                            </div>
                        </div>
                        <div className="highlight-item">
                            <FaMoneyBillWave className="highlight-icon" />
                            <div>
                                <span className="highlight-label">Salary</span>
                                <span className="highlight-value">
                                    {renderSalary()}
                                </span>
                            </div>
                        </div>
                        <div className="highlight-item">
                            <FaBriefcase className="highlight-icon" />
                            <div>
                                <span className="highlight-label">Experience</span>
                                <span className="highlight-value">
                                    {job.experience_level}
                                </span>
                            </div>
                        </div>
                        <div className="highlight-item">
                            <FaCalendarAlt className="highlight-icon" />
                            <div>
                                <span className="highlight-label">Posted</span>
                                <span className="highlight-value">
                                    {formatDate(job.created_at)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="job-details-main">
                    <div className="job-description-section">
                        <h3>Job Description</h3>
                        <div className="description-content" dangerouslySetInnerHTML={{ __html: job.description.replace(/\n/g, '<br/>') }}></div>
                        
                        {job.responsibilities && (
                            <div className="responsibilities-section">
                                <h4>Key Responsibilities</h4>
                                <ul>
                                    {job.responsibilities.split('\n').map((item, index) => (
                                        <li key={index}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    {job.education_required && (
                        <div className="education-section">
                            <h3><FaGraduationCap /> Education Requirements</h3>
                            <p>{job.education_required}</p>
                        </div>
                    )}

                    {job.skills_required && (
                        <div className="skills-section">
                            <h3>Skills Required</h3>
                            <div className="skills-list">
                                {job.skills_required.split(',').map((skill, index) => (
                                    <span key={index} className="skill-tag">{skill.trim()}</span>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="company-info-section">
                        <h3>About {job.company_name}</h3>
                        {job.company_tagline && <p className="company-tagline">{job.company_tagline}</p>}
                        {job.company_description && <p className="company-description">{job.company_description}</p>}
                        {job.company_website && (
                            <a 
                                href={job.company_website} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="company-website"
                            >
                                <FaGlobe /> Visit Company Website
                            </a>
                        )}
                    </div>
                </div>

                {/* Similar Jobs Section */}
                <div className="similar-jobs-section">
                    <h3>Similar Jobs in {job.category}</h3>
                    
                    {similarLoading ? (
                        <div className="similar-jobs-loading">
                            <div className="loading-spinner"></div>
                            <p>Loading similar jobs...</p>
                        </div>
                    ) : (Array.isArray(similarJobs) && similarJobs.length > 0) ? (
                        <div className="similar-jobs-grid">
                            {similarJobs.map(similarJob => (
                                <Link to={`/jobs/${similarJob.id}`} key={similarJob.id} className="similar-job-card">
                                    <div className="similar-job-header">
                                        <h4>{similarJob.advert_title}</h4>
                                        <p className="similar-job-company">{similarJob.company_name}</p>
                                    </div>
                                    <div className="similar-job-details">
                                        <span className="similar-job-type">{similarJob.job_type}</span>
                                        <span className="similar-job-location">
                                            <FaMapMarkerAlt /> {similarJob.is_remote ? 'Remote' : similarJob.location}
                                        </span>
                                        {similarJob.salary && (
                                            <span className="similar-job-salary">
                                                <FaMoneyBillWave /> {similarJob.salary_currency} {similarJob.salary.toLocaleString()}/{similarJob.salary_unit}
                                            </span>
                                        )}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <p className="no-similar-jobs">No similar jobs found in this category.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default JobDetails;