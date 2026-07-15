import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../restAPI/api";
import "./UserManagement.css";

const UserManagement = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/admin/users");
      const data = res.data || [];
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setUsers([]);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await api.put(`/admin/users/${id}/status`, { status });
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredUsers = Array.isArray(users) ? users.filter((user) => {
    return (
      (searchTerm === "" ||
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (roleFilter === "" || user.role === roleFilter) &&
      (statusFilter === "" || user.status === statusFilter)
    );
  }) : [];

  return (
    <div className="user-management">
      <h2>👥 User Management</h2>

      {/* Search & Filters */}
      <div className="filters">
        <input
          type="text"
          placeholder="Search username/email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>

    
<div className="stats-overview">
  <div className="stat-card total-users">
    <div className="stat-number">{Array.isArray(users) ? users.length : 0}</div>
    <div className="stat-label">Total Users</div>
  </div>
  <div className="stat-card active-users">
    <div className="stat-number">{Array.isArray(users) ? users.filter(u => u.status === 'active').length : 0}</div>
    <div className="stat-label">Active Users</div>
  </div>
  <div className="stat-card suspended-users">
    <div className="stat-number">{Array.isArray(users) ? users.filter(u => u.status === 'suspended').length : 0}</div>
    <div className="stat-label">Suspended</div>
  </div>
  <div className="stat-card admin-users">
    <div className="stat-number">{Array.isArray(users) ? users.filter(u => u.role === 'admin').length : 0}</div>
    <div className="stat-label">Admins</div>
  </div>
</div>

      {/* User Table */}
      <table className="user-table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Date Joined</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <tr key={user.id} className={user.status === "suspended" ? "suspended" : ""}>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <span className={`status-badge ${user.status}`}>
                    {user.status}
                  </span>
                </td>
                <td>{new Date(user.created_at).toLocaleDateString()}</td>
                <td>
                  {user.status === "active" ? (
                    <button onClick={() => handleStatusChange(user.id, "suspended")}>
                      Suspend
                    </button>
                  ) : (
                    <button onClick={() => handleStatusChange(user.id, "active")}>
                      Reactivate
                    </button>
                  )}
                  <button onClick={() => {
                    if (user.portfolio_id) {
                      navigate(`/portfolios/${user.portfolio_id}`);
                    } else {
                      alert("This user has not created a portfolio yet.");
                    }
                  }}>
                    View Details
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No users found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;
