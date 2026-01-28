import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import Hero from "./components/Hero";
import Collections from "./components/Collections";
import About from "./components/About";
import Footer from "./components/Footer";
import AdminPanel from "./components/AdminPanel";
import AdminLogin from "./components/AdminLogin";
import { Toaster, toast } from "sonner";

const Home = () => {
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    // Check if user is already logged in
    const loggedIn = localStorage.getItem('admin_logged_in');
    const loginTime = localStorage.getItem('admin_login_time');
    
    if (loggedIn && loginTime) {
      // Check if login is still valid (24 hours)
      const currentTime = new Date().getTime();
      const timeDiff = currentTime - parseInt(loginTime);
      const hoursDiff = timeDiff / (1000 * 60 * 60);
      
      if (hoursDiff < 24) {
        setIsAuthenticated(true);
      } else {
        // Session expired
        localStorage.removeItem('admin_logged_in');
        localStorage.removeItem('admin_login_time');
      }
    }
  }, []);

  const handleAdminToggle = () => {
    if (isAuthenticated) {
      setShowAdminPanel(true);
    } else {
      setShowAdminLogin(true);
    }
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
    setShowAdminLogin(false);
    setShowAdminPanel(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_logged_in');
    localStorage.removeItem('admin_login_time');
    setIsAuthenticated(false);
    setShowAdminPanel(false);
    toast.success('Logged out successfully');
  };

  const handleAdminClose = () => {
    setShowAdminPanel(false);
    // Refresh the collections when admin panel closes
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div>
      <Navigation onAdminToggle={handleAdminToggle} />
      <Hero />
      <Collections key={refreshKey} />
      <About />
      <Footer />
      
      {showAdminLogin && (
        <AdminLogin 
          onLogin={handleLogin} 
          onClose={() => setShowAdminLogin(false)} 
        />
      )}
      
      {showAdminPanel && (
        <AdminPanel 
          onClose={handleAdminClose} 
          onLogout={handleLogout}
        />
      )}
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" />
    </div>
  );
}

export default App;
