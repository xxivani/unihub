import { useLocation } from 'react-router-dom';
import "./sidebarSettings.css";

const SidebarSettings = () => {
  const location = useLocation();
  const path = location.pathname;
  
  const menuItems = [
    {
      title: 'Account Settings',
      path: '/settings/',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" 
             stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      )
    },
    {
      title: 'User Preferences',
      path: '/settings/preferences',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" 
             stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3"></circle>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 
                   2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 
                   1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 
                   2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4 
                   a1.65 1.65 0 0 0-1.82.33l-.06.06
                   a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06
                   a1.65 1.65 0 0 0 .33-1.82"></path>
        </svg>
      )
    },
    {
      title: 'Followed Clubs, Events & Role Openings',
      path: '/settings/followed',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" 
             stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      )
    }
  ];
  
  return (
    <div className="sidebar-settings">
      <div className="sidebar-header-settings">
        <h3>Settings</h3>
      </div>
      {menuItems.map((item, index) => (
        <div 
          key={index}
          className={`sidebar-item-settings ${path === item.path ? 'active' : ''}`}
          onClick={() => window.location.href = item.path}
        >
          <span className="sidebar-icon-settings">{item.icon}</span>
          <span>{item.title}</span>
        </div>
      ))}
    </div>
  );
};

export default SidebarSettings;
