import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getProjects } from '../utils/storage';
import ProjectCard from '../components/ProjectCard';
import { Search, Sparkles, Rocket, Users, Award, TrendingUp, ArrowRight } from 'lucide-react';
import './Home.css';

const Home = () => {
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const categories = ['all', 'Web Development', 'Mobile Development', 'Full Stack', 'AI/ML', 'Data Science', 'UI/UX'];

  useEffect(() => {
    loadProjects();
  }, [selectedCategory, searchTerm]);

  const loadProjects = () => {
    const filter = {
      status: 'approved',
      ...(selectedCategory !== 'all' && { category: selectedCategory }),
      ...(searchTerm && { search: searchTerm })
    };
    const fetchedProjects = getProjects(filter);
    setProjects(fetchedProjects);
  };

  const features = [
    {
      icon: <Rocket size={40} />,
      title: 'Showcase Projects',
      description: 'Display your best work and get discovered by recruiters and fellow developers'
    },
    {
      icon: <Users size={40} />,
      title: 'Connect & Collaborate',
      description: 'Network with talented developers and find opportunities to collaborate'
    },
    {
      icon: <Award size={40} />,
      title: 'Get Recognition',
      description: 'Receive likes, views, and feedback from the community on your projects'
    },
    {
      icon: <TrendingUp size={40} />,
      title: 'Track Analytics',
      description: 'Monitor your project performance with detailed analytics and insights'
    }
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background">
          <div className="hero-circle hero-circle-1"></div>
          <div className="hero-circle hero-circle-2"></div>
          <div className="hero-circle hero-circle-3"></div>
        </div>
        
        <div className="container">
          <div className="hero-content fade-in">
            <h1 className="hero-title">
              Showcase Your Projects,
              <span className="text-gradient"> Build Your Portfolio</span>
            </h1>
            <p className="hero-description">
              PowerFolio is the ultimate platform for developers to showcase their projects,
              connect with peers, and get discovered by opportunities.
            </p>
            <div className="hero-actions">
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" className="btn btn-primary btn-large">
                    Go to Dashboard
                    <ArrowRight size={20} />
                  </Link>
                  <Link to="/submit-project" className="btn btn-secondary btn-large">
                    Submit Project
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/signup" className="btn btn-primary btn-large">
                    Get Started Free
                    <Sparkles size={20} />
                  </Link>
                  <Link to="/login" className="btn btn-secondary btn-large">
                    Login
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Why Choose PowerFolio?</h2>
            <p className="section-subtitle">Everything you need to build an impressive developer portfolio</p>
          </div>

          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card slide-in-left" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="projects-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Featured Projects</h2>
            <p className="section-subtitle">Explore amazing projects from our community</p>
          </div>

          {/* Search and Filter */}
          <div className="search-filter-bar">
            <div className="search-box">
              <Search size={20} />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="category-filters">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category === 'all' ? 'All Projects' : category}
                </button>
              ))}
            </div>
          </div>

          {/* Projects Grid */}
          {projects.length > 0 ? (
            <div className="grid grid-3">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <div className="no-projects">
              <Sparkles size={64} />
              <h3>No projects found</h3>
              <p>Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      {!isAuthenticated && (
        <section className="cta-section">
          <div className="container">
            <div className="cta-card">
              <h2 className="cta-title">Ready to Showcase Your Work?</h2>
              <p className="cta-description">
                Join thousands of developers sharing their projects on PowerFolio
              </p>
              <Link to="/signup" className="btn btn-primary btn-large">
                Create Your Account
                <Sparkles size={20} />
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;