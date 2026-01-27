import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      await axios.post(`${API}/contact`, formData);
      toast.success("Thank you for your inquiry. We'll be in touch shortly.");
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section id="contact" className="section-padding contact-section">
      <div className="container">
        <div className="contact-header">
          <h2 className="hero-medium">Get in Touch</h2>
          <p className="body-large">We're here to help you find the perfect piece</p>
        </div>

        <div className="grid-two-column">
          <div className="contact-info">
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

          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name" className="form-label">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone" className="form-label">Phone</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="message" className="form-label">Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="form-textarea"
                rows="5"
                required
              />
            </div>

            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? 'Sending...' : 'Send Message'}
              <Send size={16} style={{ marginLeft: '8px' }} />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;