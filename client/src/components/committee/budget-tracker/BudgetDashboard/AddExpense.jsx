import React, { useState } from 'react';
import {  Button, Form, Input, Modal, DatePicker, Select } from 'antd';
import "./BudgetDashboard.css"
import "./AddExpense.css"
// import 'antd/dist/reset.css';
import { FaPlus } from "react-icons/fa";


const { RangePicker } = DatePicker;

function AddExpenseButton() {
  const [form] = Form.useForm();
  const variant = Form.useWatch('variant', form);

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Open Modal
  const showModal = () => {
    setIsModalOpen(true);
  };

  // Close Modal
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  // Handle Form Submission
  const handleSubmit = (values) => {
    console.log('Form Values:', values);
    form.resetFields();
    setIsModalOpen(false); // Close modal after submission
  };


  return (
    <>
      {/* Plus Button to open Modal */}
      <Button className='add-expense-icon' type="primary" onClick={showModal}>
        <FaPlus style={{ color: "black" }}/>
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

          <Form.Item label="Expense Title" name="input" rules={[{ required: true, message: 'Please input a title' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Expense Description" name="TextArea" rules={[{ required: true, message: 'Please input a title' }]}>
            <Input.TextArea />
          </Form.Item>

          <Form.Item label="Expense Category" name="category" rules={[{ required: true, message: 'Please select a category' }]}>
            <Select options={[{ value: 'option1', label: 'Catering' }, { value: 'option2', label: 'Materials' }, { value: 'option3', label: 'Prize' }, 
                { value: 'option4', label: 'Venue' }, { value: 'option5', label: 'Transportation' }
            ]} />
          </Form.Item>

          <Form.Item label="Amount" name="amount" rules={[{ required: true, message: 'Please input an amount' }]}>
            <Input />
         </Form.Item>

          <Form.Item label="Date Range" name="dateRange" rules={[{ required: true, message: 'Please select a date range!' }]}>
            <DatePicker />
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
    </>
  );
};

export default AddExpenseButton;
