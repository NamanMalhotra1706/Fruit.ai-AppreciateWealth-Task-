import React from 'react';
import { Navigate } from 'react-router-dom';

// Higher Order Component (HOC) to protect routes
const AuthRoute = ({ element, isAuthenticated }) => {
    const token = localStorage.getItem('token');
    
    // Check if the token is present and if the user is authenticated
    if (token) {
      return element;
    } else {
      return <Navigate to="/" />;
    }
  };
  

export default AuthRoute;
