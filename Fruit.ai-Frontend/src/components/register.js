import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../componentCss/register.css';

const Register = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const navigate = useNavigate(); // Import and use the hook here

  const handleChange = (event) => {
    const value = event.target.value;
    if (/^\d*$/.test(value) && value.length <= 10) {
      setPhoneNumber(value); // Only allow numeric values and max 10 digits
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (phoneNumber.length === 10) {
      navigate('/otp'); // Navigate to OTP screen if valid phone number is entered
    }
  };

  return (
    <div className="container">
      <div className="content">
        <div className="icon"></div>
        <h2 className="heading">Get started.</h2>
      </div>

      <form onSubmit={handleSubmit} className="form">
        <label className="label">PHONE NUMBER</label>
        <p className="country-info">
          Country set to India. <span className="change-link">Change</span>
        </p>
        <input
          type="text"
          className="input"
          placeholder="+91 XXXXXX XXXXX"
          value={phoneNumber}
          onChange={handleChange}
        />
        <button
          className="submit-btn"
          type="submit"
          disabled={phoneNumber.length !== 10}
        >
          Get Started
        </button>
      </form>
    </div>
  );
};

export default Register;
