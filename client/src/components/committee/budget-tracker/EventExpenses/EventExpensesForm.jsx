// import {  Button, Form, Input, Modal, DatePicker, Select, Radio } from 'antd';
// import React, { useState } from 'react';
// import "./EventExpensesForm.css";
// // import "./AddExpense.css";

// const { RangePicker } = DatePicker;

// function EventAddExpenseButton() {
//   const [form] = Form.useForm();
//   const variant = Form.useWatch('variant', form);

//   const [isModalOpen, setIsModalOpen] = useState(false);

//   // Open Modal
//   const showModal = () => {
//     setIsModalOpen(true);
//   };

//   // Close Modal
//   const handleCancel = () => {
//     setIsModalOpen(false);
//   };

//   // Handle Form Submission
//   const handleSubmit = (values) => {
//     console.log('Form Values:', values);
//     form.resetFields();
//     setIsModalOpen(false); // Close modal after submission
//   };


//   return (
//     <>
//       {/* Plus Button to open Modal */}
//       <Button className='event-add-expense-button' type="primary" onClick={showModal}>
//         Add New Expense
//       </Button>

//       {/* Modal */}
//       <Modal
//         // title="Expense Form"
//         title={<div className='event-expense-form-modal-title'>Event Expense Form</div>}
//         open={isModalOpen}
//         onCancel={handleCancel}
//         footer={null} // Removes default buttons
        
//       >
//         <Form 
//           form={form}
//           layout="vertical"
//           variant={variant || 'filled'}
//           onFinish={handleSubmit} // Call handleSubmit on form submission
//         >
//           <Form.Item label="Event Name" name="input" rules={[{ required: true, message: 'Please input a title' }]}>
//             <Input />
//           </Form.Item>
//           <Form.Item label="Event Date" name="dateRange" rules={[{ required: true, message: 'Please input a title' }]}>
//             <DatePicker />
//           </Form.Item>
//           <Form.Item label="Event Status" name="radio" rules={[{ required: true, message: 'Please input a title' }]}>
//             <Radio.Group>
//                 <Radio value="ongoing">ONGOING</Radio>
//                 <Radio value="completed">COMPLETED</Radio>
//             </Radio.Group>
//           </Form.Item>
//           <Form.Item label="Expense Title" name="input" rules={[{ required: true, message: 'Please input a title' }]}>
//             <Input />
//           </Form.Item>
//           <Form.Item label="Expense Description" name="TextArea" rules={[{ required: true, message: 'Please input a title' }]}>
//             <Input.TextArea />
//           </Form.Item>

//           <Form.Item label="Expense Category" name="category" rules={[{ required: true, message: 'Please select a category' }]}>
//             <Select options={[{ value: 'option1', label: 'Catering' }, { value: 'option2', label: 'Materials' }, { value: 'option3', label: 'Prize' }, 
//                 { value: 'option4', label: 'Venue' }, { value: 'option5', label: 'Transportation' }
//             ]} />
//           </Form.Item>

//           <Form.Item label="Amount" name="amount" rules={[{ required: true, message: 'Please input an amount' }]}>
//             <Input />
//           </Form.Item>

          



//           <Form.Item>
//             <Button className='event-expense-form-submit-button' type="primary" htmlType="submit" >
//               Submit
//             </Button>
//             <Button className='event-expense-form-cancel-button' onClick={handleCancel} style={{ marginLeft: 8 }}>
//               Cancel
//             </Button>
//           </Form.Item>
//         </Form>
//       </Modal>
//     </>
//   );
// };

// export default EventAddExpenseButton;



import { Button, Form, Input, Modal, DatePicker, Select, Radio } from 'antd';
import React from 'react';
import "./EventExpensesForm.css";

const { RangePicker } = DatePicker;

function EventExpensesForm({ event, isModalOpen, setIsModalOpen }) {
  const [form] = Form.useForm();

  const handleCancel = () => {
    setIsModalOpen(false); // Close modal
  };

  const handleSubmit = (values) => {
    console.log('Updated Event Values:', values);
    setIsModalOpen(false); // Close modal after submission
  };

  React.useEffect(() => {
    if (event) {
      form.setFieldsValue({
        name: event.name,
        date: event.date,
        status: event.status,
        expense: event.expense,
        categories: event.categories.map(category => category.name),
      });
    }
  }, [event]);

  return (
    <Modal
      title="Edit Event Expense"
      open={isModalOpen}
      onCancel={handleCancel}
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit} // Form submission
      >
        <Form.Item label="Event Name" name="name" rules={[{ required: true, message: 'Please input event name' }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Event Date" name="date" rules={[{ required: true, message: 'Please select event date' }]}>
          <DatePicker />
        </Form.Item>
        <Form.Item label="Event Status" name="status" rules={[{ required: true, message: 'Please select status' }]}>
          <Radio.Group>
            <Radio value="ongoing">ONGOING</Radio>
            <Radio value="completed">COMPLETED</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="Expense" name="expense" rules={[{ required: true, message: 'Please input the expense amount' }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Categories" name="categories" rules={[{ required: true, message: 'Please select category' }]}>
          <Select mode="multiple" options={[
            { label: 'Catering', value: 'catering' },
            { label: 'Materials', value: 'materials' },
            { label: 'Prize', value: 'prize' },
            { label: 'Venue', value: 'venue' },
            { label: 'Transportation', value: 'transportation' },
          ]} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Save Changes
          </Button>
          <Button onClick={handleCancel} style={{ marginLeft: 8 }}>
            Cancel
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default EventExpensesForm;
