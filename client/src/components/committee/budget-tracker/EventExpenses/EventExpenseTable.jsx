import { Space, Table, Tag, Typography, Button, Form, Input, Select, Modal, Checkbox, ConfigProvider, InputNumber } from 'antd';
import Pagination from "../../../viewRO/Pagination";
import { useState, useEffect } from 'react';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Link } from "react-router-dom";
import EventAddExpenseButton from './EventExpensesForm';
import "./EventExpensesForm.css";


const { Text } = Typography;
const { Option } = Select;


const EventExpensesTable = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 5; // Number of rows per page
    const [editingEvent, setEditingEvent] = useState(null);
    const [form] = Form.useForm();
    const [selectedCategories, setSelectedCategories] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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


    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

    

    useEffect(() => {
    const fetchEvents = async () => {
        try {
        setLoading(true);
        const response = await fetch(`${apiUrl}/bt_eventRoute`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch events');
        }
        
        const events = await response.json();
        setData(events);
        setError(null);
        } catch (err) {
        console.error('Error fetching events:', err);
        setError('Failed to load events');
        } finally {
        setLoading(false);
        }
    };
  
    fetchEvents();
    }, []);

    // handle delete
    const handleDelete = async (record) => {
        try {
            const response = await fetch(`${apiUrl}/bt_eventRoute/${record.id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error ("Failed to delete event");
            }

            // update local state after deletion
            const updatedData =  data.filter(item => item.key !== record.key);
            setData(updatedData);

            alert("Event deleted successfully!");

        } catch (error) {
            console.error ("Error deleting event:", error);
            alert ("Failed to delete event");
        }
    };
    


    const columns = [
        {
            title: "Event Name",
            dataIndex: "name",
            key: "name",
            // width: 250,
            render: (text) => <a>{text}</a>,

        },
        {
            title: "Event Date",
            dataIndex: "date",
            key: "date",
            width: 150,
        },
        {
            title: "Event Status",
            dataIndex: "status",
            key: "status",

        },
        {
            title: "Total Expense",
            dataIndex: "expense",
            key: "expense",
            width: 150,
        },
        {
            title: "Expense Categories",
            dataIndex: "categories",
            key: "categories",
            render: (_, { categories }) => (
                <>
                    {categories.map(({ name, amount }) => (
                        <Tag
                            color={categoryColors[name]}
                            key={name}
                            style={{
                                marginBottom: '4px', // Adjust this value as needed
                                marginRight: '4px', // Space between tags in the same row
                                display: 'inline-block', // Ensure it stays inline with other tags
                            }}
                        >
                            AED {amount}
                        </Tag>
                    ))}
                </>
            ),
        },
        {
            title: "Actions",
            width: 150,
            render: (_, record) => (
                <Space size="middle">
                    <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)}>Edit</Button>
                    <Button type="link" icon={<DeleteOutlined />} danger onClick={() => handleDelete(record)}>Delete</Button>
                </Space>
            ),
        },
        {
            title: "View Students",
            width: 150,
            render: (_, record) => (
                <Space size="middle">
                    {/* <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)}>Edit</Button>
                    <Button type="link" icon={<DeleteOutlined />} danger onClick={() => handleDelete(record)}>Delete</Button> */}
                    <Link to="/committee/budget-tracker/registered-students" onClick={() => window.scrollTo(0, 0)} style={{color: "black"}}>View Registered Students</Link>
                </Space>
            ),
        },
    ];

    // CHANGE: Added function to handle adding a new event from the form
    const handleAddEvent = (newEvent) => {
        setData([...data, newEvent]);
    };

    const handleEdit = (record) => {
        setEditingEvent(record);
        
        // Set the form fields with the event's existing data
        form.setFieldsValue({
            name: record.name,
            date: record.date,
            status: record.status,
        });
    
        // Initialize selectedCategories with existing values from the event's categories
        const initialSelectedCategories = {};
        record.categories.forEach(({ name, amount }) => {
            initialSelectedCategories[name] = amount; // Add category and amount
        });
        setSelectedCategories(initialSelectedCategories);
    };

    const handleSave = async () => {
        form.validateFields().then(async (values) => {
          try {
            // Convert selected categories to array format
            const updatedCategories = Object.entries(selectedCategories).map(([name, amount]) => ({
              name,
              amount: Number(amount)
            }));
            
            // Prepare update data
            const updateData = {
              name: values.name,
              date: values.date,
              status: values.status,
              description: values.description || '',
              categories: updatedCategories
            };
            
            // Send PUT request to API
            const response = await fetch(`${apiUrl}/bt_eventRoute/${editingEvent.id}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(updateData)
            });
            
            if (!response.ok) {
              throw new Error('Failed to update event');
            }
            
            const updatedEvent = await response.json();
            
            // Update local state with the returned data
            const updatedData = data.map((item) =>
              item.key === editingEvent.key ? updatedEvent : item
            );
            
            setData(updatedData);
            setEditingEvent(null);
            setSelectedCategories({});
            
            alert('Event updated successfully');
            } catch (error) {
                console.error('Error updating event:', error);
                alert(`Failed to update event: ${error.message}`);
            }

        });
    };

    const handleCheckboxChange = (category, checked) => {
        setSelectedCategories((prev) => {
            if (checked) {
                return {
                    ...prev,
                    [category]: "", // When checked, show the input field with an empty value
                };
            } else {
                const newCategories = { ...prev };
                delete newCategories[category]; // Remove category when unchecked
                return newCategories;
            }
        });
    };
    
    const handleAmountChange = (category, value) => {
        setSelectedCategories((prev) => ({
            ...prev,
            [category]: value, // Store input value
        }));
    };

    // CHANGE: Added function to calculate total expense from all selected categories
    const calculateTotalExpense = () => {
        return Object.values(selectedCategories)
            .reduce((sum, amount) => sum + (Number(amount) || 0), 0);
    };
    


    const categories = ["catering", "materials", "prize", "venue", "transportation"];

    const categoryColors = {
        catering: "blue",
        materials: "green",
        prize: "gold",
        venue: "purple",
        transportation: "red",
    };

    const [data, setData] = useState([]);

    const totalPages = Math.ceil(data.length / pageSize);
    const paginatedData = data.slice((currentPage - 1) * pageSize, currentPage * pageSize);


    return (

        <ConfigProvider
            theme={{
                token: {
                    // colorPrimary: "#314521", // Change primary button color (Green)
                    // colorPrimaryHover: "#314521"

                    colorPrimary: "#314521",
                    colorPrimaryHover: "#4a6831",
                    // colorText: isDarkTheme ? "#ffffff" : "#000000",
                    colorBgContainer: isDarkTheme ? "#ebebed" : "#ffffff",
                    colorBorderSecondary: isDarkTheme ? "#555555" : "#f0f0f0",

                },
            }}
        >       
            
            <div style={{ 
                marginBottom: 16, 
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                {/* Left side with legend */}
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Text strong style={{ marginRight: 8 }}>Category Legend: </Text>
                    <Space size="small">
                        {Object.entries(categoryColors).map(([category, color]) => (
                            <Tag color={color} key={category}>
                                {category.toUpperCase()}
                            </Tag>
                        ))}
                    </Space>
                </div>
                
                {/* Right side with button */}
                <EventAddExpenseButton onAddEvent={handleAddEvent} />
            </div>

            <Table columns={columns} dataSource={paginatedData} pagination={false} />
            <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
            />
            <Modal
                title={<div className='event-expense-form-modal-title'>Edit Event</div>}
                open={!!editingEvent}
                onCancel={() => setEditingEvent(null)}
                onOk={handleSave}
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="name" label="Event Name" rules={[{ required: true }]}> 
                        <Input />
                    </Form.Item>
                    <Form.Item name="date" label="Event Date" rules={[{ required: true }]}> 
                        <Input />
                    </Form.Item>
                    <Form.Item name="status" label="Event Status" rules={[{ required: true }]}> 
                        <Select>
                            <Option value="ONGOING">ONGOING</Option>
                            <Option value="COMPLETED">COMPLETED</Option>
                        </Select>
                    </Form.Item>
                    {/* <Form.Item name="expense" label="Total Expense" rules={[{ required: true }]}> 
                        <Input />
                    </Form.Item> */}
                    <Form.Item label="Expense Category" name="category">
                        {categories.map((category) => (
                            <div key={category} style={{ marginBottom: "8px" }}>
                                <Checkbox
                                    checked={selectedCategories[category] !== undefined}  // Check if category exists in selectedCategories
                                    onChange={(e) => handleCheckboxChange(category, e.target.checked)}
                                    span style={{ color: categoryColors }}
                                    
                                >
                                    {category}
                                </Checkbox>

                                {/* Conditionally Render Amount Input */}
                                 {selectedCategories[category] !== undefined && (
                                    <Input
                                        type="number"
                                        placeholder="Enter amount"
                                        value={selectedCategories[category]} // Set initial value to the selected amount
                                        onChange={(e) => handleAmountChange(category, e.target.value)}
                                        style={{ width: "100%", marginTop: "5px" }}
                                    />
                                )}
                            </div>
                        ))}
                    </Form.Item>
                   
                    {/* CHANGE: Added automatic total calculation display to edit modal */}
                    <div style={{ marginBottom: 16 }}>
                        <strong>Total Expense: AED {calculateTotalExpense()}</strong>
                    </div>

                </Form>
            </Modal>
        </ConfigProvider>
    );
};

export default EventExpensesTable;