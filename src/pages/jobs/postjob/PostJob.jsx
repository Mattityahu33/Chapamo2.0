import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiBriefcase,
  FiCheckCircle,
  FiEye,
  FiFileText,
  FiGlobe,
  FiHome,
  FiMapPin,
  FiSend,
  FiTarget,
} from 'react-icons/fi';
import api from '../../../restAPI/api';
import './PostJob.css';

const jobTypes = [
  'Full Time',
  'Part Time',
  'Contract',
  'Temporary',
  'Internship',
  'Consultancy',
  'Freelance',
  'Volunteer',
];

const categories = [
  'Technology',
  'Finance',
  'Healthcare',
  'Education',
  'Marketing',
  'Design',
  'Customer Service',
  'Human Resources',
  'Engineering',
  'Sales',
  'Operations',
  'Other',
];

const experienceLevels = ['Entry Level', 'Mid Level', 'Senior Level', 'Executive'];
const educationLevels = [
  'High School',
  'Associate Degree',
  'Bachelor Degree',
  'Master Degree',
  'PhD',
  'No Requirement',
];
const currencies = ['USD', 'EUR', 'GBP', 'CAD', 'AUD'];
const salaryUnits = ['Hour', 'Day', 'Week', 'Month', 'Year'];

const getControlClass = (hasError) => `post-job-control ${hasError ? 'has-error' : ''}`;

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
    education_required: 'Bachelor Degree',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('form');

  const filledCount = useMemo(
    () =>
      Object.values(formData).filter((value) =>
        typeof value === 'boolean' ? value : String(value).trim() !== ''
      ).length,
    [formData]
  );

  const progress = Math.round((filledCount / Object.keys(formData).length) * 100);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

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
    return Object.keys(newErrors).length === 0 ? null : newErrors;
  };

  const scrollToFirstError = (errorMap) => {
    const firstErrorField = Object.keys(errorMap)[0];
    if (firstErrorField) {
      document.querySelector(`[name="${firstErrorField}"]`)?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (validationErrors) {
      scrollToFirstError(validationErrors);
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

      setErrors({ submit: errorMessage });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePreview = () => {
    const validationErrors = validateForm();
    if (validationErrors) {
      scrollToFirstError(validationErrors);
      return;
    }
    setActiveTab('preview');
  };

  const formatSalary = () => {
    if (!formData.salary) return 'Not specified';
    return `${formData.salary_currency} ${formData.salary} per ${formData.salary_unit}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="post-job-page">
      <section className="post-job-hero">
        <div className="container post-job-hero__grid">
          <div className="post-job-hero__content">
            <span className="badge badge-primary">Employer Workspace</span>
            <h1>Post a premium job listing that is easy to scan and ready to convert.</h1>
            <p>
              Organize every detail clearly for candidates while keeping the existing payload,
              validation rules, and backend submission untouched.
            </p>

            <div className="post-job-hero__benefits">
              <span><FiCheckCircle /> Structured employer-facing workflow</span>
              <span><FiTarget /> Clear requirements and salary presentation</span>
              <span><FiEye /> Real-time preview before publishing</span>
            </div>
          </div>

          <aside className="post-job-hero__panel card">
            <div className="post-job-hero__panel-top">
              <div>
                <p className="post-job-hero__eyebrow">Completion</p>
                <h2>{progress}% ready</h2>
              </div>
              <span>{filledCount}/{Object.keys(formData).length}</span>
            </div>
            <div className="post-job-hero__progress">
              <div style={{ width: `${progress}%` }} />
            </div>
            <div className="post-job-hero__meta">
              <div>
                <strong>{formData.company_name || 'Company name'}</strong>
                <span>Employer brand</span>
              </div>
              <div>
                <strong>{formData.advert_title || 'Role title'}</strong>
                <span>Job headline</span>
              </div>
              <div>
                <strong>{formData.job_type}</strong>
                <span>Employment type</span>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="post-job-body">
        <div className="container">
          <div className="post-job-toolbar card">
            <div className="post-job-tabs">
              <button
                type="button"
                className={`post-job-tab ${activeTab === 'form' ? 'is-active' : ''}`}
                onClick={() => setActiveTab('form')}
              >
                <FiFileText />
                Fill Form
              </button>
              <button
                type="button"
                className={`post-job-tab ${activeTab === 'preview' ? 'is-active' : ''}`}
                onClick={handlePreview}
              >
                <FiEye />
                Preview
              </button>
            </div>
            <p>All required backend fields and validation rules are preserved.</p>
          </div>

          {errors.submit && <div className="post-job-submit-error">{errors.submit}</div>}

          {activeTab === 'form' ? (
            <form onSubmit={handleSubmit} className="post-job-layout">
              <div className="post-job-main">
                <Section icon={<FiBriefcase />} title="Basic information" subtitle="Capture the key details candidates notice first.">
                  <div className="post-job-grid">
                    <Field label="Contact Email*" error={errors.email}>
                      <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="hr@yourcompany.com" className={getControlClass(errors.email)} />
                    </Field>
                    <Field label="Your Username*" error={errors.username}>
                      <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="recruiter123" className={getControlClass(errors.username)} />
                    </Field>
                    <Field label="Job Title*" error={errors.advert_title}>
                      <input type="text" name="advert_title" value={formData.advert_title} onChange={handleChange} placeholder="Senior Software Engineer" className={getControlClass(errors.advert_title)} />
                    </Field>
                    <Field label="Location">
                      <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="Lusaka, Zambia" className="post-job-control" />
                    </Field>
                    <Field label="Job Type*" error={errors.job_type}>
                      <select name="job_type" value={formData.job_type} onChange={handleChange} className={getControlClass(errors.job_type)}>
                        {jobTypes.map((type) => <option key={type} value={type}>{type}</option>)}
                      </select>
                    </Field>
                    <Field label="Category*" error={errors.category}>
                      <select name="category" value={formData.category} onChange={handleChange} className={getControlClass(errors.category)}>
                        {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                      </select>
                    </Field>
                    <label className="post-job-checkbox">
                      <input type="checkbox" name="is_remote" checked={formData.is_remote} onChange={handleChange} />
                      <span>Remote Position</span>
                    </label>
                  </div>
                </Section>

                <Section icon={<FiFileText />} title="Job details" subtitle="Describe the role clearly and tell candidates how to apply.">
                  <div className="post-job-grid">
                    <Field label="Description*" error={errors.description} full>
                      <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Detailed job description..." rows={6} className={getControlClass(errors.description)} />
                    </Field>
                    <Field label="Closing Date">
                      <input type="date" name="closing_date" value={formData.closing_date} onChange={handleChange} className="post-job-control" />
                    </Field>
                    <Field label="Application Email/URL*" error={errors.application_email_url}>
                      <input type="text" name="application_email_url" value={formData.application_email_url} onChange={handleChange} placeholder="jobs@company.com or https://apply.com" className={getControlClass(errors.application_email_url)} />
                    </Field>
                  </div>
                </Section>

                <Section icon={<FiTarget />} title="Salary information" subtitle="Optional but useful context for the right applicants.">
                  <div className="post-job-grid">
                    <Field label="Salary Amount">
                      <input type="number" name="salary" value={formData.salary} onChange={handleChange} placeholder="e.g. 75000" min="0" step="0.01" className="post-job-control" />
                    </Field>
                    <Field label="Currency">
                      <select name="salary_currency" value={formData.salary_currency} onChange={handleChange} className="post-job-control">
                        {currencies.map((currency) => <option key={currency} value={currency}>{currency}</option>)}
                      </select>
                    </Field>
                    <Field label="Salary Unit">
                      <select name="salary_unit" value={formData.salary_unit} onChange={handleChange} className="post-job-control">
                        {salaryUnits.map((unit) => <option key={unit} value={unit}>{unit}</option>)}
                      </select>
                    </Field>
                  </div>
                </Section>

                <Section icon={<FiHome />} title="Company information" subtitle="Help candidates understand your brand and business context.">
                  <div className="post-job-grid">
                    <Field label="Company Name*" error={errors.company_name}>
                      <input type="text" name="company_name" value={formData.company_name} onChange={handleChange} placeholder="Your Company Inc." className={getControlClass(errors.company_name)} />
                    </Field>
                    <Field label="Company Website">
                      <input type="url" name="company_website" value={formData.company_website} onChange={handleChange} placeholder="https://company.com" className="post-job-control" />
                    </Field>
                    <Field label="Tagline">
                      <input type="text" name="company_tagline" value={formData.company_tagline} onChange={handleChange} placeholder="Brief company tagline" maxLength="255" className="post-job-control" />
                    </Field>
                    <Field label="Company Video URL">
                      <input type="url" name="company_video" value={formData.company_video} onChange={handleChange} placeholder="https://youtube.com/your-video" className="post-job-control" />
                    </Field>
                    <Field label="Twitter Handle">
                      <input type="text" name="company_twitter" value={formData.company_twitter} onChange={handleChange} placeholder="@company" className="post-job-control" />
                    </Field>
                    <Field label="Logo Path">
                      <input type="text" name="logo_path" value={formData.logo_path} onChange={handleChange} placeholder="/path/to/logo.png" className="post-job-control" />
                    </Field>
                  </div>
                </Section>

                <Section icon={<FiGlobe />} title="Requirements" subtitle="Set the level of seniority and education expectations.">
                  <div className="post-job-grid">
                    <Field label="Experience Level">
                      <select name="experience_level" value={formData.experience_level} onChange={handleChange} className="post-job-control">
                        {experienceLevels.map((level) => <option key={level} value={level}>{level}</option>)}
                      </select>
                    </Field>
                    <Field label="Education Required">
                      <select name="education_required" value={formData.education_required} onChange={handleChange} className="post-job-control">
                        {educationLevels.map((level) => <option key={level} value={level}>{level}</option>)}
                      </select>
                    </Field>
                  </div>
                </Section>
              </div>

              <aside className="post-job-sidebar">
                <div className="post-job-sidebar__card card">
                  <h3>Publishing checklist</h3>
                  <ul className="post-job-sidebar__list">
                    <li className={formData.advert_title ? 'is-complete' : ''}>Clear job title</li>
                    <li className={formData.description ? 'is-complete' : ''}>Strong role description</li>
                    <li className={formData.application_email_url ? 'is-complete' : ''}>Application path</li>
                    <li className={formData.company_name ? 'is-complete' : ''}>Company identity</li>
                    <li className={formData.salary ? 'is-complete' : ''}>Compensation guidance</li>
                  </ul>
                </div>

                <div className="post-job-sidebar__card card">
                  <h3>Snapshot</h3>
                  <div className="post-job-sidebar__meta">
                    <span><FiMapPin /> {formData.location || 'Location not provided'}</span>
                    <span><FiBriefcase /> {formData.job_type}</span>
                    <span><FiTarget /> {formData.category}</span>
                    <span><FiGlobe /> {formData.is_remote ? 'Remote enabled' : 'On-site / hybrid'}</span>
                  </div>
                </div>

                <div className="post-job-actions card">
                  <button type="button" className="btn btn-ghost btn-lg" onClick={handlePreview}>
                    <FiEye />
                    Preview Job Post
                  </button>
                  <button type="submit" className="btn btn-primary btn-lg" disabled={isSubmitting}>
                    <FiSend />
                    {isSubmitting ? 'Posting...' : 'Post Job'}
                  </button>
                </div>
              </aside>
            </form>
          ) : (
            <div className="post-job-preview card">
              <div className="post-job-preview__header">
                <div>
                  <span className="badge badge-primary">{formData.category}</span>
                  <h2>{formData.advert_title}</h2>
                  <p>{formData.company_name}</p>
                </div>
                <button type="button" className="btn btn-outline" onClick={() => setActiveTab('form')}>
                  Back to Edit
                </button>
              </div>

              <div className="post-job-preview__meta">
                <span><FiMapPin /> {formData.is_remote ? 'Remote' : formData.location || 'Location not specified'}</span>
                <span><FiBriefcase /> {formData.job_type}</span>
                <span><FiTarget /> {formatSalary()}</span>
                <span><FiGlobe /> Apply via {formData.application_email_url || 'Not specified'}</span>
              </div>

              <div className="post-job-preview__grid">
                <div className="post-job-preview__section">
                  <h3>Role description</h3>
                  <p>{formData.description || 'No description provided.'}</p>
                </div>

                <div className="post-job-preview__section">
                  <h3>Hiring details</h3>
                  <ul>
                    <li>Closing Date: {formatDate(formData.closing_date)}</li>
                    <li>Experience Level: {formData.experience_level}</li>
                    <li>Education Required: {formData.education_required}</li>
                    <li>Application Contact: {formData.email || 'Not specified'}</li>
                  </ul>
                </div>

                <div className="post-job-preview__section">
                  <h3>Company profile</h3>
                  <ul>
                    <li>Website: {formData.company_website || 'Not specified'}</li>
                    <li>Tagline: {formData.company_tagline || 'Not specified'}</li>
                    <li>Video: {formData.company_video || 'Not specified'}</li>
                    <li>Twitter: {formData.company_twitter || 'Not specified'}</li>
                  </ul>
                </div>
              </div>

              <div className="post-job-preview__actions">
                <button type="button" className="btn btn-ghost btn-lg" onClick={() => setActiveTab('form')}>
                  Back to Edit
                </button>
                <button type="button" className="btn btn-primary btn-lg" disabled={isSubmitting} onClick={handleSubmit}>
                  {isSubmitting ? 'Posting...' : 'Submit Job Post'}
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

const Section = ({ icon, title, subtitle, children }) => (
  <section className="post-job-section card">
    <div className="post-job-section__header">
      <div className="post-job-section__icon">{icon}</div>
      <div>
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>
    </div>
    {children}
  </section>
);

const Field = ({ label, error, full, children }) => (
  <label className={`post-job-field ${full ? 'post-job-field--full' : ''}`}>
    <span className="post-job-field__label">{label}</span>
    {children}
    {error && <span className="post-job-field__error">{error}</span>}
  </label>
);

export default PostJobForm;
