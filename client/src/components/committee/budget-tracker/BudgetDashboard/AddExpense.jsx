import React, { useState } from 'react';
import {  Button, Form, Input, Modal, DatePicker, Checkbox, ConfigProvider } from 'antd';
import "./BudgetDashboard.css"
import "./AddExpense.css"
// import 'antd/dist/reset.css';
import { FaPlus } from "react-icons/fa";
import { FaRegEdit } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";


const { RangePicker } = DatePicker;

function AddExpenseButton() {
  const [form] = Form.useForm();
  const variant = Form.useWatch('variant', form);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState({});

  const categories = ["Catering", "Materials", "Prize", "Venue", "Transportation"];


  // Open Modal
  const showModal = () => {
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
    form.resetFields();
    setIsModalOpen(false); // Close modal after submission
    setSelectedCategories({});

  };

  const handleCheckboxChange = (category, checked) => {
    setSelectedCategories((prev) => ({
      ...prev,
      [category]: checked ? "" : undefined, // Add input field when checked, remove when unchecked
    }));
  };

  // Handle Amount Input Change
  const handleAmountChange = (category, value) => {
    setSelectedCategories((prev) => ({
      ...prev,
      [category]: value, // Store input value
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
      {/* Plus Button to open Modal */}
      <Button className='add-expense-icon' type="primary" onClick={showModal}>
        <FaEdit style={{ color: "black" }}/>
      </Button>

      {/* Modal */}
      <Modal
        // title="Expense Form"
        title={<div className='expense-form-modal-title'>Expense Form</div>}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null} // Removes default buttons
        
      >
        <Form 
          form={form}
          layout="vertical"
          variant={variant || 'filled'}
          onFinish={handleSubmit} // Call handleSubmit on form submission
        >
          
          {/* Expense Category Checkboxes */}
          <Form.Item label="Expense Category" name="category">
            {categories.map((category) => (
              <div key={category} style={{ marginBottom: "8px" }}>
                <Checkbox
                  checked={selectedCategories[category] !== undefined}
                  onChange={(e) => handleCheckboxChange(category, e.target.checked)}
                  style={{colorPrimary: "#314521"}}
                >
                  {category}
                </Checkbox>

                {/* Conditionally Render Amount Input */}
                {selectedCategories[category] !== undefined && (
                  <Input
                    type="number"
                    placeholder="Enter amount"
                    value={selectedCategories[category]}
                    onChange={(e) => handleAmountChange(category, e.target.value)}
                    style={{ width: "100%", marginTop: "5px" }}
                  />
                )}
              </div>
            ))}
          </Form.Item>

          <Form.Item>
            <Button className='expense-form-submit-button' type="primary" htmlType="submit" >
              Submit
            </Button>
            <Button className='expense-form-cancel-button' onClick={handleCancel} style={{ marginLeft: 8 }}>
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </ConfigProvider>
  );
};

export default AddExpenseButton;
