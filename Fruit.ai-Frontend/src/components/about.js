import React from 'react';
import '../componentCss/aboutus.css';

const Aboutus = () => {
  return (
    <div className="fruit-ai-container">
      <div className="hero-section">
        <div className="blurred-text">
          <span className="blur">F</span>
          <span className="blur">F</span>
          <span className="blur">F</span>
        </div>
      </div>
      <div className="info-section">
        <h2>Fruit.AI</h2>
        <p>
          Whether you're looking to discover new fruits, understand their nutritional values, or find the perfect fruit for your diet, our AI-driven chatbot is here to assist. We provide personalized fruit recommendations tailored to your health needs, making it easier for you to integrate the best fruits into your daily routine.
        </p>
        <button className="about-btn">About</button>
      </div>
    </div>
  );
};

export default Aboutus;