import React, { useEffect, useState, useContext } from "react";
import api from "../../../restAPI/api";
import { AuthContext } from "../../../context/AuthContext";
import { Link } from "react-router-dom";
import "./SavedJobs.css";


const SavedJobs = () => {
  const { currentUser } = useContext(AuthContext);
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch saved jobs
  useEffect(() => {
    const fetchSavedJobs = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/saved-jobs`, {
          params: { userId: currentUser.id },
        });
        // Defensive alignment with standardized backend format
        const data = res.data || [];
        setSavedJobs(Array.isArray(data) ? data : []);
        setError(null);
      } catch (err) {
        console.error("❌ Failed to fetch saved jobs:", err);
        setError("Failed to fetch saved jobs.");
        setSavedJobs([]);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser?.id) {
      fetchSavedJobs();
    }
  }, [currentUser?.id]);

  // Unsave a job
  const handleUnsave = async (jobId) => {
    try {
      await api.delete(`/saved-jobs/${jobId}`, {
        data: { userId: currentUser.id } // ✅ still sending userId
      });
  
      setSavedJobs((prev) => prev.filter((job) => job.job_id !== jobId));
    } catch (err) {
      console.error("❌ Failed to unsave job:", err);
      alert(err.response?.data?.error || "Failed to unsave job.");
    }
  };
  
  

  if (loading) return <p>Loading saved jobs...</p>;
  if (error) return <p>{error}</p>;
  if (!savedJobs.length) return <p>You have no saved jobs.</p>;

  return (
    <div className="saved-jobs-page">
      <h2>Your Saved Jobs</h2>
      <ul className="saved-jobs-list">
        {Array.isArray(savedJobs) && savedJobs.map((job) => (
          <li key={job.saved_id} className="saved-job-item">
            <Link to={`/jobs/${job.job_id}`} className="saved-job-link">
              <h3>{job.title}</h3>
              <p>{job.company_name}</p>
              <p>{job.location}</p>
              {job.salary && <p>Salary: {job.salary}</p>}
              <p>Status: {job.status}</p>
              <p>Saved on: {new Date(job.saved_at).toLocaleDateString()}</p>
            </Link>
            <button onClick={() => handleUnsave(job.job_id)}>Unsave</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SavedJobs;
