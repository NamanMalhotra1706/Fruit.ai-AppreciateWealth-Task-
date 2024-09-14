import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../src/componentCss/home.css';

const Home = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Perform logout actions
    localStorage.removeItem('token'); // Example for clearing local storage
    navigate('/'); // Redirect to the login page
  };

  return (
    <div className="home-container">
      <h1 className="title">Fruit.AI</h1>
      <p className="tagline">"Be Healthy!"</p>
      <div className="grid">
        <button className="grid-item chat" onClick={() => navigate('/chat')}>Chat.</button>
        <button className="grid-item translate" onClick={() => navigate('/translate')}>
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Google_Translate_logo.svg/2048px-Google_Translate_logo.svg.png" 
            alt="Translate" 
            height={"100px"} 
          />
        </button>
        <button className="grid-item faqs" onClick={() => navigate('/FAQSection')}>FAQs</button>
        <button className="grid-item about" onClick={() => navigate('/about')}>About</button>
      </div>
      <button className="logout-btn" onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Home;
