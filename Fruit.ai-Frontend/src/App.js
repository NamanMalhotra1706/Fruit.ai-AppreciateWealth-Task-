import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './components/home';
import Chat from './components/chat';
import Translate from './components/translate';
import About from './components/about';
import Login from './components/login';
import Register from './components/register';
import OtpScreen from './components/otp';
import Setup from './components/setup';
import FAQSection from './components/FAQSection';
import AuthRoute from './utils/AuthRoute';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('Token:', token); // Debug: Check token presence
    console.log('Is Authenticated:', isAuthenticated); // Debug: Check isAuthenticated state
    if (token) {
      setIsAuthenticated(true); // Update authentication state
    } else {
      setIsAuthenticated(false);
    }
  }, [isAuthenticated]);
  

  return (
      <Router>
        <Routes>
          <Route path="/" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/home" element={<AuthRoute element={<Home />} isAuthenticated={isAuthenticated} />} />
          <Route path="/chat" element={<AuthRoute element={<Chat />} isAuthenticated={isAuthenticated} />} />
          <Route path="/translate" element={<AuthRoute element={<Translate />} isAuthenticated={isAuthenticated} />} />
          <Route path="/about" element={<AuthRoute element={<About />} isAuthenticated={isAuthenticated} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/otp" element={<OtpScreen />} />
          <Route path="/setup" element={<Setup />} />
          <Route path="/FAQSection" element={<AuthRoute element={<FAQSection />} isAuthenticated={isAuthenticated} />} />
        </Routes>
      </Router>
    );
  }
export default App;
