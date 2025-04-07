import { useState } from 'react';
import Sidebar from './sidebarSettings';
import './account-settings.css';


// Fake data, replace once connected to backend
const AccountSettings = () => {
  const [activeTab, setActiveTab] = useState('personal');
  const [formData, setFormData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'admin123@gmail.com',
    phone: '+971 55116661666',
    club: 'Paw Club',
    role: 'Vice President',
    department: '',
    studentId: '',
    timeZone: 'Gulf Standard Time (GST)',
    language: 'English'
  });

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value
    }));
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);


    setMessage({ text: 'Profile updated successfully!', type: 'success' });
    setIsLoading(false);

    setTimeout(() => {
      setMessage({ text: '', type: '' });
    }, 3000);
  };

  return (
    <div className="settings-layout">
      <Sidebar />
      
      <div className="account-settings">
        <h1>Account Settings</h1>
        
        {message.text && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}
        
        <div className="tabs">
          <div 
            className={`tab ${activeTab === 'personal' ? 'active' : ''}`}
            onClick={() => handleTabClick('personal')}
          >
            Personal Info
          </div>
          <div 
            className={`tab ${activeTab === 'security' ? 'active' : ''}`}
            onClick={() => handleTabClick('security')}
          >
            Security
          </div>
        </div>
        
        {activeTab === 'personal' && (
          <form onSubmit={handleSubmit}>
            <div className="settings-section">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName">First Name</label>
                  <input 
                    type="text" 
                    id="firstName" 
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="lastName">Last Name</label>
                  <input 
                    type="text" 
                    id="lastName" 
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input 
                    type="email" 
                    id="email" 
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input 
                    type="tel" 
                    id="phone" 
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="club">Primary Club</label>
                  <input 
                    type="text" 
                    id="club" 
                    value={formData.club}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="role">Club Role</label>
                  <select 
                    id="role"
                    value={formData.role}
                    onChange={handleInputChange}
                  >
                    <option>President</option>
                    <option>Vice President</option>
                    <option>Secretary</option>
                    <option>Treasurer</option>
                    <option>Member</option>
                  </select>
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="department">Department</label>
                  <input 
                    type="text" 
                    id="department" 
                    placeholder="Enter your department"
                    value={formData.department}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="studentId">Student ID</label>
                  <input 
                    type="text" 
                    id="studentId" 
                    placeholder="Enter your student ID"
                    value={formData.studentId}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="timeZone">Time Zone</label>
                  <select 
                    id="timeZone"
                    value={formData.timeZone}
                    onChange={handleInputChange}
                  >
                    <option>Gulf Standard Time (GST)</option>
                    <option>Eastern Time (ET)</option>
                    <option>Pacific Time (PT)</option>
                    <option>Central European Time (CET)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="language">Preferred Language</label>
                  <select 
                    id="language"
                    value={formData.language}
                    onChange={handleInputChange}
                  >
                    <option>English</option>
                    <option>Arabic</option>
                    <option>French</option>
                    <option>Spanish</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="action-buttons">
              <button 
                type="submit" 
                className="primary-btn" 
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
              <button 
                type="button" 
                className="secondary-btn"
                onClick={() => window.location.reload()}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {activeTab === 'security' && (
          <div className="settings-section">
            <h2>Security Settings</h2>
            <p>Password change and security settings will go here.</p>
            {/* Add your security form or components */}
          </div>
        )}

        {activeTab === 'integrations' && (
          <div className="settings-section">
            <h2>Integration Settings</h2>
            <p>Third-party integrations will go here.</p>
            {/* Add your integrations form or components */}
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountSettings;
