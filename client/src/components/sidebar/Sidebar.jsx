import "./Sidebar.css";
import { FaPlus, FaUsers, FaBriefcase, FaCalendarAlt } from "react-icons/fa";

const Sidebar = () => {
  const menuItems = [
    { icon: <FaPlus />, label: "Create Event" },
    { icon: <FaUsers />, label: "Roles" },
    { icon: <FaBriefcase />, label: "Budget Tracker" },
    { icon: <FaCalendarAlt />, label: "Committee Calendar" }
  ];

  return (
    <div className="sidebar">
      {menuItems.map((item, index) => (
        <div className="sidebar-item" key={index}>
          <div className="icon">{item.icon}</div>
          <span className="tooltip">{item.label}</span>
        </div>
      ))}
    </div>
  );
};

export default Sidebar;