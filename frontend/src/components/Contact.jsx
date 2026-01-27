import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

const Contact = () => {
  return (
    <section id="contact" className="section-padding contact-section">
      <div className="container">
        <div className="contact-header">
          <h2 className="hero-medium">Get in Touch</h2>
        </div>

        <div className="contact-info-centered">
          <div className="contact-info-item">
            <div className="contact-icon">
              <Phone size={24} strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="heading-3">Phone</h3>
              <p className="body-regular">212-730-7778</p>
            </div>
          </div>

          <div className="contact-info-item">
            <div className="contact-icon">
              <Mail size={24} strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="heading-3">Email</h3>
              <p className="body-regular">allurediaminc@gmail.com</p>
            </div>
          </div>

          <div className="contact-info-item">
            <div className="contact-icon">
              <MapPin size={24} strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="heading-3">Visit Our Showroom</h3>
              <p className="body-regular">42 W 48 St #1203</p>
              <p className="body-regular">New York, NY 10036</p>
              <p className="body-small">By appointment only</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;