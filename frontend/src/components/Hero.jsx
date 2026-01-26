import React from 'react';
import { ArrowRight } from 'lucide-react';

const Hero = () => {
  const scrollToCollections = () => {
    const element = document.getElementById('collections');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="hero-section">
      <div className="container">
        <div className="hero-content">
          <h1 className="hero-large">
            Timeless elegance in every facet
          </h1>
          <p className="hero-description body-large">
            Discover our curated collection of exceptional diamond jewelry,
            where each piece reflects uncompromising quality and refined craftsmanship.
          </p>
          <button className="btn-primary" onClick={scrollToCollections}>
            Explore Collections
            <ArrowRight size={16} style={{ marginLeft: '8px' }} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;