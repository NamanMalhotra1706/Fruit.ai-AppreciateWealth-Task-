import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../componentCss/otp.css';

const OtpScreen = () => {
    const [otp, setOtp] = useState('');
    const navigate = useNavigate();

    const handleChange = (event) => {
        const value = event.target.value;
        if (/^\d*$/.test(value) && value.length <= 4) {
            setOtp(value); // Only allow numeric values and max 4 digits
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (otp.length === 4) {
            if (otp === "1234") {
                navigate('/setup'); // Redirect to setup page
            } else {
                alert('Incorrect OTP. Please try again.');
            }
        } else {
            alert('Please enter a 4-digit OTP.');
        }
    };

    return (
        <div className="container">
            <div className="content">
                <div className="icon"></div>
                <h2 className="heading">Verify OTP</h2>
            </div>

            <form onSubmit={handleSubmit} className="form">
                <label className="label">OTP</label>
                <p className="country-info">
                    Didn’t receive a code yet? <span className="change-link">Resend</span>
                </p>
                <input
                    type="text"
                    className="input"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={handleChange}
                />
                <button
                    className="submit-btn"
                    type="submit"
                    disabled={otp.length !== 4}
                >
                    Verify
                </button>
            </form>
        </div>
    );
};

export default OtpScreen;
