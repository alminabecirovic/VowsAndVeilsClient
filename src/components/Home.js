import React from 'react';
import { useNavigate } from 'react-router-dom';
import home from '../assets/home.mp4'
import "../pages/home.css";

const Home = () => {
  const navigate = useNavigate();

  const handleExplore = () => {
    navigate('/user_dresses_list');
  };

  return (
    <div className="hero">
      <div className='main'>
        <video src={home} autoPlay loop muted />
      </div>

      {/* Overlay */}
      <div className="hero-overlay"></div>

      {/* Content */}
      <div className="hero-content-wrapper">
        <div className="hero-content">
          <h2>BESKRAJNA ELEGANCIJA</h2>
          <p>OTKRIJ UMETNOST MLADALAČKE LEPOTE</p>
          <button onClick={handleExplore}>
            PRIKAŽI KOLEKCIJU
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;