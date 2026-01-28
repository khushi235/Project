import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-brand">Allure Diam Inc</h3>
            <p className="footer-description">
              Exceptional diamond jewelry crafted with precision and care
            </p>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">Visit Our Showroom</h4>
            <div className="footer-address">
              <p className="footer-text">42 W 48 St #1203</p>
              <p className="footer-text">New York, NY 10036</p>
              <p className="footer-note">By appointment only</p>
            </div>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">Contact</h4>
            <div className="footer-contact">
              <a href="tel:+12127307778" className="footer-link">
                <Phone size={14} />
                212-730-7778
              </a>
              <a href="mailto:allurediaminc@gmail.com" className="footer-link">
                <Mail size={14} />
                allurediaminc@gmail.com
              </a>
            </div>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">Hours</h4>
            <p className="footer-text">Monday - Friday: 9:30am - 6pm</p>
            <p className="footer-text">Saturday: Closed</p>
            <p className="footer-text">Sunday: Closed</p>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copyright">
            © {currentYear} Allure Diam Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;