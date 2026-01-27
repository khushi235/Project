import React, { useState } from 'react';
import { Menu, X, Settings } from 'lucide-react';

const Navigation = ({ onAdminToggle }) => {
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
          ALLURE DIAM INC
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

        <div className=\"navigation-utilities\">
          <button className=\"admin-toggle-btn\" onClick={onAdminToggle}>
            <Settings size={18} style={{ marginRight: '8px' }} />
            Admin
          </button>
          
          {/* Mobile Menu Toggle */}
          <button 
            className=\"mobile-menu-toggle\"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label=\"Toggle menu\"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <nav className=\"mobile-menu\">
          <a href=\"#collections\" className=\"mobile-menu-link\" onClick={(e) => { e.preventDefault(); scrollToSection('collections'); }}>
            Collections
          </a>
          <a href=\"#about\" className=\"mobile-menu-link\" onClick={(e) => { e.preventDefault(); scrollToSection('about'); }}>
            Our Story
          </a>
          <a href=\"#contact\" className=\"mobile-menu-link\" onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }}>
            Contact
          </a>
          <button className=\"admin-toggle-btn\" style={{ width: '100%', marginTop: '16px' }} onClick={() => { onAdminToggle(); setMobileMenuOpen(false); }}>
            <Settings size={18} style={{ marginRight: '8px' }} />
            Admin Panel
          </button>
        </nav>
      )}
    </header>
  );
};

export default Navigation;