import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import './AccountVerified.css';

function AccountVerified() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleHomeClick = () => {
    navigate('/'); 
  };
  const handleBackClick = () => {
    navigate(-1); 
  };

  const handleGoToDashboard = () => {
    navigate('/');  
  };

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


          {/* Split Content */}
          <div className="card-content">

          {/* Login Form Section */}
            {/* Login Form Section */}
            <div className="login-section">
              <h2>Account Verified Sucessfully</h2>
              
              <form className="login-form">
                <h5 className="verify-text">Your account has been verified, you are all set to explore!</h5>
                
                <button type="submit" className="login-button" onClick={handleGoToDashboard}>Go to dashboard</button>
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

export default AccountVerified;