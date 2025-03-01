import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Commit.css';

function CommitLogin() {
    const navigate = useNavigate(); // Hook to access navigation

    const handleLoginClick = () => {
        navigate('/login'); // Navigate to the student page
    };

    const handleVerifyClick = () => {
        navigate('/verify'); // Navigate to the verify page
    };

    const handleBackClick = () => {
        navigate(-1); // Go back to the previous page
    };

    const handleHomeClick = () => {
        navigate('/'); // Go back to the home page
    };

    const [yearOptions] = useState([
        "First Year",
        "Second Year",
        "Third Year",
        "Fourth Year",
        "Masters",
        "Foundation"
    ]);

    // Add club options
    const [clubOptions] = useState([
        "Tech Club",
        "Design Club",
        "Business Club",
        "Music Club",
        "Drama Club"
    ]);

    // Add role options
    const [roleOptions] = useState([
        "President",
        "Vice President",
        "Activity Coordinator",
        "Member"
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
          
            <div className="left-panel">
                <button className="back-button">
                    <i className="fas fa-arrow-left"></i>
                </button>

                <div className="welcome-content">
                    <button className="back-button" style={{ color: 'white', top: '8px', fontSize: '2rem'}} onClick={handleBackClick}>{"<"}</button>
                    <h1 className="welcome-title">Welcome Back!</h1>
                    <p className="welcome-subtitle">Welcome back Committee Member! Your club awaits your leadership.</p>
                    <p className="welcome-text">Manage events, engage members, and keep things running smoothly!</p>
                    <button className="login-button" onClick={handleLoginClick}>Login</button>
                </div>
            </div>

            <div className="right-panel">
                <button className="close-button" onClick={handleHomeClick}>x</button>
                <div className="form-container">
                    <h2 className="form-title">Create Account</h2>

                    <div className="form-fields">
                        <div className="input-group">
                            <i className="fas fa-user"></i>
                            <input type="text" placeholder="Full Name" name="fullName" />
                        </div>

                        {/* Club Select Dropdown */}
                        <div className="input-group">
                            <i className="fas fa-graduation-cap"></i>
                            <select name="club">
                                <option value="">Select your club</option>
                                {clubOptions.map((club) => (
                                    <option key={club} value={club}>{club}</option>
                                ))}
                            </select>
                        </div>

                        {/* Role Select Dropdown */}
                        <div className="input-group">
                            <i className="fas fa-graduation-cap"></i>
                            <select name="role">
                                <option value="">Select your role</option>
                                {roleOptions.map((role) => (
                                    <option key={role} value={role}>{role}</option>
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
        </div>
        </>
    );
}

export default CommitLogin;
