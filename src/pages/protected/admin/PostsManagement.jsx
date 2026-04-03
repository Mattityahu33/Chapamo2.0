import React, { useEffect, useState } from "react";
import api from "../../../api/api";
import { Link } from "react-router-dom";
import "./PostsManagement.css";

const PostManagement = () => {
  const [pendingJobs, setPendingJobs] = useState([]);

  useEffect(() => {
    fetchPendingJobs();
  }, []);

  const fetchPendingJobs = async () => {
    try {
      const res = await api.get("/admin/pending", { withCredentials: true });
      const data = res.data || [];
      setPendingJobs(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setPendingJobs([]);
    }
  };

  const handleApprove = async (id) => {
    try {
      await api.put(`/admin/${id}/approve`, {}, { withCredentials: true });
      setPendingJobs(pendingJobs.filter((job) => job.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleReject = async (id) => {
    try {
      await api.put(`/admin/${id}/reject`, {}, { withCredentials: true });
      setPendingJobs(pendingJobs.filter((job) => job.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

// Update your JSX structure to match the CSS classes:
return (
  <div className="post-management">
    <h2>Pending Job Approvals</h2>
    {(Array.isArray(pendingJobs) && pendingJobs.length === 0) ? (
      <p>No pending jobs</p>
    ) : (
      <ul className="pending-jobs-list">
        {Array.isArray(pendingJobs) && pendingJobs.map((job) => (
          <li key={job.id} className="pending-job-item">
            <div className="job-header">
              <Link to={`/jobs/${job.id}`} className="job-title-link">
                {job.title}
              </Link>
              <Link to={`/jobs/${job.id}`} className="company-link">
                {job.company_name}
              </Link>
            </div>
            
            <div className="job-details">
              <span className="job-detail">
                <i className="fas fa-map-marker-alt"></i> {job.location}
              </span>
              {job.salary && (
                <span className="job-detail">
                  <i className="fas fa-dollar-sign"></i> {job.salary}
                </span>
              )}
            </div>
            
            <div className="job-actions">
              <button onClick={() => handleApprove(job.id)} className="approve-btn">
                <i className="fas fa-check"></i> Approve
              </button>
              <button onClick={() => handleReject(job.id)} className="reject-btn">
                <i className="fas fa-times"></i> Reject
              </button>
            </div>
          </li>
        ))}
      </ul>
    )}
  </div>
);
};

export default PostManagement;
