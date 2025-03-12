import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error] = useState("");
  const [isConnecting, setIsConnecting] = useState(true);
  const [apiConnectionStatus, setApiConnectionStatus] = useState("Checking connection...");
  const navigate = useNavigate();

  const apiUrl = import.meta.env.VITE_API_URL || 
                (window.location.hostname.includes('dev') ? 
                 "https://team77.dev.bham.team/api" : 
                 "https://team77.bham.team/api");

  useEffect(() => {
    if (import.meta.env.DEV) {
      console.log("Environment variables:", import.meta.env);
      console.log("API URL being used:", apiUrl);
    }
    
    const testApiConnection = async () => {
      setIsConnecting(true);
      try {
        const response = await fetch(`${apiUrl}/health`);
        const data = await response.json();
        
        if (response.ok) {
          setApiConnectionStatus("Connected successfully");
          if (import.meta.env.DEV) {
            console.log("API health check response:", data);
          }
        } else {
          setApiConnectionStatus("Connected but received error");
          console.error("API error:", data);
        }
      } catch (err) {
        setApiConnectionStatus("Connection failed");
        console.error("API health check failed:", err);
      }
      setIsConnecting(false);
    };
    
    testApiConnection();
  }, [apiUrl]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleHomeClick = () => {
    navigate("/");
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`${apiUrl}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include" 
      });
      
      let data;
      const responseText = await response.text();
      
      try {
        data = JSON.parse(responseText);
      } catch (err) {
        console.error("Error parsing JSON:", err);
        alert("Server returned an invalid response format.");
        return;
      }
      
      if (response.ok) {
        const userData = { email, token: data.token, role: data.role };
        sessionStorage.setItem("user", JSON.stringify(userData));
        alert("Login successful!");
        navigate("/"); 
      } else {
        alert(data.error || "Invalid email or password");
      }
    } catch (err) {
      console.error("Login error details:", err);
      alert("An error occurred while trying to login.");
    }
  };

  return (
    <div className="auth-page">
      {import.meta.env.DEV && (
        <div style={{position: 'fixed', bottom: '10px', right: '10px', background: 'rgba(0,0,0,0.7)', color: 'white', padding: '5px', fontSize: '12px', zIndex: 9999}}>
          API URL: {apiUrl}<br/>
          Status: {apiConnectionStatus}
        </div>
      )}
      
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
          <button className="back-button" onClick={handleBackClick}>
            <i className="fas fa-arrow-left"></i>
          </button>
          <button className="loginclose-button" onClick={handleHomeClick}>
            ×
          </button>
          <div className="card-content">
            <div className="login-section">
              <h2 style={{ marginBottom: "10px" }}>Login Your Account</h2>
              {error && <p style={{ color: "red" }}>{error}</p>}
              <form className="login-form" onSubmit={handleLogin}>
                <div className="form-group">
                  <label>University Email</label>
                  <input
                    type="email"
                    placeholder="Enter your university email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <div className="password-input">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
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
                <button 
                  type="submit" 
                  className="login-button"
                  disabled={isConnecting}
                >
                  {isConnecting ? "Connecting..." : "Login"}
                </button>
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

export default Login;