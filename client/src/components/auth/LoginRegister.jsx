import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginRegister.css';

function LoginRegister() {
    const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };
  
  const handleBackClick = () => {
    navigate(-1);
  };
  
  const handleRegisterClick = () => {
    navigate('/welcome');
  };

  return (
    <>
      <nav className="auth-navbar">
        <div className="auth-nav-logo">UniHub</div>
      </nav>

      <div className="auth-modal-container">
        <div className="auth-circle"></div>
        <div className="auth-line"></div>
        <div className="auth-line1"></div>
        <div className="auth-triangle"></div>
        <div className="auth-circle1"></div>
        <div className="auth-circle2"></div>

        <div className="auth-modal-left">
          <div className="auth-text-content">
            <h1 className="auth-title">Welcome!</h1>
            <p className="auth-subtitle">
              Please login or register to continue
            </p>
            <button className="auth-back-button" onClick={handleBackClick}>{"<"}</button>
            <div className="auth-button-container">
              <button className="auth-choice-button" onClick={handleLoginClick}>Login</button>
              <button className="auth-choice-button" onClick={handleRegisterClick}>Register</button>
            </div>
          </div>
        </div>

        <div className="auth-modal-right">
          <button className="auth-close-button auth-desktop" onClick={handleBackClick}>×</button>
          <img
            src="/assets/images/student-casual.jpeg"
            alt="Students socializing in a casual campus setting"
            className="auth-cover-image"
          />
        </div>
      </div>
    </>
  );
}

export default LoginRegister;