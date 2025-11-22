import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getProjectById, incrementProjectViews, toggleProjectLike } from '../utils/storage';
import { useAuth } from '../context/AuthContext';
import { 
  ArrowLeft, Eye, Heart, Calendar, User, Github, 
  ExternalLink, Tag, Share2 
} from 'lucide-react';
import './ProjectDetail.css';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const fetchedProject = getProjectById(id);
    if (fetchedProject) {
      setProject(fetchedProject);
      incrementProjectViews(id);
    } else {
      navigate('/');
    }
  }, [id, navigate]);

  const handleLike = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    const newLikes = toggleProjectLike(id, user.id);
    setProject(prev => ({ ...prev, likes: newLikes }));
    setLiked(!liked);
  };

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: project.title,
        text: project.description,
        url: url
      });
    } else {
      navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (!project) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="project-detail-page">
      <div className="container">
        <button onClick={() => navigate(-1)} className="back-button fade-in">
          <ArrowLeft size={20} />
          Back
        </button>

        <div className="project-detail-header fade-in">
          <div className="project-detail-image">
            <img src={project.image} alt={project.title} />
            <div className="project-detail-overlay">
              <div className="overlay-actions">
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                  >
                    <Github size={20} />
                    View Code
                  </a>
                )}
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary"
                  >
                    <ExternalLink size={20} />
                    Live Demo
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="project-detail-content">
          <div className="project-main-content">
            <div className="project-header-info slide-in-left">
              <div className="project-category-badge">{project.category}</div>
              <h1 className="project-detail-title">{project.title}</h1>
              
              <div className="project-meta">
                <div className="meta-item">
                  <User size={18} />
                  <span>{project.userName}</span>
                </div>
                <div className="meta-item">
                  <Calendar size={18} />
                  <span>{formatDate(project.createdAt)}</span>
                </div>
                <div className="meta-item">
                  <Eye size={18} />
                  <span>{project.views} views</span>
                </div>
              </div>

              <div className="project-actions-bar">
                <button
                  onClick={handleLike}
                  className={`action-button ${liked ? 'active' : ''}`}
                >
                  <Heart size={20} fill={liked ? 'currentColor' : 'none'} />
                  <span>{project.likes} Likes</span>
                </button>
                <button onClick={handleShare} className="action-button">
                  <Share2 size={20} />
                  <span>Share</span>
                </button>
              </div>
            </div>

            <div className="project-description slide-in-left">
              <h2>About This Project</h2>
              <p>{project.description}</p>
            </div>

            <div className="project-technologies slide-in-left">
              <h2>Technologies Used</h2>
              <div className="tech-tags">
                {project.technologies.map((tech, index) => (
                  <div key={index} className="tech-tag">
                    <Tag size={16} />
                    {tech}
                  </div>
                ))}
              </div>
            </div>

            {(project.githubUrl || project.liveUrl) && (
              <div className="project-links slide-in-left">
                <h2>Project Links</h2>
                <div className="links-container">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="project-link"
                    >
                      <Github size={24} />
                      <div>
                        <p className="link-title">Source Code</p>
                        <p className="link-url">{project.githubUrl}</p>
                      </div>
                      <ExternalLink size={20} />
                    </a>
                  )}
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="project-link"
                    >
                      <ExternalLink size={24} />
                      <div>
                        <p className="link-title">Live Demo</p>
                        <p className="link-url">{project.liveUrl}</p>
                      </div>
                      <ExternalLink size={20} />
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="project-sidebar">
            <div className="sidebar-card slide-in-right">
              <h3>Project Stats</h3>
              <div className="stat-item">
                <Eye size={20} />
                <div>
                  <p className="stat-value">{project.views}</p>
                  <p className="stat-label">Total Views</p>
                </div>
              </div>
              <div className="stat-item">
                <Heart size={20} />
                <div>
                  <p className="stat-value">{project.likes}</p>
                  <p className="stat-label">Total Likes</p>
                </div>
              </div>
            </div>

            <div className="sidebar-card slide-in-right" style={{ animationDelay: '0.1s' }}>
              <h3>Category</h3>
              <div className="category-info">
                <Tag size={20} />
                <span>{project.category}</span>
              </div>
            </div>

            <div className="sidebar-card slide-in-right" style={{ animationDelay: '0.2s' }}>
              <h3>Developer</h3>
              <div className="developer-info">
                <div className="developer-avatar">
                  {project.userName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="developer-name">{project.userName}</p>
                  <p className="developer-role">Project Author</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;