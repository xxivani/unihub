import React, { useState } from 'react';
import { Menu, ConfigProvider } from 'antd';

const items = [
  { label: 'All Students', key: 'all' },
  { label: 'Paid', key: 'paid' },
  { label: 'Unpaid', key: 'unpaid' },
];

const FilterBarStudents = () => {
  const [current, setCurrent] = useState('all');

  const onClick = (e) => {
    setCurrent(e.key);
  };
  

  return (
    <ConfigProvider
      theme={{
        components: {
          Menu: {
            itemHoverColor: "#4a6831", // Hover text color
            horizontalItemBorderRadius: 10, // Rounded corners
            horizontalItemSelectedColor: "#314521"
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
        }}
        
      >
        {items.map((item) => (
          <Menu.Item
            key={item.key}
            style={{
              fontWeight: current === item.key ? 'bold' : 'normal',
              fontSize: "16px",
              padding: '0px 20px', // Adjusts spacing to look balanced
              

            }}
          >
            {item.label}
          </Menu.Item>
        ))}
      </Menu>
    </ConfigProvider>
  );
};

export default FilterBarStudents;
