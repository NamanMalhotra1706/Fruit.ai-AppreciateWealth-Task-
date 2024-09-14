import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import '../componentCss/setup.css'; // Import your CSS file

const Setup = () => {
    const [profileImage, setProfileImage] = useState(null);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const navigate = useNavigate(); // Create navigate instance

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileImage(URL.createObjectURL(file));
        }
    };

    const isButtonDisabled = !firstName || !lastName; // Disable button if either name is missing

    const handleCompleteSetup = () => {
        // Perform setup completion actions if needed
        navigate('/home'); // Redirect to home page
    };

    return (
        <div className="profile-setup-container">
            <h2>Let's get you setup.</h2>

            <div className="profile-image-section">
                <label className="profile-image-label">PROFILE IMAGE</label>
                <div className="profile-image-upload">
                    {profileImage ? (
                        <img src={profileImage} alt="Profile" className="profile-image-preview" />
                    ) : (
                        <div className="upload-placeholder">
                            <span>Upload a profile image</span>
                        </div>
                    )}
                    <input type="file" onChange={handleImageUpload} id="file-upload" hidden />
                    <label htmlFor="file-upload" className="browse-link">Browse</label>
                </div>
            </div>

            <div className="name-input-section">
                <div className="name-field">
                    <label>FIRST NAME</label>
                    <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="First Name"
                    />
                </div>
                <div className="name-field">
                    <label>LAST NAME</label>
                    <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Last Name"
                    />
                </div>
            </div>

            <button
                className="complete-setup-button"
                onClick={handleCompleteSetup}
                disabled={isButtonDisabled}
            >
                Complete Setup
            </button>
        </div>
    );
};

export default Setup;
