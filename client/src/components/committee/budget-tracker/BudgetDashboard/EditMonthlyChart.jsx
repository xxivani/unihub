import React, { useState } from 'react';
import { Button, Form, Input, Modal, Radio, ConfigProvider } from 'antd';
import "./EditMonthlyChart.css";
import { FaEdit } from "react-icons/fa";

function EditMonthlyChart({ chartData1, chartData2, onUpdateChartData }) {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  const [form] = Form.useForm();
  const variant = Form.useWatch('variant', form);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState({});
  const [selectedSemester, setSelectedSemester] = useState("1");
  const [loading, setLoading] = useState(false);
  
  // Open Modal
  const showModal = () => {
    setIsModalOpen(true);
    // Reset form when opening
    setSelectedMonth({});
    setSelectedSemester("1");
  };

  // Close Modal
  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedMonth({});
  };

  // Handle Form Submission
  const handleSubmit = async () => {
    if (!selectedMonth.month) {
      alert('Please select a month');
      return;
    }
    
    try {
      setLoading(true);
      
      const updatedAmount = parseFloat(selectedMonth.amount) || 0;
      
      // Make API call to update monthly expenses
      const response = await fetch(`${apiUrl}/update_expRoute/monthly`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          month: selectedMonth.month,
          amount: updatedAmount,
          semester: parseInt(selectedSemester)
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update monthly expenses');
      }
      
      // Update local state for immediate UI feedback
      if (selectedSemester === "1") {
        const monthIndex = chartData1.labels.findIndex(
          month => month === selectedMonth.month
        );
        
        if (monthIndex !== -1) {
          const newData = {...chartData1};
          newData.datasets[0].data[monthIndex] = updatedAmount;
          
          // Call parent's update function if provided
          if (onUpdateChartData) {
            onUpdateChartData(newData, 1);
          }
        }
      } else {
        const monthIndex = chartData2.labels.findIndex(
          month => month === selectedMonth.month
        );
        
        if (monthIndex !== -1) {
          const newData = {...chartData2};
          newData.datasets[0].data[monthIndex] = updatedAmount;
          
          // Call parent's update function if provided
          if (onUpdateChartData) {
            onUpdateChartData(newData, 2);
          }
        }
      }
      
      alert('Monthly expenses updated successfully');
      setIsModalOpen(false);
      setSelectedMonth({});
      
    } catch (error) {
      console.error('Error updating monthly expenses:', error);
      alert('Failed to update monthly expenses');
    } finally {
      setLoading(false);
    }
  };

  // Handle semester selection
  const handleSemesterChange = (e) => {
    setSelectedSemester(e.target.value);
    setSelectedMonth({}); // Reset month selection when semester changes
  };

  // Handle month selection
  const handleMonthChange = (e) => {
    const selectedMonthValue = e.target.value;
    const currentChartData = selectedSemester === "1" ? chartData1 : chartData2;
    
    const monthIndex = currentChartData.labels.findIndex(
      month => month === selectedMonthValue
    );
    
    const currentAmount = monthIndex !== -1 ? 
      currentChartData.datasets[0].data[monthIndex].toString() : "0";
    
    setSelectedMonth({
      month: selectedMonthValue,
      amount: currentAmount
    });
  };

  // Handle amount input change
  const handleAmountChange = (e) => {
    setSelectedMonth({
      ...selectedMonth,
      amount: e.target.value
    });
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#314521",
          colorPrimaryHover: "#314521"
        },
      }}
    >
      {/* Edit Button to open Modal */}
      <Button className='edit-expense-icon' type="primary" onClick={showModal} style={{ position: 'absolute', top: '10px', right: '10px' }}>
        <FaEdit style={{ color: "white" }}/>
      </Button>
      
      {/* Modal */}
      <Modal
        title={<div className='edit-chart-modal-title'>Edit Monthly Expenses</div>}
        open={isModalOpen}
        onCancel={handleCancel}
        onOk={handleSubmit}
        confirmLoading={loading}
        footer={[
          <Button key="cancel" className='edit-chart-cancel-button' onClick={handleCancel} disabled={loading}>
            Cancel
          </Button>,
          <Button key="submit" className='edit-chart-submit-button' type="primary" onClick={handleSubmit} loading={loading}>
            Update
          </Button>,
        ]}
      >
        <Form
          form={form}
          layout="vertical"
          variant={variant || 'filled'}
        >
          {/* Semester Selection */}
          <Form.Item label="Select Semester">
            <Radio.Group value={selectedSemester} onChange={handleSemesterChange}>
              <Radio value="1">Semester 1</Radio>
              <Radio value="2">Semester 2</Radio>
            </Radio.Group>
          </Form.Item>
          
          {/* Month Selection */}
          <Form.Item label="Select Month">
            <Radio.Group value={selectedMonth.month} onChange={handleMonthChange}>
              {selectedSemester === "1" ? 
                chartData1.labels.map(month => (
                  <Radio key={month} value={month}>{month}</Radio>
                )) : 
                chartData2.labels.map(month => (
                  <Radio key={month} value={month}>{month}</Radio>
                ))
              }
            </Radio.Group>
          </Form.Item>
          
          {/* Amount Input */}
          {selectedMonth.month && (
            <Form.Item label={`Amount for ${selectedMonth.month}`}>
              <Input
                type="number"
                placeholder="Enter amount"
                value={selectedMonth.amount}
                onChange={handleAmountChange}
                min="0"
                step="0.01"
                style={{ width: "100%" }}
              />
            </Form.Item>
          )}
        </Form>
      </Modal>
    </ConfigProvider>
  );
}

export default EditMonthlyChart;