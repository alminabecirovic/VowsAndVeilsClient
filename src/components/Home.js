


import React from 'react';
import { useNavigate } from 'react-router-dom';
import "../pages/home.css";

const Home = () => {
  const navigate = useNavigate();

  const handleExplore = () => {
    navigate('/user_dresses_list');
  };

  return (
    <div className="hero">
      {/* Video Background */}
      <video 
        className="hero-video"
        autoPlay 
        muted 
        loop 
        playsInline
      >
        <source 
          src="/public/video/16_9_10_sek_sajt_v2_989aa9df50.mp4" 
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>

      {/* Overlay */}
      <div className="hero-overlay"></div>

      {/* Content */}
      <div className="hero-content-wrapper">
        <div className="hero-content">
          <h2>TIMELESS ELEGANCE</h2>
          <p>DISCOVER THE ART OF BRIDAL BEAUTY</p>
          <button onClick={handleExplore}>
            PRIKAŽI KOLEKCIJU
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;