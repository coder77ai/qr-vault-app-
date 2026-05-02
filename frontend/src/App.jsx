import React from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { QrCode, Upload, Home as HomeIcon } from 'lucide-react';
import './App.css';

import Home from './pages/Home';
import UploadPage from './pages/Upload';
import PaymentView from './pages/PaymentView';

function Navigation() {
  const location = useLocation();

  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        <QrCode size={28} color="#3b82f6" />
        QR Vault
      </Link>
      <div className="nav-links">
        <Link to="/" className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}>
          <HomeIcon size={20} />
          Library
        </Link>
        <Link to="/upload" className="btn-primary">
          <Upload size={20} />
          Add QR
        </Link>
      </div>
    </nav>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Navigation />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/pay/:id" element={<PaymentView />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
