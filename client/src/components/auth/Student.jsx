import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Student.css';

function Student() {
    const navigate = useNavigate(); 

  const handleLoginClick = () => {
    navigate('/login'); 
  };
  const handleVerifyClick = () => {
    navigate('/verify'); 
  };
  const handleBackClick = () => {
    navigate(-1); 
};
const handleHomeClick = () => {
    navigate('/'); 
};

  const [yearOptions] = useState([
    "First Year",
    "Second Year",
    "Third Year",
    "Fourth Year",
    "Masters",
    "Foundation"
  ]);

  return (
    <>
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
      {/* <div className="modal-content"> */}
        <div className="left-panel">
          <button className="back-button">
            <i className="fas fa-arrow-left"></i>
          </button>

          <div className="welcome-content">
          <button className="back-button" style={{ color: 'white', top: '8px', fontSize: '2rem'}} onClick={handleBackClick}>{"<"}</button>
            <h1 className="welcome-title">Welcome Back!</h1>
            <p className="welcome-subtitle">Welcome back! Ready to dive into campus life?</p>
            <p className="welcome-text">Reconnect, engage, and make the most of your university experience!</p>
            <button className="login-button" onClick={handleLoginClick}>Login</button>
          </div>
        </div>

        <div className="right-panel">
            <button className="studentclose-button" onClick={handleHomeClick}>x</button>
          <div className="form-container">
            <h2 className="form-title">Create Account</h2>

            <div className="form-fields">
              <div className="input-group">
                <i className="fas fa-user"></i>
                <input type="text" placeholder="Full Name" name="fullName" />
              </div>

              <div className="input-group">
                <i className="fas fa-graduation-cap"></i>
                <select name="yearOfStudy">
                  <option value="">Year of Study</option>
                  {yearOptions.map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              <div className="input-group">
                <i className="fas fa-envelope"></i>
                <input type="email" placeholder="University Email" name="email" />
              </div>

              <div className="input-group">
                <i className="fas fa-lock"></i>
                <input type="password" placeholder="Password" name="password" />
              </div>

              <div className="input-group">
                <i className="fas fa-lock"></i>
                <input type="password" placeholder="Confirm Password" name="confirmPassword" />
              </div>

              <div style={{ position: "relative", zIndex: 999 }}>
              <button className="register-button" onClick={handleVerifyClick}>Register</button>
            </div>
            </div>
          </div>
        </div>
      {/* </div> */}
    </div>
    </>
  );
}

export default Student;