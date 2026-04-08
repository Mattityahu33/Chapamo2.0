import { useMemo, useState } from 'react';
import {
  FaClock,
  FaEnvelope,
  FaFacebook,
  FaLinkedin,
  FaMapMarkerAlt,
  FaPhone,
  FaTwitter,
} from 'react-icons/fa';
import axios from 'axios';
import './Contact.css';

const CONTACT_API_URL = import.meta.env.VITE_CONTACT_API_URL;

const contactCards = [
  {
    icon: <FaMapMarkerAlt />,
    title: 'Office',
    lines: ['Lusaka, Zambia', 'Remote-first collaboration with regional reach'],
  },
  {
    icon: <FaPhone />,
    title: 'Phone',
    lines: ['+260 123 456 789', '+260 987 654 321'],
  },
  {
    icon: <FaEnvelope />,
    title: 'Email',
    lines: ['info@chapamo.com', 'support@chapamo.com'],
  },
  {
    icon: <FaClock />,
    title: 'Hours',
    lines: ['Monday - Friday: 08:00 - 17:00', 'Saturday: 09:00 - 13:00'],
  },
];

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');

  const mailtoHref = useMemo(
    () =>
      `mailto:info@chapamo.com?subject=${encodeURIComponent(formData.subject || 'Chapamo enquiry')}&body=${encodeURIComponent(
        `Name: ${formData.name}\nEmail: ${formData.email}\n\n${formData.message}`
      )}`,
    [formData]
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    setStatusMessage('');

    if (!CONTACT_API_URL) {
      setSubmitStatus('error');
      setStatusMessage('Set VITE_CONTACT_API_URL to enable direct form submission from the frontend.');
      setIsSubmitting(false);
      return;
    }

    try {
      await axios.post(CONTACT_API_URL, formData);
      setSubmitStatus('success');
      setStatusMessage('Thank you. Your message has been sent successfully.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
      setStatusMessage('Something went wrong while sending your message. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-page">
      <section className="contact-hero">
        <div className="container contact-hero__grid">
          <div className="contact-hero__content">
            <span className="badge badge-primary">Contact</span>
            <h1>Reach out for support, partnerships, or product conversations.</h1>
            <p>
              We’ve redesigned the experience to feel clearer and more trustworthy, while keeping
              the form behavior frontend-safe and easy to wire into a real endpoint.
            </p>
          </div>

          <div className="contact-hero__panel card">
            <h2>Best for</h2>
            <ul>
              <li>Platform questions and support requests</li>
              <li>Employer and hiring conversations</li>
              <li>Partnership, community, or growth enquiries</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="contact-main">
        <div className="container contact-main__grid">
          <div className="contact-info">
            <div className="contact-info__grid">
              {contactCards.map((card) => (
                <article className="contact-info-card card" key={card.title}>
                  <div className="contact-info-card__icon">{card.icon}</div>
                  <h3>{card.title}</h3>
                  {card.lines.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </article>
              ))}
            </div>

            <div className="contact-social card">
              <h3>Follow Chapamo</h3>
              <p>Stay close to updates, new opportunities, and product progress.</p>
              <div className="contact-social__icons">
                <a href="https://linkedin.com/company/chapamo" aria-label="LinkedIn" target="_blank" rel="noreferrer">
                  <FaLinkedin />
                </a>
                <a href="https://twitter.com/chapamo" aria-label="Twitter" target="_blank" rel="noreferrer">
                  <FaTwitter />
                </a>
                <a href="https://facebook.com/chapamo" aria-label="Facebook" target="_blank" rel="noreferrer">
                  <FaFacebook />
                </a>
              </div>
            </div>
          </div>

          <div className="contact-form-wrap card">
            <div className="contact-form-wrap__header">
              <h2>Send Us a Message</h2>
              <p>Use the form below, or jump to email if your frontend endpoint is not configured yet.</p>
            </div>

            {submitStatus === 'success' && <div className="contact-alert contact-alert--success">{statusMessage}</div>}
            {submitStatus === 'error' && <div className="contact-alert contact-alert--error">{statusMessage}</div>}

            {!CONTACT_API_URL && (
              <div className="contact-alert contact-alert--info">
                Direct submission is not configured yet. You can still use the prepared email action below.
              </div>
            )}

            <form onSubmit={handleSubmit} className="contact-form">
              <label className="contact-field">
                <span>Full Name*</span>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required />
              </label>

              <label className="contact-field">
                <span>Email Address*</span>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required />
              </label>

              <label className="contact-field">
                <span>Subject*</span>
                <input type="text" name="subject" value={formData.subject} onChange={handleChange} required />
              </label>

              <label className="contact-field contact-field--full">
                <span>Your Message*</span>
                <textarea name="message" rows="6" value={formData.message} onChange={handleChange} required />
              </label>

              <div className="contact-form__actions">
                <button type="submit" disabled={isSubmitting} className="btn btn-primary btn-lg">
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
                <a href={mailtoHref} className="btn btn-outline btn-lg">
                  Email Instead
                </a>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
