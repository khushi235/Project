import React, { useState } from 'react';
import { Menu, X, Settings } from 'lucide-react';

const Navigation = ({ onAdminToggle }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="navigation-header">
      <div className="navigation-container">
        <a href="#home" className="navigation-logo">
          ALLURE DIAM INC
        </a>

        <div className="navigation-utilities">
          <button className="admin-toggle-btn" onClick={onAdminToggle}>
            <Settings size={18} style={{ marginRight: '8px' }} />
            Admin
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navigation;