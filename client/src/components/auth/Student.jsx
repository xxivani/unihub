import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Student.css';

// const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function Student() {
  const navigate = useNavigate(); 
  const [formData, setFormData] = useState({
    fullName: '',
    yearOfStudy: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [yearOptions] = useState([
    "First Year",
    "Second Year",
    "Third Year",
    "Fourth Year",
    "Masters",
    "Foundation"
  ]);

  const handleLoginClick = () => {
    navigate('/login'); 
  };
  const handleBackClick = () => {
    navigate(-1); 
  };
  const handleHomeClick = () => {
    navigate('/'); 
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  const handleRegisterClick = async () => {
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match.");
      return;
  }

  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/users/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: formData.email,
        password: formData.password,
        role: "student",
        studentName: formData.fullName,
        yearOfStudy: parseInt(formData.yearOfStudy),
      })
    });

    const data = await response.json();

    if (response.ok) {
      alert("Registration successful! Please login.");
      navigate('/login');
    } else {
      alert(data.error || "Registration failed.");
    }
  } catch (error) {
    console.error("Registration error:", error);
    alert("An error occurred. Please try again.");
  }
};

  return (
    <>
    <nav className="simple-navbar">
        <div className="nav-logo">UniHub</div>
      </nav>
    <div className="modal-container">
        <div className="circle"></div>
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
            <p className="welcome-subtitle">Ready to dive into campus life?</p>
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
                <input type="text" placeholder="Full Name" name="fullName" value={formData.fullName} onChange={handleChange}/>
              </div>

              <div className="input-group">
                <i className="fas fa-graduation-cap"></i>
                <select name="yearOfStudy" value={formData.yearOfStudy} onChange={handleChange}>
                  <option value="">Year of Study</option>
                  {yearOptions.map((year, index) => (
                    <option key={year} value={index + 1}>{year}</option>
                  ))}
                </select>
              </div>

              <div className="input-group">
                <i className="fas fa-envelope"></i>
                <input type="email" placeholder="University Email" name="email" value={formData.email} onChange={handleChange}/>
              </div>

              <div className="input-group">
                <i className="fas fa-lock"></i>
                <input type="password" placeholder="Password" name="password" value={formData.password} onChange={handleChange}/>
              </div>

              <div className="input-group">
                <i className="fas fa-lock"></i>
                <input type="password" placeholder="Confirm Password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} />
              </div>

              <div style={{ position: "relative", zIndex: 999 }}>
              <button className="register-button" onClick={handleRegisterClick}>Register</button>
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