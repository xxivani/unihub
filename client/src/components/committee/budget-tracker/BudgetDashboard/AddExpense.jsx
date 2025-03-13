import React, { useState } from 'react';
import { Button, Form, Input, Modal, Checkbox, ConfigProvider } from 'antd';
import "./BudgetDashboard.css"
import "./AddExpense.css"
import { FaEdit } from "react-icons/fa";

function AddExpenseButton({ onUpdateExpenses, chartData }) {
  const [form] = Form.useForm();
  const variant = Form.useWatch('variant', form);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState({});
  
  // These categories should match the labels in your chart
  const categories = ["Catering", "Materials", "Prize", "Transportation", "Venue"];

  // Open Modal
  const showModal = () => {
    // Initialize selectedCategories with current chart data when modal opens
    const initialCategories = {};
    if (chartData && chartData.labels) {
      chartData.labels.forEach((category, index) => {
        // Add the current data value to the category
        initialCategories[category.toLowerCase()] = chartData.datasets[0].data[index].toString();
      });
    }
    setSelectedCategories(initialCategories);
    setIsModalOpen(true);
  };

  // Close Modal
  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedCategories({});
  };

  // Handle Form Submission
  const handleSubmit = (values) => {
    console.log('Form Values:', values);
    
    // Call the parent component's function to update the chart
    if (onUpdateExpenses) {
      onUpdateExpenses(selectedCategories);
    }
    
    form.resetFields();
    setIsModalOpen(false);
    setSelectedCategories({});
  };

  // Handle Checkbox Change
  const handleCheckboxChange = (category, checked) => {
    setSelectedCategories((prev) => {
      if (checked) {
        // Find the current value in chartData if available
        const index = chartData.labels.findIndex(
          label => label.toLowerCase() === category.toLowerCase()
        );
        
        const currentValue = index !== -1 
          ? chartData.datasets[0].data[index].toString() 
          : "";
          
        return {
          ...prev,
          [category.toLowerCase()]: currentValue,
        };
      } else {
        const newCategories = { ...prev };
        delete newCategories[category.toLowerCase()];
        return newCategories;
      }
    });
  };

  // Handle Amount Input Change
  const handleAmountChange = (category, value) => {
    setSelectedCategories((prev) => ({
      ...prev,
      [category.toLowerCase()]: value,
    }));
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#314521", // Change primary button color (Green)
          colorPrimaryHover: "#314521"
        },
      }}
    >
      {/* Edit Button to open Modal */}
      {/* {user && user.role === "admin" && ( */}
        <Button className='add-expense-icon' type="primary" onClick={showModal}>
          <FaEdit style={{ color: "white" }}/>
        </Button>
      {/* )} */}
      
      {/* Modal */}
      <Modal
        title={<div className='expense-form-modal-title'>Edit Expenses</div>}
        open={isModalOpen}
        onCancel={handleCancel}
        onOk={handleSubmit}
        footer={[
          <Button key="cancel" className='expense-form-cancel-button' onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="submit" className='expense-form-submit-button' type="primary" onClick={handleSubmit}>
            Update
          </Button>,
        ]}
      >
        <Form
          form={form}
          layout="vertical"
          variant={variant || 'filled'}
        >
          {/* Expense Category Checkboxes */}
          <Form.Item label="Expense Category" name="category">
            {categories.map((category) => {
              const lowerCategory = category.toLowerCase();
              return (
                <div key={category} style={{ marginBottom: "8px" }}>
                  <Checkbox
                    checked={selectedCategories[lowerCategory] !== undefined}
                    onChange={(e) => handleCheckboxChange(category, e.target.checked)}
                    style={{colorPrimary: "#314521"}}
                  >
                    {category}
                  </Checkbox>
                  
                  {/* Conditionally Render Amount Input */}
                  {selectedCategories[lowerCategory] !== undefined && (
                    <Input
                      type="number"
                      placeholder="Enter amount"
                      value={selectedCategories[lowerCategory]}
                      onChange={(e) => handleAmountChange(lowerCategory, e.target.value)}
                      style={{ width: "100%", marginTop: "5px" }}
                    />
                  )}
                </div>
              );
            })}
          </Form.Item>
        </Form>
      </Modal>
    </ConfigProvider>
  );
}

export default AddExpenseButton;