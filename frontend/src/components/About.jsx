import React from 'react';
import { Phone } from 'lucide-react';

const About = () => {
  return (
    <section id="about" className="section-padding-small about-section">
      <div className="container">
        <div className="about-with-image">
          <div className="about-image-container">
            <img 
              src="https://customer-assets.emergentagent.com/job_4ee70d39-c1b9-4af8-8734-be9fa9a39713/artifacts/rz6yvzrz_Screenshot%20%2864%29.png" 
              alt="Premium loose diamond"
              className="loose-diamond-image"
            />
          </div>
          <div className="about-content-with-image">
            <h2 className="about-title">Premium Loose Diamonds Available</h2>
            <p className="about-description">
              We specialize in offering high-quality loose diamonds at competitive prices. 
              Whether you're looking for the perfect stone for a custom engagement ring or seeking 
              investment-grade diamonds, our extensive collection ensures you'll find exactly what you need.
            </p>
            <p className="about-description" style={{ marginTop: '12px' }}>
              Contact us today to receive a personalized quote tailored to your specifications and budget.
            </p>
            <a href="tel:212-730-7778" className="btn-quote" style={{ marginTop: '20px' }}>
              <Phone size={16} style={{ marginRight: '6px' }} />
              Call for Quote: 212-730-7778
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;