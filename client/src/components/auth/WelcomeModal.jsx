import React from 'react';
import { useNavigate } from 'react-router-dom';
import './WelcomeModal.css';

function WelcomeModal() {
    const navigate = useNavigate(); 

  const handleStudentClick = () => {
    navigate('/student'); 
  };
  const handleBackClick = () => {
    navigate(-1); 
  };
  const handleCommiteeClick = () => {
    navigate('/commiteelogin'); 
};
  return (
    <>
      {/* Simple Navbar */}
      <nav className="simple-navbar">
        <div className="nav-logo">UniHub</div>
      </nav>

      <div className="modal-container">
        <div className="circle"></div> {/* Add a Circle */}
        <div className="line"></div>
        <div className="line1"></div>
        <div className="triangle"></div>
        <div className="circle1"></div>
        <div className="circle2"></div>

        <div className="modal-left">
          <div className="text-content">
            <h1 className="title">Welcome!</h1>
            <p className="subtitle">
              Are you a student or a committee member?
            </p>
            <button className="back-button" style={{ color: 'white', top: '8px', fontSize: '2rem'}} onClick={handleBackClick}>{"<"}</button>
            <div className="button-container">
              <button className="choice-button" onClick={handleStudentClick}>Student</button>
              <button className="choice-button" onClick={handleCommiteeClick}>Committee Member</button>
            </div>
          </div>
        </div>

        <div className="modal-right">
          <button className="close-button desktop" onClick={handleBackClick}>×</button>
          <img
            src="/assets/images/student-casual.jpeg"
            alt="Students socializing in a casual campus setting"
            className="cover-image"
          />
        </div>
      </div>
    </>
  );
}

export default WelcomeModal;
