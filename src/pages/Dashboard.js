import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getProjects, deleteProject, updateProject } from '../utils/storage';
import { 
  PlusCircle, FolderOpen, Eye, Heart, Edit, Trash2, 
  CheckCircle, Clock, XCircle, TrendingUp 
} from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    pending: 0,
    rejected: 0,
    totalViews: 0,
    totalLikes: 0
  });

  useEffect(() => {
    loadProjects();
  }, [user]);

  const loadProjects = () => {
    const userProjects = getProjects({ userId: user.id });
    setProjects(userProjects);
    
    // Calculate stats
    const stats = {
      total: userProjects.length,
      approved: userProjects.filter(p => p.status === 'approved').length,
      pending: userProjects.filter(p => p.status === 'pending').length,
      rejected: userProjects.filter(p => p.status === 'rejected').length,
      totalViews: userProjects.reduce((sum, p) => sum + p.views, 0),
      totalLikes: userProjects.reduce((sum, p) => sum + p.likes, 0)
    };
    setStats(stats);
  };

  const handleDelete = (projectId) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      deleteProject(projectId);
      loadProjects();
    }
  };

  const handleEdit = (projectId) => {
    navigate(`/submit-project?edit=${projectId}`);
  };

  const getStatusBadge = (status) => {
    const badges = {
      approved: { icon: <CheckCircle size={16} />, class: 'badge-success', text: 'Approved' },
      pending: { icon: <Clock size={16} />, class: 'badge-warning', text: 'Pending' },
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="dashboard-page">
      <div className="container">
        <div className="dashboard-header fade-in">
          <div>
            <h1 className="dashboard-title">Welcome back, {user?.name}! 👋</h1>
            <p className="dashboard-subtitle">Manage your projects and track your portfolio performance</p>
          </div>
          <Link to="/submit-project" className="btn btn-primary">
            <PlusCircle size={20} />
            Submit New Project
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card slide-in-left">
            <div className="stat-icon" style={{ background: 'var(--gradient)' }}>
              <FolderOpen size={24} />
            </div>
            <div className="stat-info">
              <p className="stat-label">Total Projects</p>
              <h3 className="stat-value">{stats.total}</h3>
            </div>
          </div>

          <div className="stat-card slide-in-left" style={{ animationDelay: '0.1s' }}>
            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
              <CheckCircle size={24} />
            </div>
            <div className="stat-info">
              <p className="stat-label">Approved</p>
              <h3 className="stat-value">{stats.approved}</h3>
            </div>
          </div>

          <div className="stat-card slide-in-left" style={{ animationDelay: '0.2s' }}>
            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' }}>
              <Eye size={24} />
            </div>
            <div className="stat-info">
              <p className="stat-label">Total Views</p>
              <h3 className="stat-value">{stats.totalViews}</h3>
            </div>
          </div>

          <div className="stat-card slide-in-left" style={{ animationDelay: '0.3s' }}>
            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)' }}>
              <Heart size={24} />
            </div>
            <div className="stat-info">
              <p className="stat-label">Total Likes</p>
              <h3 className="stat-value">{stats.totalLikes}</h3>
            </div>
          </div>
        </div>

        {/* Projects Table */}
        <div className="projects-section">
          <div className="section-header">
            <h2>Your Projects</h2>
            <p>Manage and track all your submitted projects</p>
          </div>

          {projects.length > 0 ? (
            <div className="projects-table-container">
              <table className="projects-table">
                <thead>
                  <tr>
                    <th>Project</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th>Views</th>
                    <th>Likes</th>
                    <th>Submitted</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((project, index) => (
                    <tr key={project.id} className="fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
                      <td>
                        <div className="project-cell">
                          <img src={project.image} alt={project.title} className="project-thumb" />
                          <div>
                            <p className="project-name">{project.title}</p>
                            <p className="project-tech">{project.technologies.slice(0, 2).join(', ')}</p>
                          </div>
                        </div>
                      </td>
                      <td>{project.category}</td>
                      <td>{getStatusBadge(project.status)}</td>
                      <td>
                        <div className="stat-cell">
                          <Eye size={16} />
                          {project.views}
                        </div>
                      </td>
                      <td>
                        <div className="stat-cell">
                          <Heart size={16} />
                          {project.likes}
                        </div>
                      </td>
                      <td>{formatDate(project.createdAt)}</td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="action-btn edit-btn"
                            onClick={() => handleEdit(project.id)}
                            title="Edit"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            className="action-btn delete-btn"
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
          ) : (
            <div className="empty-state">
              <FolderOpen size={64} />
              <h3>No projects yet</h3>
              <p>Start showcasing your work by submitting your first project</p>
              <Link to="/submit-project" className="btn btn-primary">
                <PlusCircle size={20} />
                Submit Your First Project
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;