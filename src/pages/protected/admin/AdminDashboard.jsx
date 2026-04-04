import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../../restAPI/api";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const navigate = useNavigate(); // ✅ Add useNavigate for redirection
  const [adminInfo, setAdminInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const res = await api.get("/auth/me", {
          withCredentials: true
        });

        // ✅ Extract data structure correctly to avoid "undefined" and UI crashes
        setAdminInfo(res.data.data || res.data);
      } catch (err) {
        setError("Failed to load admin data");
        console.error(err);

        // ✅ Redirect to login if user is unauthorized (token expired/missing)
        if (err.response?.status === 401) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [navigate]);

  if (loading) return <p>Loading admin dashboard...</p>;
  if (error) return <p className="error-message">{error}</p>;
  if (!adminInfo) return <p>Please log in again.</p>;

  return (
    <div className="admin-dashboard-container">
      <header className="admin-dashboard-header">
        <h1>Welcome, {adminInfo?.username}</h1>
        <p className="admin-role">{adminInfo?.role || "Administrator"}</p>
        <p className="admin-email">{adminInfo?.email}</p>
      </header>

      <section className="admin-actions">
        <h2>Admin Panel</h2>

        <div className="admin-buttons">
          <Link to="posts-management" className="admin-btn">
            Manage Posts
          </Link>

          <Link to="user-management" className="admin-btn">
            Manage Users
          </Link>

          <Link to="layout" className="admin-btn">
            Layout Settings
          </Link>

          <Link to="documentation" className="admin-btn">
            Documentation
          </Link>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;