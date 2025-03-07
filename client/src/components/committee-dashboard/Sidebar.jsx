import "./Sidebar.css";
import { FaPlus, FaUsers, FaBriefcase, FaRegImage } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();

  const menuItems = [
    { icon: <FaPlus />, label: "Create Event", path: null },
    { icon: <FaUsers />, label: "Roles", path: "/committee/roles" },
    { icon: <FaBriefcase />, label: "Budget Tracker", path: "/committee/budget-tracker" },
    { icon: <FaRegImage />, label: "Image Management", path: "/committee/image-management" }
  ];

  const handleNavigation = (path) => {
    if (path) {
      navigate(path);
    }
  };

  return (
    <div className="entity6-sidebar">
      {menuItems.map((item, index) => (
        <div 
          className="sidebar-item" 
          key={index}
          onClick={() => handleNavigation(item.path)}
          style={{ cursor: item.path ? "pointer" : "default" }}>
          <div className="icon">{item.icon}</div>
          <span className="tooltip">{item.label}</span>
        </div>
      ))}
    </div>
  );
};

export default Sidebar;