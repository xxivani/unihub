import { useTheme } from "../../ThemeContext";
import { FaSun, FaMoon } from "react-icons/fa";
import SidebarSettings from "./sidebarSettings";
import "./user-preferences.css";
import { useState, useEffect } from "react";

const UserPreferences = () => {
  const { theme, toggleTheme } = useTheme();
  const [fontSize, setFontSize] = useState(() => {
    // Get the stored font size or use default
    const storedSize = sessionStorage.getItem('fontSize');
    return storedSize ? parseInt(storedSize) : 16;
  });

  // Apply font size on component mount
  useEffect(() => {
    document.documentElement.style.setProperty('--base-font-size', `${fontSize}px`);
  }, []);

  const handleFontSizeChange = (e) => {
    const newSize = parseInt(e.target.value);
    setFontSize(newSize);
    // Store the new size in sessionStorage
    sessionStorage.setItem('fontSize', newSize);
    document.documentElement.style.setProperty('--base-font-size', `${newSize}px`);
  };

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
                <div className="font-size-control">
                    <label htmlFor="fontSize">Font Size</label>
                    <div className="font-size-slider">
                        <input
                            type="range"
                            id="fontSize"
                            min="12"
                            max="24"
                            value={fontSize}
                            onChange={handleFontSizeChange}
                        />
                        <span className="font-size-value">{fontSize}px</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default UserPreferences;