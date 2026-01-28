import React, { useState } from 'react';
import { Menu, X, Settings } from 'lucide-react';

const Navigation = ({ onAdminToggle }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="navigation-header">
      <div className="navigation-container">
        <a href="#home" className="navigation-logo">
          Allure Diam Inc
        </a>

        <button className="admin-toggle-btn" onClick={onAdminToggle}>
          <Settings size={16} />
          Admin
        </button>
      </div>
    </header>
  );
};

export default Navigation;