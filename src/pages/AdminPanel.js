import React, { useState, useEffect } from 'react';
import { getProjects, getUsers, updateProject, deleteProject, getAnalytics } from '../utils/storage';
import { 
  Shield, Users, FolderOpen, Eye, Heart, CheckCircle, 
  XCircle, Trash2, TrendingUp, Activity 
} from 'lucide-react';
import './AdminPanel.css';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('projects');
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setProjects(getProjects());
    setUsers(getUsers());
    setAnalytics(getAnalytics());
  };

  const handleApprove = (projectId) => {
    updateProject(projectId, { status: 'approved' });
    loadData();
  };

  const handleReject = (projectId) => {
    updateProject(projectId, { status: 'rejected' });
    loadData();
  };

  const handleDelete = (projectId) => {
    if (window.confirm('Are you sure you want to delete this project permanently?')) {
      deleteProject(projectId);
      loadData();
    }
  };

  const getFilteredProjects = () => {
    if (filter === 'all') return projects;
    return projects.filter(p => p.status === filter);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    const badges = {
      approved: { icon: <CheckCircle size={16} />, class: 'badge-success', text: 'Approved' },
      pending: { icon: <Activity size={16} />, class: 'badge-warning', text: 'Pending' },
      rejected: { icon: <XCircle size={16} />, class: 'badge-danger', text: 'Rejected' }
    };
    const badge = badges[status];
    return (
      <span className={`badge ${badge.class}`}>
        {badge.icon}
        {badge.text}
      </span>
    );
  };

  return (
    <div className="admin-panel-page">
      <div className="container">
        <div className="admin-header fade-in">
          <div>
            <h1 className="admin-title">
              <Shield size={36} />
              Admin Dashboard
            </h1>
            <p className="admin-subtitle">Manage projects, users, and platform analytics</p>
          </div>
        </div>

        {/* Analytics Cards */}
        <div className="analytics-grid">
          <div className="analytics-card slide-in-left">
            <div className="analytics-icon" style={{ background: 'var(--gradient)' }}>
              <FolderOpen size={32} />
            </div>
            <div className="analytics-info">
              <p className="analytics-label">Total Projects</p>
              <h3 className="analytics-value">{analytics.totalProjects}</h3>
              <p className="analytics-subtext">
                <CheckCircle size={14} /> {analytics.approvedProjects} Approved
              </p>
            </div>
          </div>

          <div className="analytics-card slide-in-left" style={{ animationDelay: '0.1s' }}>
            <div className="analytics-icon" style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}>
              <Activity size={32} />
            </div>
            <div className="analytics-info">
              <p className="analytics-label">Pending Review</p>
              <h3 className="analytics-value">{analytics.pendingProjects}</h3>
              <p className="analytics-subtext">
                <XCircle size={14} /> {analytics.rejectedProjects} Rejected
              </p>
            </div>
          </div>

          <div className="analytics-card slide-in-left" style={{ animationDelay: '0.2s' }}>
            <div className="analytics-icon" style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' }}>
              <Eye size={32} />
            </div>
            <div className="analytics-info">
              <p className="analytics-label">Total Views</p>
              <h3 className="analytics-value">{analytics.totalViews}</h3>
              <p className="analytics-subtext">
                <TrendingUp size={14} /> Platform engagement
              </p>
            </div>
          </div>

          <div className="analytics-card slide-in-left" style={{ animationDelay: '0.3s' }}>
            <div className="analytics-icon" style={{ background: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)' }}>
              <Users size={32} />
            </div>
            <div className="analytics-info">
              <p className="analytics-label">Total Users</p>
              <h3 className="analytics-value">{analytics.totalUsers}</h3>
              <p className="analytics-subtext">
                <Heart size={14} /> {analytics.totalLikes} Total Likes
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="admin-tabs">
          <button
            className={`tab-button ${activeTab === 'projects' ? 'active' : ''}`}
            onClick={() => setActiveTab('projects')}
          >
            <FolderOpen size={20} />
            Projects
          </button>
          <button
            className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <Users size={20} />
            Users
          </button>
          <button
            className={`tab-button ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            <TrendingUp size={20} />
            Analytics
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === 'projects' && (
            <div className="projects-management">
              <div className="filter-bar">
                <button
                  className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                  onClick={() => setFilter('all')}
                >
                  All Projects ({projects.length})
                </button>
                <button
                  className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
                  onClick={() => setFilter('pending')}
                >
                  Pending ({analytics.pendingProjects})
                </button>
                <button
                  className={`filter-btn ${filter === 'approved' ? 'active' : ''}`}
                  onClick={() => setFilter('approved')}
                >
                  Approved ({analytics.approvedProjects})
                </button>
                <button
                  className={`filter-btn ${filter === 'rejected' ? 'active' : ''}`}
                  onClick={() => setFilter('rejected')}
                >
                  Rejected ({analytics.rejectedProjects})
                </button>
              </div>

              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Project</th>
                      <th>Author</th>
                      <th>Category</th>
                      <th>Status</th>
                      <th>Views</th>
                      <th>Likes</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getFilteredProjects().map((project, index) => (
                      <tr key={project.id} className="fade-in" style={{ animationDelay: `${index * 0.03}s` }}>
                        <td>
                          <div className="project-cell">
                            <img src={project.image} alt={project.title} className="project-thumb" />
                            <div>
                              <p className="project-name">{project.title}</p>
                              <p className="project-tech">{project.technologies.slice(0, 2).join(', ')}</p>
                            </div>
                          </div>
                        </td>
                        <td>{project.userName}</td>
                        <td>{project.category}</td>
                        <td>{getStatusBadge(project.status)}</td>
                        <td>{project.views}</td>
                        <td>{project.likes}</td>
                        <td>{formatDate(project.createdAt)}</td>
                        <td>
                          <div className="admin-actions">
                            {project.status !== 'approved' && (
                              <button
                                className="admin-btn approve-btn"
                                onClick={() => handleApprove(project.id)}
                                title="Approve"
                              >
                                <CheckCircle size={16} />
                              </button>
                            )}
                            {project.status !== 'rejected' && (
                              <button
                                className="admin-btn reject-btn"
                                onClick={() => handleReject(project.id)}
                                title="Reject"
                              >
                                <XCircle size={16} />
                              </button>
                            )}
                            <button
                              className="admin-btn delete-btn"
                              onClick={() => handleDelete(project.id)}
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="users-management">
              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Joined</th>
                      <th>Projects</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user, index) => (
                      <tr key={user.id} className="fade-in" style={{ animationDelay: `${index * 0.03}s` }}>
                        <td>
                          <div className="user-cell">
                            <div className="user-avatar">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                            <span>{user.name}</span>
                          </div>
                        </td>
                        <td>{user.email}</td>
                        <td>
                          <span className={`badge ${user.role === 'admin' ? 'badge-primary' : 'badge-success'}`}>
                            {user.role}
                          </span>
                        </td>
                        <td>{formatDate(user.createdAt)}</td>
                        <td>{projects.filter(p => p.userId === user.id).length}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="analytics-details">
              <div className="analytics-section">
                <h3>Platform Overview</h3>
                <div className="stats-list">
                  <div className="stat-row">
                    <span>Total Projects Submitted</span>
                    <strong>{analytics.totalProjects}</strong>
                  </div>
                  <div className="stat-row">
                    <span>Approved Projects</span>
                    <strong className="text-success">{analytics.approvedProjects}</strong>
                  </div>
                  <div className="stat-row">
                    <span>Pending Reviews</span>
                    <strong className="text-warning">{analytics.pendingProjects}</strong>
                  </div>
                  <div className="stat-row">
                    <span>Rejected Projects</span>
                    <strong className="text-danger">{analytics.rejectedProjects}</strong>
                  </div>
                  <div className="stat-row">
                    <span>Total Platform Views</span>
                    <strong>{analytics.totalViews}</strong>
                  </div>
                  <div className="stat-row">
                    <span>Total Likes Given</span>
                    <strong>{analytics.totalLikes}</strong>
                  </div>
                  <div className="stat-row">
                    <span>Registered Users</span>
                    <strong>{analytics.totalUsers}</strong>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;