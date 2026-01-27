import React from 'react';
import { Phone } from 'lucide-react';

const About = () => {
  return (
    <section id="about" className="section-padding about-section">
      <div className="container">
        <div className="about-content-center">
          <h2 className="hero-medium">Premium Loose Diamonds Available</h2>
          <p className="about-description body-large">
            We specialize in offering high-quality loose diamonds at competitive prices. 
            Whether you're looking for the perfect stone for a custom engagement ring or seeking 
            investment-grade diamonds, our extensive collection ensures you'll find exactly what you need.
          </p>
          <p className="about-description body-large" style={{ marginTop: '20px' }}>
            Contact us today to receive a personalized quote tailored to your specifications and budget.
          </p>
          <a href="tel:212-730-7778" className="btn-primary" style={{ marginTop: '32px' }}>
            <Phone size={18} style={{ marginRight: '8px' }} />
            Call for Quote: 212-730-7778
          </a>
        </div>
      </div>
    </section>
  );
};

export default About;