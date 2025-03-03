import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState(""); // Store email input
  const [password, setPassword] = useState(""); // Store password input
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleHomeClick = () => {
    navigate("/");
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleLogin = (e) => {
    e.preventDefault();
  
    const adminEmail = "admin@123";
    const adminPassword = "admin@123";
  
    if (email === adminEmail && password === adminPassword) {
      sessionStorage.setItem("user", JSON.stringify({ email }));
      alert("Admin login successful!");
      navigate("/"); // Redirect
    } else {
      alert("Invalid email or password");
    }
  };

  return (
    <div className="auth-page">
      {/* Background Shapes */}
      <div className="circle"></div>
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
          <button className="loginclose-button" onClick={handleHomeClick}>
            ×
          </button>

          {/* Split Content */}
          <div className="card-content">
            <button
              className="back-button"
              style={{ color: "black", top: "8px", fontSize: "2rem" }}
              onClick={handleBackClick}
            >
              {"<"}
            </button>
            {/* Login Form Section */}
            <div className="login-section">
            <h2 style={{ marginBottom: '10px' }}>Login Your Account</h2>

              <form className="login-form" onSubmit={handleLogin}>
                <div className="form-group">
                  <label>University Email</label>
                  <input
                    type="email"
                    placeholder="Enter your university email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)} // Update email state
                  />
                </div>

                <div className="form-group">
                  <label>Password</label>
                  <div className="password-input">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)} // Update password state
                    />
                    <button
                      type="button"
                      className="show-password"
                      onClick={togglePasswordVisibility}
                    >
                      <i className={`fas fa-${showPassword ? "eye-slash" : "eye"}`}></i>
                    </button>
                  </div>
                  <a href="#" className="forgot-password">
                    Forgot Password?
                  </a>
                </div>

                <button type="submit" className="login-button">
                  Login
                </button>
              </form>
            </div>

            {/* Image Section */}
            <div className="image-section">
              <img src="/assets/images/student-casual.jpeg" alt="Students collaborating" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
