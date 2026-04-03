import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../../api/api";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [adminInfo, setAdminInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

useEffect(() => {
  const fetchAdminData = async () => {
    try {
      const res = await api.get("/auth/me", { withCredentials: true });

      // If backend returns { success, data }
      setAdminInfo(res.data || res);

    } catch (err) {
      setError("Failed to load admin data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  fetchAdminData();
}, []);

  if (loading) return <p>Loading admin dashboard...</p>;
  if (error) return <p className="error-message">{error}</p>;

  if (!adminInfo)
    return <p>No admin data available. Please log in again.</p>;

  return (
    <div className="admin-dashboard-container">
      <header className="admin-dashboard-header">
        <h1>Welcome, {adminInfo.username || adminInfo.name}</h1>
        <p className="admin-role">{adminInfo.role || "Administrator"}</p>
        <p className="admin-email">{adminInfo.email}</p>
      </header>

      <section className="admin-actions">
        <h2>Admin Panel</h2>
        <div className="admin-buttons">
          <Link to="posts-management" className="admin-btn">
            Manage Posts
          </Link>
          <Link to="user-mangement" className="admin-btn">
            Manage Users
          </Link>
          <Link to="layout" className="admin-btn">
            Layout Settings
          </Link>
          <Link to="Documentation" className="admin-btn">
            Documentation
          </Link>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
