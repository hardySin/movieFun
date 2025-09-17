import React from 'react';
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Heart,
  PlayFill,
  Envelope,
  Telephone,
  GeoAlt,
  CameraReels
} from 'react-bootstrap-icons';
import "./footer.css";
import { useNavigate } from 'react-router-dom';

function Footer() {
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-row">
          {/* Company Info */}
          <div className="footer-col footer-company">
            <div className="footer-brand">
              <div className="footer-brand-content">
                <CameraReels className="signup-logo-icon" />
                <h4 className="footer-brand-text">MovieFun</h4>
              </div>
            </div>
            <p className="footer-description">
              Discover the world of cinema with MovieFun. Your ultimate destination for movie reviews,
              news, and entertainment.
            </p>
            <div className="footer-social-links">
              <a href="#" className="footer-social-link">
                <Facebook className="footer-social-icon" />
              </a>
              <a href="#" className="footer-social-link">
                <Twitter className="footer-social-icon" />
              </a>
              <a href="#" className="footer-social-link">
                <Instagram className="footer-social-icon" />
              </a>
              <a href="#" className="footer-social-link">
                <Linkedin className="footer-social-icon" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-col footer-links">
            <h6 className="footer-title">Quick Links</h6>
            <div className="footer-nav">
              <a href="#" className="footer-nav-link" onClick={() => navigate('/search/28')}>Home</a>
              <a href="#" className="footer-nav-link" onClick={() => navigate('/search/28')}>Movies</a>
              <a href="#" className="footer-nav-link" onClick={() => navigate('/search/28')}>TV Shows</a>
              <a href="#" className="footer-nav-link" onClick={() => navigate('/search/28')}>New Releases</a>
              <a href="#" className="footer-nav-link" onClick={() => navigate('/search/28')}>Trending</a>
            </div>
          </div>

          {/* Categories */}
          <div className="footer-col footer-links">
            <h6 className="footer-title">Categories</h6>
            <div className="footer-nav">
              <a href="#" className="footer-nav-link" onClick={() => navigate('/search/28')}>Action</a>
              <a href="#" className="footer-nav-link" onClick={() => navigate('/search/28')}>Comedy</a>
              <a href="#" className="footer-nav-link" onClick={() => navigate('/search/28')}>Drama</a>
              <a href="#" className="footer-nav-link" onClick={() => navigate('/search/28')}>Horror</a>
              <a href="#" className="footer-nav-link" onClick={() => navigate('/search/28')}>Sci-Fi</a>
            </div>
          </div>

          {/* Contact Info */}
          <div className="footer-col footer-contact">
            <h6 className="footer-title">Contact Us</h6>
            <div className="footer-contact-info">
              <div className="footer-contact-item">
                <GeoAlt className="footer-contact-icon" />
                <span className="footer-contact-text">123 Movie Street, Cinema City</span>
              </div>
              <div className="footer-contact-item">
                <Telephone className="footer-contact-icon" />
                <span className="footer-contact-text">+1 (555) 123-4567</span>
              </div>
              <div className="footer-contact-item">
                <Envelope className="footer-contact-icon" />
                <span className="footer-contact-text">support@moviefun.com</span>
              </div>
            </div>

            {/* Newsletter Subscription */}
            <div className="footer-newsletter">
              <h6 className="footer-title">Newsletter</h6>
              <div className="footer-newsletter-group">
                <input
                  type="email"
                  className="footer-newsletter-input"
                  placeholder="Enter your email"
                />
                <button className="footer-newsletter-btn" type="button">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="footer-copyright">
          <div className="footer-divider"></div>
          <div className="footer-copyright-content">
            <p className="footer-copyright-text">
              © {currentYear} MovieFun. Made with <Heart className="footer-heart-icon" /> by HardySin
            </p>
            <div className="footer-legal-links">
              <a href="#" className="footer-legal-link">Privacy Policy</a>
              <a href="#" className="footer-legal-link">Terms of Service</a>
              <a href="#" className="footer-legal-link">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;