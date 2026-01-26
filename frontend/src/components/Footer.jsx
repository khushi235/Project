import React from 'react';
import { Mail, Phone } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-brand">ALLURE DIAM INC</h3>
            <p className="body-small footer-description">
              Exceptional diamond jewelry crafted with precision and care
            </p>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">Contact</h4>
            <div className="footer-contact">
              <a href="tel:+12127307778" className="footer-link">
                <Phone size={16} />
                212-730-7778
              </a>
              <a href="mailto:allurediaminc@gmail.com" className="footer-link">
                <Mail size={16} />
                allurediaminc@gmail.com
              </a>
            </div>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">Hours</h4>
            <p className="body-small">Monday - Friday: 9:30am - 6pm</p>
            <p className="body-small">Saturday: Closed</p>
            <p className="body-small">Sunday: Closed</p>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="body-small">
            © {currentYear} Allure Diam Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;