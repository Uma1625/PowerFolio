import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Linkedin, Twitter, Mail, Heart } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-logo">
              <span className="logo-icon">⚡</span>
              PowerFolio
            </h3>
            <p className="footer-description">
              Showcase your amazing projects and connect with talented developers worldwide.
            </p>
            <div className="social-links">
              <a href="https://github.com/Uma1625" target="_blank" rel="noopener noreferrer" className="social-link">
                <Github size={20} />
              </a>
              <a href="https://www.linkedin.com/in/umabharathi-mothukuri" target="_blank" rel="noopener noreferrer" className="social-link">
                <Linkedin size={20} />
              </a>
               
              <a href="mailto:umabharathimothukuri@gmail.com" className="social-link">
                <Mail size={20} />
              </a>
            </div>
          </div>

          <div className="footer-section">
            <h4 className="footer-title">Quick Links</h4>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/dashboard">Dashboard</Link></li>
              <li><Link to="/submit-project">Submit Project</Link></li>
            </ul>
          </div>

           

          <div className="footer-section">
            <h4 className="footer-title">Legal</h4>
            <ul className="footer-links">
              <li><a href="#privacy">Privacy Policy</a></li>
              <li><a href="#terms">Terms of Service</a></li>
              <li><a href="#cookies">Cookie Policy</a></li>
            </ul>
          </div>
        </div>

        
      </div>
    </footer>
  );
};

export default Footer;