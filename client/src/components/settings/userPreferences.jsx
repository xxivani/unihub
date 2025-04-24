import { useTheme } from "../../ThemeContext";
import { FaSun, FaMoon } from "react-icons/fa";
import SidebarSettings from "./sidebarSettings";
import "./user-preferences.css";

const UserPreferences = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="settings-layout">
        <SidebarSettings />
        <div className="user-preferences-container">
            <h1>User Preferences</h1>
            <div className="preferences-section">
                <h2>Accessibility</h2>
            <div className="contrast-toggle">
                <span>Choose Contrast</span>
                <button onClick={toggleTheme} className="toggle-button">
                    {theme === "light" ? <FaMoon /> : <FaSun />}
                </button>
            </div>
        </div>
        </div>
    </div>
  );
};

export default UserPreferences;