import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Add this import
import './Verify.css';

function Verify() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleHomeClick = () => {
    navigate('/'); // Go back to the home page
  };
  const handleBackClick = () => {
    navigate(-1); // Go back to the previous page
  };
  const handleVerifyClick = () => {
    navigate("/accountverified");
  }

  return (
    <div className="auth-page">
      {/* Background Shapes */}
      <div className="circle"></div> {/* Add a Circle */}
       <div className="line"></div>
       <div className="line1"></div>
       <div className="triangle"></div>
       <div className="circle1"></div>
       <div className="circle2"></div>

      {/* Header */}
      <header className="header">
        <h1>UniHub</h1>
      </header>

      {/* Main Content */}
      <div className="content-container">
        <div className="auth-card">
          {/* Navigation Buttons */}
          <button className="back-button">
            <i className="fas fa-arrow-left"></i>
          </button>
          <button className="verifyclose-button" onClick={handleHomeClick}>×</button>

          {/* Split Content */}
          <div className="card-content">
          <button className="back-button" style={{ color: 'black', top: '8px', fontSize: '2rem'}} onClick={handleBackClick}>{"<"}</button>
          {/* Login Form Section */}
            {/* Login Form Section */}
            <div className="login-section">
              <h2>Verify Your Account</h2>
              
              <form className="login-form">
                <h5 className="verify-text">Please enter the verification code sent to your email</h5>
                <div className="form-group">
                  <input 
                    type="code" 
                    placeholder="Enter your verification code"
                  />
                </div>

                <button type="submit" className="login-button" onClick={handleVerifyClick}>Login</button>
              </form>
            </div>

            {/* Image Section */}
            <div className="image-section">
              <img 
                src="/assets/images/student-casual.jpeg" 
                alt="Students collaborating"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Verify;