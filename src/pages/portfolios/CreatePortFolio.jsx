import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiArrowRight,
  FiBriefcase,
  FiCheckCircle,
  FiClock,
  FiGlobe,
  FiImage,
  FiInfo,
  FiLayers,
  FiMail,
  FiMapPin,
  FiPhone,
  FiStar,
  FiUser,
} from 'react-icons/fi';
import api from '../../restAPI/api';
import { AuthContext } from '../../context/AuthContext';
import './CreatePortFolio.css';

const fieldGroups = [
  ['full_name', 'profession_title', 'phone', 'email', 'location'],
  ['about_me', 'experience_years', 'availability'],
  ['skills', 'certifications', 'languages'],
  ['portfolio_url', 'profile_image_url'],
];

const CreatePortFolio = () => {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    profile_image_url: '',
  });

  useEffect(() => {
    if (!currentUser) {
      navigate('/register');
      return;
    }

    setFormData((prev) => ({
      ...prev,
      email: currentUser.email || '',
    }));
  }, [currentUser, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const completedFields = useMemo(
    () =>
      Object.values(formData).filter((value) => String(value).trim() !== '').length,
    [formData]
  );

  const progress = Math.round((completedFields / Object.keys(formData).length) * 100);

  const sectionCompletion = useMemo(
    () =>
      fieldGroups.map((group) => {
        const filled = group.filter((key) => String(formData[key]).trim() !== '').length;
        return Math.round((filled / group.length) * 100);
      }),
    [formData]
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await api.post('/portfolios', formData, { withCredentials: true });
      alert('Portfolio created!');
      navigate('/portfolios');
    } catch (err) {
      console.error('Error submitting form:', err.response?.data || err.message);
      alert('Error creating portfolio');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="create-portfolio-page">
      <section className="create-portfolio-hero">
        <div className="container create-portfolio-hero__grid">
          <div className="create-portfolio-hero__content">
            <span className="badge badge-primary">Portfolio Builder</span>
            <h1 className="create-portfolio-hero__title">
              Build a recruiter-ready profile that feels polished from the first glance.
            </h1>
            <p className="create-portfolio-hero__text">
              Present your experience, skills, and portfolio links in one premium profile that is
              easy to review on desktop and mobile.
            </p>

            <div className="create-portfolio-highlights">
              <div className="create-portfolio-highlight">
                <FiStar />
                <span>Clear professional summary and skills</span>
              </div>
              <div className="create-portfolio-highlight">
                <FiGlobe />
                <span>Portfolio and profile links kept in one place</span>
              </div>
              <div className="create-portfolio-highlight">
                <FiCheckCircle />
                <span>Submission stays fully compatible with the current backend</span>
              </div>
            </div>
          </div>

          <aside className="create-portfolio-hero__panel card">
            <div className="create-portfolio-progress__top">
              <div>
                <p className="create-portfolio-progress__eyebrow">Profile progress</p>
                <h2>{progress}% complete</h2>
              </div>
              <span className="create-portfolio-progress__count">
                {completedFields}/{Object.keys(formData).length}
              </span>
            </div>
            <div className="create-portfolio-progress__track">
              <div
                className="create-portfolio-progress__fill"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="create-portfolio-progress__sections">
              {[
                ['Identity', sectionCompletion[0]],
                ['Experience', sectionCompletion[1]],
                ['Skills', sectionCompletion[2]],
                ['Links', sectionCompletion[3]],
              ].map(([label, value]) => (
                <div key={label} className="create-portfolio-progress__section">
                  <div className="create-portfolio-progress__label">
                    <span>{label}</span>
                    <span>{value}%</span>
                  </div>
                  <div className="create-portfolio-progress__mini-track">
                    <div
                      className="create-portfolio-progress__mini-fill"
                      style={{ width: `${value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <section className="create-portfolio-body">
        <div className="container">
          <form onSubmit={handleSubmit} className="create-portfolio-form">
            <div className="create-portfolio-form__main">
              <section className="create-portfolio-section card">
                <div className="create-portfolio-section__header">
                  <div className="create-portfolio-section__icon">
                    <FiUser />
                  </div>
                  <div>
                    <h2>Identity & contact</h2>
                    <p>Keep your core details accurate so employers can reach you quickly.</p>
                  </div>
                </div>

                <div className="create-portfolio-grid">
                  <Field label="Full Name" required hint="Use the name you want recruiters to see.">
                    <Input
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleChange}
                      placeholder="Full Name"
                      required
                    />
                  </Field>

                  <Field
                    label="Professional Title"
                    required
                    hint="Example: Frontend Developer or Product Designer."
                  >
                    <Input
                      name="profession_title"
                      value={formData.profession_title}
                      onChange={handleChange}
                      placeholder="Title (e.g., Web Developer)"
                      required
                    />
                  </Field>

                  <Field label="Phone" hint="Optional, but helpful for faster contact.">
                    <Input
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Phone"
                    />
                  </Field>

                  <Field label="Email" hint="Auto-filled from your account.">
                    <Input
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Email"
                      disabled
                    />
                  </Field>

                  <Field
                    label="Location"
                    required
                    hint="City, province, or country where you’re available."
                    full
                  >
                    <Input
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="Location (e.g., Lusaka, Zambia)"
                      required
                    />
                  </Field>
                </div>
              </section>

              <section className="create-portfolio-section card">
                <div className="create-portfolio-section__header">
                  <div className="create-portfolio-section__icon">
                    <FiBriefcase />
                  </div>
                  <div>
                    <h2>Experience snapshot</h2>
                    <p>Summarize your professional story in a way that is easy to scan.</p>
                  </div>
                </div>

                <div className="create-portfolio-grid">
                  <Field
                    label="About Me"
                    required
                    hint="A concise summary of your strengths, focus, and impact."
                    full
                  >
                    <Textarea
                      name="about_me"
                      value={formData.about_me}
                      onChange={handleChange}
                      placeholder="Tell us about yourself..."
                      required
                    />
                  </Field>

                  <Field label="Years of Experience" hint="Use a number only.">
                    <Input
                      type="number"
                      name="experience_years"
                      value={formData.experience_years}
                      onChange={handleChange}
                      placeholder="Years of Experience"
                    />
                  </Field>

                  <Field label="Availability" hint="This helps recruiters understand your readiness.">
                    <select
                      name="availability"
                      value={formData.availability}
                      onChange={handleChange}
                      className="create-portfolio-control"
                    >
                      <option value="full-time">Full-time</option>
                      <option value="part-time">Part-time</option>
                      <option value="freelance">Freelance</option>
                      <option value="contract">Contract</option>
                    </select>
                  </Field>
                </div>
              </section>

              <section className="create-portfolio-section card">
                <div className="create-portfolio-section__header">
                  <div className="create-portfolio-section__icon">
                    <FiLayers />
                  </div>
                  <div>
                    <h2>Skills & credentials</h2>
                    <p>Use comma-separated values so employers can quickly identify your fit.</p>
                  </div>
                </div>

                <div className="create-portfolio-grid">
                  <Field label="Skills" hint="Example: React, UI Design, SEO" full>
                    <Input
                      name="skills"
                      value={formData.skills}
                      onChange={handleChange}
                      placeholder="Skills (comma separated)"
                    />
                  </Field>

                  <Field label="Certifications" hint="List notable certifications, licenses, or courses." full>
                    <Input
                      name="certifications"
                      value={formData.certifications}
                      onChange={handleChange}
                      placeholder="Certifications (comma separated)"
                    />
                  </Field>

                  <Field label="Languages" hint="List spoken or written languages." full>
                    <Input
                      name="languages"
                      value={formData.languages}
                      onChange={handleChange}
                      placeholder="Languages (comma separated)"
                    />
                  </Field>
                </div>
              </section>

              <section className="create-portfolio-section card">
                <div className="create-portfolio-section__header">
                  <div className="create-portfolio-section__icon">
                    <FiImage />
                  </div>
                  <div>
                    <h2>Profile links</h2>
                    <p>Add the links that strengthen your credibility and showcase your work.</p>
                  </div>
                </div>

                <div className="create-portfolio-grid">
                  <Field label="Portfolio Website URL" hint="Use the full URL if you have a live portfolio.">
                    <Input
                      name="portfolio_url"
                      value={formData.portfolio_url}
                      onChange={handleChange}
                      placeholder="Portfolio Website URL"
                    />
                  </Field>

                  <Field label="Profile Image URL" hint="Paste a hosted image link for your profile photo.">
                    <Input
                      name="profile_image_url"
                      value={formData.profile_image_url}
                      onChange={handleChange}
                      placeholder="Profile Image URL"
                    />
                  </Field>
                </div>
              </section>
            </div>

            <aside className="create-portfolio-sidebar">
              <div className="create-portfolio-sidebar__card card">
                <h3>Quick checklist</h3>
                <ul className="create-portfolio-checklist">
                  <li className={formData.full_name ? 'is-complete' : ''}>
                    <FiUser />
                    <span>Add your full name</span>
                  </li>
                  <li className={formData.profession_title ? 'is-complete' : ''}>
                    <FiBriefcase />
                    <span>Set a clear professional title</span>
                  </li>
                  <li className={formData.about_me ? 'is-complete' : ''}>
                    <FiInfo />
                    <span>Write a compelling summary</span>
                  </li>
                  <li className={formData.skills ? 'is-complete' : ''}>
                    <FiStar />
                    <span>Highlight key skills</span>
                  </li>
                  <li className={formData.portfolio_url ? 'is-complete' : ''}>
                    <FiGlobe />
                    <span>Include a portfolio link</span>
                  </li>
                </ul>
              </div>

              <div className="create-portfolio-sidebar__card card">
                <h3>What recruiters value</h3>
                <p>
                  Strong titles, specific skills, and a concise summary usually make the biggest
                  difference in first-round reviews.
                </p>
                <div className="create-portfolio-sidebar__tips">
                  <span><FiMail /> Verified account email</span>
                  <span><FiMapPin /> Clear work location</span>
                  <span><FiClock /> Availability status</span>
                  <span><FiPhone /> Direct contact info</span>
                </div>
              </div>

              <div className="create-portfolio-actions card">
                <button type="submit" className="btn btn-primary btn-lg" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Submit Portfolio'}
                  {!isSubmitting && <FiArrowRight />}
                </button>
                <p>Your existing field structure and submission payload remain unchanged.</p>
              </div>
            </aside>
          </form>
        </div>
      </section>
    </div>
  );
};

const Field = ({ label, hint, required, full, children }) => (
  <label className={`create-portfolio-field ${full ? 'create-portfolio-field--full' : ''}`}>
    <span className="create-portfolio-field__label">
      {label}
      {required && <strong>*</strong>}
    </span>
    {children}
    {hint && <span className="create-portfolio-field__hint">{hint}</span>}
  </label>
);

const Input = (props) => <input {...props} className="create-portfolio-control" />;
const Textarea = (props) => (
  <textarea {...props} className="create-portfolio-control create-portfolio-control--textarea" />
);

export default CreatePortFolio;
