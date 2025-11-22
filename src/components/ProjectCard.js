import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Heart, Calendar, User, ExternalLink, Github } from 'lucide-react';
import './ProjectCard.css';

const ProjectCard = ({ project }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/project/${project.id}`);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const handleExternalClick = (e, url) => {
    e.stopPropagation();
    window.open(url, '_blank');
  };

  return (
    <div className="project-card" onClick={handleCardClick}>
      <div className="project-image">
        <img src={project.image} alt={project.title} />
        <div className="project-overlay">
          <div className="project-actions">
            {project.githubUrl && (
              <button 
                className="action-btn"
                onClick={(e) => handleExternalClick(e, project.githubUrl)}
                title="View on GitHub"
              >
                <Github size={20} />
              </button>
            )}
            {project.liveUrl && (
              <button 
                className="action-btn"
                onClick={(e) => handleExternalClick(e, project.liveUrl)}
                title="View Live Demo"
              >
                <ExternalLink size={20} />
              </button>
            )}
          </div>
        </div>
        <div className="project-category">{project.category}</div>
      </div>

      <div className="project-content">
        <h3 className="project-title">{project.title}</h3>
        <p className="project-description">{project.description}</p>

        <div className="project-technologies">
          {project.technologies.slice(0, 3).map((tech, index) => (
            <span key={index} className="tech-badge">{tech}</span>
          ))}
          {project.technologies.length > 3 && (
            <span className="tech-badge more">+{project.technologies.length - 3}</span>
          )}
        </div>

        <div className="project-footer">
          <div className="project-author">
            <User size={16} />
            <span>{project.userName}</span>
          </div>

          <div className="project-stats">
            <div className="stat">
              <Eye size={16} />
              <span>{project.views}</span>
            </div>
            <div className="stat">
              <Heart size={16} />
              <span>{project.likes}</span>
            </div>
          </div>
        </div>

        <div className="project-date">
          <Calendar size={14} />
          <span>{formatDate(project.createdAt)}</span>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;