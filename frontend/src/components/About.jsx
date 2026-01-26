import React from 'react';
import { brandStory } from '../mock';
import { Award, Heart, Gem } from 'lucide-react';

const About = () => {
  const icons = {
    'Ethical Sourcing': Heart,
    'Master Craftsmanship': Award,
    'Timeless Design': Gem
  };

  return (
    <section id="about" className="section-padding about-section">
      <div className="container">
        <div className="grid-two-column">
          <div className="about-content">
            <h2 className="hero-medium">{brandStory.title}</h2>
            <p className="about-subtitle body-large">{brandStory.subtitle}</p>
            <p className="body-regular about-description">
              {brandStory.description}
            </p>
          </div>
          <div className="about-image-wrapper">
            <img 
              src="https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=800&q=80" 
              alt="Diamond craftsmanship"
              className="about-image"
            />
          </div>
        </div>

        <div className="values-grid">
          {brandStory.values.map((value, index) => {
            const Icon = icons[value.title] || Gem;
            return (
              <div key={index} className="value-card">
                <div className="value-icon">
                  <Icon size={32} strokeWidth={1.5} />
                </div>
                <h3 className="heading-3">{value.title}</h3>
                <p className="body-regular">{value.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default About;