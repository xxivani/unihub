import { Button, Form, Input, Modal, DatePicker, Select, Radio, Checkbox } from 'antd';
import React, { useState } from 'react';
import "./EventExpensesForm.css";
// import "./AddExpense.css";

const { RangePicker } = DatePicker;

function EventAddExpenseButton({ onAddEvent }) {
  const [form] = Form.useForm();
  const variant = Form.useWatch('variant', form);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState({});

  // Category colors for visual consistency with the table
  const categoryColors = {
      catering: "blue",
      materials: "green",
      prize: "gold",
      venue: "purple",
      transportation: "red",
  };

  // Available categories
  const categories = [
      { label: 'Catering', value: 'catering' },
      { label: 'Materials', value: 'materials' },
      { label: 'Prize', value: 'prize' },
      { label: 'Venue', value: 'venue' },
      { label: 'Transportation', value: 'transportation' },
  ];

  // Open Modal
  const showModal = () => {
    setIsModalOpen(true);
    setSelectedCategories({});
    form.resetFields();
  };

  // Close Modal
  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedCategories({});
    form.resetFields();
  };

  // Handle checkbox change for categories
  const handleCategoryChange = (category, checked) => {
    setSelectedCategories(prev => {
      if (checked) {
        return {
          ...prev,
          [category]: "" // Initialize with empty string when checked
        };
      } else {
        const newCategories = { ...prev };
        delete newCategories[category]; // Remove when unchecked
        return newCategories;
      }
    });
  };

  // Handle amount change for a category
  const handleAmountChange = (category, value) => {
    setSelectedCategories(prev => ({
      ...prev,
      [category]: value
    }));
  };

  // Handle Form Submission
  const handleSubmit = (values) => {
    // Convert selectedCategories to the format needed for the table
    const categoriesArray = Object.entries(selectedCategories)
      .filter(([_, amount]) => amount !== "")
      .map(([name, amount]) => ({
        name,
        amount: Number(amount)
      }));

    // Calculate total expense from category amounts
    const totalExpense = Object.values(selectedCategories)
      .reduce((sum, amount) => sum + (Number(amount) || 0), 0);
    
    // Create the new event object
    const newEvent = {
      key: Date.now().toString(), // Generate a unique key
      name: values.eventName,
      date: values.eventDate.format('DD/MM/YYYY'),
      status: values.eventStatus,
      expense: `AED ${totalExpense}`,
      categories: categoriesArray,
    };

    // Call the parent function to add this to the table
    if (onAddEvent) {
      onAddEvent(newEvent);
    }

    console.log('New Event Added:', newEvent);
    
    // Reset and close
    form.resetFields();
    setSelectedCategories({});
    setIsModalOpen(false);
  };

  return (
    <>
      {/* Button to open Modal */}
      <Button className='event-add-expense-button' type="primary" onClick={showModal}>
        Add New Expense
      </Button>

      {/* Modal */}
      <Modal
        title={<div className='event-expense-form-modal-title'>Event Expense Form</div>}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          variant={variant || 'filled'}
          onFinish={handleSubmit}
        >
          <Form.Item 
            label="Event Name" 
            name="eventName" 
            rules={[{ required: true, message: 'Please input event name' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item 
            label="Event Date" 
            name="eventDate" 
            rules={[{ required: true, message: 'Please select a date' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item 
            label="Event Status" 
            name="eventStatus" 
            rules={[{ required: true, message: 'Please select status' }]}
          >
            <Radio.Group>
              <Radio value="ONGOING">ONGOING</Radio>
              <Radio value="COMPLETED">COMPLETED</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item 
            label="Expense Categories" 
            required
            validateStatus={Object.keys(selectedCategories).length === 0 ? 'error' : 'success'}
            help={Object.keys(selectedCategories).length === 0 ? 'Please select at least one category' : null}
          >
            {categories.map(category => (
              <div key={category.value} style={{ marginBottom: "8px" }}>
                <Checkbox
                  checked={selectedCategories[category.value] !== undefined}
                  onChange={(e) => handleCategoryChange(category.value, e.target.checked)}
                >
                  {category.label}
                </Checkbox>

                {/* Conditionally render amount input */}
                {selectedCategories[category.value] !== undefined && (
                  <Input
                    type="number"
                    addonBefore="AED"
                    placeholder="Enter amount"
                    value={selectedCategories[category.value]}
                    onChange={(e) => handleAmountChange(category.value, e.target.value)}
                    style={{ width: "100%", marginTop: "5px" }}
                  />
                )}
              </div>
            ))}
          </Form.Item>

          <Form.Item>
            <Button 
              className='event-expense-form-submit-button' 
              type="primary" 
              htmlType="submit"
              disabled={Object.keys(selectedCategories).length === 0}
            >
              Submit
            </Button>
            <Button 
              className='event-expense-form-cancel-button' 
              onClick={handleCancel} 
              style={{ marginLeft: 8 }}
            >
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default EventAddExpenseButton;
