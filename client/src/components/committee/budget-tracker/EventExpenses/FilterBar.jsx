import { useState, useEffect } from 'react';
import { Menu, ConfigProvider } from 'antd';

const items = [
  { label: 'All Events', key: 'all' },
  { label: 'Ongoing', key: 'ongoing' },
  { label: 'Completed', key: 'completed' },
];

const FilterBar = ({ onFilterChange }) => {
  const [current, setCurrent] = useState('all');
  
  // Track current theme
  const getInitialTheme = () => document.body.getAttribute("data-theme") || "light";
  const [currentTheme, setCurrentTheme] = useState(getInitialTheme());
  const isDarkTheme = currentTheme === "dark";

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
      onFilterChange(e.key);
    }
  };
  
  return (
    <ConfigProvider
      theme={{
        components: {
          Menu: {
            // itemHoverColor: "#4a6831", // Hover text color
            horizontalItemBorderRadius: 10, // Rounded corners
            // horizontalItemSelectedColor: "#314521",

            colorPrimary: "#4a6831",
            colorBgContainer: isDarkTheme ? "#121212" : "#ffffff", // Critical: Set background to match theme
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
          // borderBottom: 'none',
          backgroundColor: isDarkTheme ? "#121212" : "#ffffff", // Set background inline as well

        }}
      >
        {items.map((item) => (
          <Menu.Item
            key={item.key}
            style={{
              fontWeight: current === item.key ? 'bold' : 'normal',
              fontSize: "16px",
              padding: '0px 20px', // Adjusts spacing to look balanced
              backgroundColor: 'transparent', // Ensure items also have transparent bg

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