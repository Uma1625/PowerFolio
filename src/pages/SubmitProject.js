import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createProject, updateProject, getProjectById } from '../utils/storage';
import { 
  Upload, Github, ExternalLink, Tag, Folder, 
  AlertCircle, CheckCircle, Sparkles 
} from 'lucide-react';
import './SubmitProject.css';

const SubmitProject = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Web Development',
    technologies: '',
    githubUrl: '',
    liveUrl: '',
    image: ''
  });

  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const categories = [
    'Web Development',
    'Mobile Development',
    'Full Stack',
    'AI/ML',
    'Data Science',
    'UI/UX',
    'Game Development',
    'DevOps',
    'Blockchain'
  ];

  const sampleImages = [
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800',
    'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800',
    'https://images.unsplash.com/photo-1484417894907-623942c8ee29?w=800',
    'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=800',
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800'
  ];

  useEffect(() => {
    if (editId) {
      const project = getProjectById(editId);
      if (project && project.userId === user.id) {
        setFormData({
          title: project.title,
          description: project.description,
          category: project.category,
          technologies: project.technologies.join(', '),
          githubUrl: project.githubUrl || '',
          liveUrl: project.liveUrl || '',
          image: project.image
        });
      } else {
        navigate('/dashboard');
      }
    }
  }, [editId, user.id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const enhanceWithAI = (field) => {
    // AI Enhancement simulation
    if (field === 'title' && formData.title) {
      const enhanced = `🚀 ${formData.title.trim()} - Next-Gen Solution`;
      setFormData(prev => ({ ...prev, title: enhanced }));
    } else if (field === 'description' && formData.description) {
      const enhanced = `${formData.description.trim()}\n\nKey Features:\n- Modern & Responsive Design\n- High Performance Optimized\n- User-Friendly Interface\n- Scalable Architecture`;
      setFormData(prev => ({ ...prev, description: enhanced }));
    }
  };

  const selectRandomImage = () => {
    const randomImage = sampleImages[Math.floor(Math.random() * sampleImages.length)];
    setFormData(prev => ({ ...prev, image: randomImage }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // Validation
    if (!formData.title || !formData.description || !formData.technologies) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    const projectData = {
      ...formData,
      technologies: formData.technologies.split(',').map(t => t.trim()).filter(t => t),
      userId: user.id,
      userName: user.name,
      image: formData.image || sampleImages[0]
    };

    try {
      if (editId) {
        updateProject(editId, projectData);
        setSuccess('Project updated successfully! Redirecting...');
      } else {
        createProject(projectData);
        setSuccess('Project submitted successfully! Awaiting admin approval. Redirecting...');
      }

      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      setError('Failed to submit project. Please try again.');
    }

    setLoading(false);
  };

  return (
    <div className="submit-project-page">
      <div className="container-small">
        <div className="submit-header fade-in">
          <h1 className="submit-title">
            {editId ? 'Edit Project' : 'Submit Your Project'} 🎨
          </h1>
          <p className="submit-subtitle">
            Showcase your amazing work to the developer community
          </p>
        </div>

        {success && (
          <div className="alert alert-success">
            <CheckCircle size={20} />
            <span>{success}</span>
          </div>
        )}

        {error && (
          <div className="alert alert-danger">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="submit-form card fade-in">
          <div className="form-group">
            <label className="form-label">
              <Tag size={18} />
              Project Title *
            </label>
            <div className="input-with-action">
              <input
                type="text"
                name="title"
                className="form-input"
                placeholder="Enter your project title"
                value={formData.title}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="btn-enhance"
                onClick={() => enhanceWithAI('title')}
                title="Enhance with AI"
              >
                <Sparkles size={18} />
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              <Folder size={18} />
              Category *
            </label>
            <select
              name="category"
              className="form-input"
              value={formData.category}
              onChange={handleChange}
              required
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">
              <Upload size={18} />
              Description *
            </label>
            <div className="input-with-action">
              <textarea
                name="description"
                className="form-input form-textarea"
                placeholder="Describe your project, its features, and technologies used..."
                value={formData.description}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="btn-enhance"
                onClick={() => enhanceWithAI('description')}
                title="Enhance with AI"
              >
                <Sparkles size={18} />
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              <Tag size={18} />
              Technologies * (comma-separated)
            </label>
            <input
              type="text"
              name="technologies"
              className="form-input"
              placeholder="e.g., React, Node.js, MongoDB, Tailwind CSS"
              value={formData.technologies}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <Github size={18} />
              GitHub Repository URL
            </label>
            <input
              type="url"
              name="githubUrl"
              className="form-input"
              placeholder="https://github.com/username/project"
              value={formData.githubUrl}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <ExternalLink size={18} />
              Live Demo URL
            </label>
            <input
              type="url"
              name="liveUrl"
              className="form-input"
              placeholder="https://your-project-demo.com"
              value={formData.liveUrl}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <Upload size={18} />
              Project Image URL
            </label>
            <div className="image-input-group">
              <input
                type="url"
                name="image"
                className="form-input"
                placeholder="https://example.com/image.jpg"
                value={formData.image}
                onChange={handleChange}
              />
              <button
                type="button"
                className="btn btn-secondary"
                onClick={selectRandomImage}
              >
                Random Image
              </button>
            </div>
            {formData.image && (
              <div className="image-preview">
                <img src={formData.image} alt="Preview" />
              </div>
            )}
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/dashboard')}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Submitting...' : (editId ? 'Update Project' : 'Submit Project')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmitProject;