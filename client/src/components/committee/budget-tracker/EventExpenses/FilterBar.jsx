import { useState, useEffect } from 'react';
import { Menu, ConfigProvider } from 'antd';

// Fix the filter items to match exactly what the backend expects
const items = [
  { label: 'All Events', key: 'all' },
  { label: 'Ongoing', key: 'ONGOING' },  // Key must be uppercase to match backend
  { label: 'Completed', key: 'COMPLETED' },  // Key must be uppercase to match backend
];

const FilterBar = ({ onFilterChange, initialFilter = 'all' }) => {
  // Set the initial state from props if provided
  const [current, setCurrent] = useState(initialFilter);
  
  // Track current theme
  const getInitialTheme = () => document.body.getAttribute("data-theme") || "light";
  const [currentTheme, setCurrentTheme] = useState(getInitialTheme());
  const isDarkTheme = currentTheme === "dark";
  
  // Update selected state when initialFilter changes
  useEffect(() => {
    if (initialFilter && initialFilter !== current) {
      setCurrent(initialFilter);
    }
  }, [initialFilter]);
  
  // Watch for theme changes
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const newTheme = document.body.getAttribute("data-theme");
      setCurrentTheme(newTheme);
    });
    
    observer.observe(document.body, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);
  
  const onClick = (e) => {
    setCurrent(e.key);
    if (onFilterChange) {
      // Pass the clicked key directly to the parent
      console.log(`Filter changed to: ${e.key}`);
      onFilterChange(e.key);
    }
  };
  
  return (
    <ConfigProvider
      theme={{
        components: {
          Menu: {
            horizontalItemBorderRadius: 10,
            colorPrimary: "#4a6831",
            colorBgContainer: isDarkTheme ? "#121212" : "#ffffff",
            colorItemBg: isDarkTheme ? "#121212" : "#ffffff",
            horizontalItemSelectedColor: isDarkTheme ? "white" : "#314521",
            itemHoverColor: isDarkTheme ? "#88b663" : "#4a6831",
            itemSelectedBg: isDarkTheme ? "#3a4d2a" : "#e6f0dd",
            itemSelectedColor: isDarkTheme ? "white" : "#314521",
            itemActiveBg: isDarkTheme ? "#2a3a1f" : "#e6f0dd",
            colorItemText: isDarkTheme ? "#ffffff" : "#000000",
          },
        },
      }}
    >
      <Menu
        onClick={onClick}
        selectedKeys={[current]}
        mode="horizontal"
        style={{
          width: '400px',
          backgroundColor: isDarkTheme ? "#121212" : "#ffffff",
        }}
      >
        {items.map((item) => (
          <Menu.Item
            key={item.key}
            style={{
              fontWeight: current === item.key ? 'bold' : 'normal',
              fontSize: "16px",
              padding: '0px 20px',
              backgroundColor: 'transparent',
            }}
          >
            {item.label}
          </Menu.Item>
        ))}
      </Menu>
    </ConfigProvider>
  );
};

export default FilterBar;