import React, { useState } from 'react';
import { Menu, X, ShoppingBag } from 'lucide-react';

const Navigation = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="navigation-header">
      <div className="navigation-container">
        <a href="#home" className="navigation-logo" onClick={(e) => { e.preventDefault(); scrollToSection('home'); }}>
          LUMIÈRE DIAMONDS
        </a>

        {/* Desktop Navigation */}
        <nav className="navigation-menu desktop-menu">
          <a href="#collections" className="navigation-link" onClick={(e) => { e.preventDefault(); scrollToSection('collections'); }}>
            Collections
          </a>
          <a href="#about" className="navigation-link" onClick={(e) => { e.preventDefault(); scrollToSection('about'); }}>
            Our Story
          </a>
          <a href="#contact" className="navigation-link" onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }}>
            Contact
          </a>
        </nav>

        {/* Mobile Menu Toggle */}
        <button 
          className="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <nav className="mobile-menu">
          <a href="#collections" className="mobile-menu-link" onClick={(e) => { e.preventDefault(); scrollToSection('collections'); }}>
            Collections
          </a>
          <a href="#about" className="mobile-menu-link" onClick={(e) => { e.preventDefault(); scrollToSection('about'); }}>
            Our Story
          </a>
          <a href="#contact" className="mobile-menu-link" onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }}>
            Contact
          </a>
        </nav>
      )}
    </header>
  );
};

export default Navigation;