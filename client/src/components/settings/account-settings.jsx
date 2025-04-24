import { useState, useEffect } from 'react';
import Sidebar from './sidebarSettings';
import './account-settings.css';

const AccountSettings = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: '',
    club: '',
    committeeRole: '',
  });

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (!storedUser) return;

    const { id, role } = JSON.parse(storedUser);
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

    const fetchUserData = async () => {
      try {
        const res = await fetch(`${apiUrl}/users/${id}`);
        const data = await res.json();

        const fullName = role === 'student' ? data.studentName : data.committeeName;
        const [firstName, ...lastNameParts] = fullName.split(" ");
        const lastName = lastNameParts.join(" ");

        setFormData(prev => ({
          ...prev,
          firstName: firstName || '',
          lastName: lastName || '',
          email: data.email || '',
          role: data.role || '',
          club: data.club || '',
          committeeRole: data.committeeRole || ''
        }));
      } catch (err) {
        console.error("Failed to fetch user data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className="settings-layout">
      <Sidebar />
      <div className="account-settings">
        <h1>Account Settings</h1>

        <form>
          <div className="settings-section">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <input type="text" id="firstName" value={formData.firstName} disabled />
              </div>
              <div className="form-group">
                <label htmlFor="lastName">Last Name</label>
                <input type="text" id="lastName" value={formData.lastName} disabled />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input type="email" id="email" value={formData.email} disabled />
              </div>
              <div className="form-group">
                <label htmlFor="role">Role</label>
                <input type="text" id="role" value={formData.role} disabled />
              </div>
            </div>

            {formData.role === "committee" && (
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="club">Primary Club</label>
                  <input type="text" id="club" value={formData.club} disabled />
                </div>
                <div className="form-group">
                  <label htmlFor="committeeRole">Club Role</label>
                  <input type="text" id="committeeRole" value={formData.committeeRole} disabled />
                </div>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AccountSettings;