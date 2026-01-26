import React from 'react';
import { Mail, Phone } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-brand">LUMIÈRE DIAMONDS</h3>
            <p className="body-small footer-description">
              Exceptional diamond jewelry crafted with precision and care
            </p>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">Contact</h4>
            <div className="footer-contact">
              <a href="tel:+15551234567" className="footer-link">
                <Phone size={16} />
                +1 (555) 123-4567
              </a>
              <a href="mailto:inquiries@lumierediamonds.com" className="footer-link">
                <Mail size={16} />
                inquiries@lumierediamonds.com
              </a>
            </div>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">Hours</h4>
            <p className="body-small">Monday - Friday: 10am - 6pm</p>
            <p className="body-small">Saturday: 11am - 5pm</p>
            <p className="body-small">Sunday: By appointment</p>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="body-small">
            © {currentYear} Lumière Diamonds. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;