import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

const Contact = () => {
  return (
    <section id="contact" className="section-padding-small contact-section">
      <div className="container">
        <div className="contact-header">
          <h2 className="contact-title">Get in Touch</h2>
        </div>

        <div className="contact-info-centered">
          <div className="contact-info-item">
            <div className="contact-icon">
              <Phone size={20} strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="contact-label">Phone</h3>
              <p className="contact-value">212-730-7778</p>
            </div>
          </div>

          <div className="contact-info-item">
            <div className="contact-icon">
              <Mail size={20} strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="contact-label">Email</h3>
              <p className="contact-value">allurediaminc@gmail.com</p>
            </div>
          </div>

          <div className="contact-info-item">
            <div className="contact-icon">
              <MapPin size={20} strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="contact-label">Visit Our Showroom</h3>
              <p className="contact-value">42 W 48 St #1203</p>
              <p className="contact-value">New York, NY 10036</p>
              <p className="contact-note">By appointment only</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;