import React, { useEffect, useState } from "react";
import api from "../../../restAPI/api";
import "./UserProfile.css"; // Optional styling

const UserProfile = () => {
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [message, setMessage] = useState("");

  // Fetch the logged-in user's portfolio
  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const res = await api.get("/portfolios/user/me", { withCredentials: true });
        setPortfolio(res.data);
        setFormData(res.data); // prefill form
      } catch (err) {
        console.error("Error fetching portfolio:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, []);

  // Handle form input change
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Save changes
  const handleUpdate = async () => {
    if (!portfolio?.id) return;
    try {
      await api.put(`/portfolios/${portfolio.id}`, formData, { withCredentials: true });
      setPortfolio(formData);
      setEditing(false);
      setMessage("Portfolio updated successfully");
    } catch (err) {
      console.error("Error updating portfolio:", err);
      setMessage("Failed to update portfolio");
    }
  };

  if (loading) return <p>Loading profile...</p>;

  if (!portfolio) return <p>No portfolio found.</p>;

  return (
    <div className="user-profile">
      <h2>User Portfolio</h2>
      {message && <p className="status-message">{message}</p>}

      <div className="profile-form">
        <label>Full Name</label>
        <input
          type="text"
          name="full_name"
          value={formData.full_name || ""}
          onChange={handleChange}
          disabled={!editing}
        />

        <label>Profession Title</label>
        <input
          type="text"
          name="profession_title"
          value={formData.profession_title || ""}
          onChange={handleChange}
          disabled={!editing}
        />

        <label>Phone</label>
        <input
          type="text"
          name="phone"
          value={formData.phone || ""}
          onChange={handleChange}
          disabled={!editing}
        />

        <label>Email</label>
        <input
          type="email"
          name="email"
          value={formData.email || ""}
          onChange={handleChange}
          disabled={!editing}
        />

        <label>Location</label>
        <input
          type="text"
          name="location"
          value={formData.location || ""}
          onChange={handleChange}
          disabled={!editing}
        />

        <label>About Me</label>
        <textarea
          name="about_me"
          value={formData.about_me || ""}
          onChange={handleChange}
          disabled={!editing}
        />

        <label>Experience (Years)</label>
        <input
          type="number"
          name="experience_years"
          value={formData.experience_years || ""}
          onChange={handleChange}
          disabled={!editing}
        />

        <label>Skills</label>
        <input
          type="text"
          name="skills"
          value={formData.skills || ""}
          onChange={handleChange}
          disabled={!editing}
        />

        <label>Certifications</label>
        <input
          type="text"
          name="certifications"
          value={formData.certifications || ""}
          onChange={handleChange}
          disabled={!editing}
        />

        <label>Languages</label>
        <input
          type="text"
          name="languages"
          value={formData.languages || ""}
          onChange={handleChange}
          disabled={!editing}
        />

        <label>Availability</label>
        <select
          name="availability"
          value={formData.availability || ""}
          onChange={handleChange}
          disabled={!editing}
        >
          <option value="full-time">Full-time</option>
          <option value="part-time">Part-time</option>
          <option value="contract">Contract</option>
        </select>

        <label>Portfolio URL</label>
        <input
          type="text"
          name="portfolio_url"
          value={formData.portfolio_url || ""}
          onChange={handleChange}
          disabled={!editing}
        />

        <label>Profile Image URL</label>
        <input
          type="text"
          name="profile_image_url"
          value={formData.profile_image_url || ""}
          onChange={handleChange}
          disabled={!editing}
        />
      </div>

      <div className="profile-actions">
        {editing ? (
          <>
            <button onClick={handleUpdate}>Save</button>
            <button onClick={() => setEditing(false)}>Cancel</button>
          </>
        ) : (
          <button onClick={() => setEditing(true)}>Edit Portfolio</button>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
