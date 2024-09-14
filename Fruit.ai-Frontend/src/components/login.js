import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../componentCss/login.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Login = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false); // State to toggle password visibility

  const navigate = useNavigate(); // Create navigate instance

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch('https://fruit-ai-appreciatewealth-task.onrender.com/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        mode:'cors'
      });
  
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token); // Store the JWT token in localStorage
        setIsAuthenticated(true); // Set authentication state to true
        navigate('/home'); // Redirect to the home page
      } else {
        const data = await response.json();
        setErrorMessage(data.message);
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage('An error occurred. Please try again.');
    }
  };
  

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>
        <p className="terms-text">
          By signing in you are agreeing to our <a href="#">Terms and privacy policy</a>
        </p>
        <div className="form-toggle">
          <button className="toggle-btn active">Login</button>
          <button className="toggle-btn" onClick={() => navigate('/register')}>Register</button>
        </div>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <input
              type={passwordVisible ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <i 
              className={`password-icon ${passwordVisible ? 'visible' : ''}`} 
              onClick={() => setPasswordVisible(!passwordVisible)}
            >
              {passwordVisible ? '🙈' : '👁️'}
            </i>
          </div>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <div className="extra-options">
            <label>
              <input type="checkbox" />
              Remember password
            </label>
            <a href="#" className="forgot-password">Forget password</a>
          </div>
          <button type="submit" className="login-btn">Login</button>
        </form>
        <div className="social-login">
          <p>or connect with</p>
          <div className="social-icons">
            <a href="#"><i className="fab fa-facebook"></i></a>
            <a href="#"><i className="fab fa-instagram"></i></a>
            <a href="#"><i className="fab fa-pinterest"></i></a>
            <a href="#"><i className="fab fa-linkedin"></i></a>
          </div>
        </div>
        <div className="fingerprint">
          <img src="https://img.icons8.com/ios-filled/50/000000/fingerprint.png" alt="fingerprint" />
        </div>
      </div>
    </div>
  );
};

export default Login;
