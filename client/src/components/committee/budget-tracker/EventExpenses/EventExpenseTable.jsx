import { Space, Table, Tag, Typography, Button, Form, Input, Select, Modal, Checkbox, ConfigProvider, InputNumber } from 'antd';
import Pagination from "../../../viewRO/Pagination";
import { useState, useEffect } from 'react';
import { EditOutlined, DeleteOutlined, LinkOutlined } from '@ant-design/icons';
import { Link, useLocation } from "react-router-dom";
import EventAddExpenseButton from './EventExpensesForm';
import './EventExpenses.css';
import "./EventExpensesForm.css";

const { Text } = Typography;
const { Option } = Select;

// The component now accepts events as props from the parent
const EventExpensesTable = ({ events, onEventUpdate }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 5; // Number of rows per page
    const [editingEvent, setEditingEvent] = useState(null);
    const [form] = Form.useForm();
    const [selectedCategories, setSelectedCategories] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState([]);

    // Get club_id from URL parameters for event operations
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const clubId = queryParams.get('club_id') || sessionStorage.getItem('selectedClubId');

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

    // Update local data when events prop changes
    useEffect(() => {
        if (events) {
            setData(events);
        }
    }, [events]);

    // handle delete
    const handleDelete = async (record) => {
        try {
            const response = await fetch(`${apiUrl}/bt_eventRoute/${record.id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error("Failed to delete event");
            }

            // update local state after deletion
            const updatedData = data.filter(item => item.id !== record.id);
            setData(updatedData);
            
            // Notify parent component if provided
            if (onEventUpdate) {
                onEventUpdate();
            }

            alert("Event deleted successfully!");

        } catch (error) {
            console.error("Error deleting event:", error);
            alert("Failed to delete event");
        }
    };

    const columns = [
        {
            title: "Event Name",
            dataIndex: "name",
            key: "name",
            render: (text, record) => (
                <div>
                    <a>{text}</a>
                    {record.general_event_id && (
                        <Tag color="blue" style={{ marginLeft: '8px' }}>
                            <LinkOutlined /> Linked
                        </Tag>
                    )}
                </div>
            ),
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
                    {categories && categories.map(({ name, amount }) => (
                        <Tag
                            color={categoryColors[name]}
                            key={name}
                            style={{
                                marginBottom: '4px',
                                marginRight: '4px',
                                display: 'inline-block',
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
                    <Button 
                        type="link" 
                        icon={<DeleteOutlined />} 
                        danger 
                        onClick={() => handleDelete(record)}
                        disabled={record.general_event_id}
                        title={record.general_event_id ? "Linked events can only be deleted from the main event system" : ""}
                    >
                        Delete
                    </Button>
                </Space>
            ),
        },
    ];

    const handleEdit = (record) => {
        setEditingEvent(record);
        
        // Set the form fields with the event's existing data
        form.setFieldsValue({
            name: record.name,
            date: record.date,
            status: record.status,
            description: record.description || "",
        });
    
        // Initialize selectedCategories with ONLY the categories that exist in the event
        const initialSelectedCategories = {};
        if (record.categories && record.categories.length > 0) {
            record.categories.forEach(({ name, amount }) => {
                // Ensure amount is a string for the input field
                initialSelectedCategories[name] = amount.toString();
            });
        }
        setSelectedCategories(initialSelectedCategories);
        
        console.log("Editing event with categories:", initialSelectedCategories);
    };

    const handleSave = async () => {
        form.validateFields().then(async (values) => {
          try {
            setLoading(true);
            
            // Convert selected categories to array format
            // Ensure each amount is at least 0.01 to pass backend validation
            const updatedCategories = Object.entries(selectedCategories).map(([name, amount]) => {
              const numAmount = parseFloat(amount);
              return {
                name,
                amount: isNaN(numAmount) ? 0.01 : Math.max(0.01, numAmount) // Ensure minimum of 0.01
              };
            });
            
            // Prepare update data
            const updateData = {
              name: values.name,
              date: values.date,
              status: values.status,
              description: values.description || '',
              categories: updatedCategories,
              club_id: clubId, // Make sure to include club_id in the update
              general_event_id: editingEvent.general_event_id // Preserve the link to general event
            };
            
            console.log("Updating event with data:", updateData);
            
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
            console.log("Received updated event:", updatedEvent);
            
            // Update local state with the returned data
            const updatedData = data.map((item) =>
              item.id === editingEvent.id ? updatedEvent : item
            );
            
            setData(updatedData);
            setEditingEvent(null);
            setSelectedCategories({});
            
            // Notify parent component if provided
            if (onEventUpdate) {
                onEventUpdate();
            }
            
            alert('Event updated successfully');
          } catch (error) {
            console.error('Error updating event:', error);
            alert(`Failed to update event: ${error.message}`);
          } finally {
            setLoading(false);
          }
        });
    };

    const handleCheckboxChange = (category, checked) => {
        setSelectedCategories((prev) => {
            if (checked) {
                return {
                    ...prev,
                    [category]: "", // When checked, show the input field with a minimum valid value
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

    // Calculate total expense from all selected categories
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

    const totalPages = Math.ceil(data.length / pageSize);
    const paginatedData = data.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: "#314521",
                    colorPrimaryHover: "#4a6831",
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
                <div className='category-legend' style={{ display: 'flex', alignItems: 'center' }}>
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
                <EventAddExpenseButton onAddEvent={onEventUpdate || (() => {})} />
            </div>

            {data.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                    <p>No events found for this club. Add an event to get started.</p>
                </div>
            ) : (
                <>
                    <Table 
                        columns={columns} 
                        dataSource={paginatedData} 
                        pagination={false} 
                        rowKey="id"
                        loading={loading}
                    />
                    <Pagination
                        totalPages={totalPages}
                        currentPage={currentPage}
                        onPageChange={setCurrentPage}
                    />
                </>
            )}
            
            <Modal
                title={<div className='event-expense-form-modal-title'>
                    {editingEvent?.general_event_id ? 'Edit Linked Event' : 'Edit Event'}
                </div>}
                open={!!editingEvent}
                onCancel={() => setEditingEvent(null)}
                onOk={handleSave}
                confirmLoading={loading}
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="name" label="Event Name" rules={[{ required: true }]}> 
                        <Input disabled={editingEvent?.general_event_id} />
                    </Form.Item>
                    <Form.Item name="date" label="Event Date" rules={[{ required: true }]}> 
                        <Input disabled={editingEvent?.general_event_id} />
                    </Form.Item>
                    <Form.Item name="status" label="Event Status" rules={[{ required: true }]}> 
                        <Select>
                            <Option value="ONGOING">ONGOING</Option>
                            <Option value="COMPLETED">COMPLETED</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name="description" label="Description">
                        <Input.TextArea rows={3} />
                    </Form.Item>
                    <Form.Item label="Expense Category" name="category">
                        {categories.map((category) => (
                            <div key={category} style={{ marginBottom: "8px" }}>
                                <Checkbox
                                    checked={selectedCategories[category] !== undefined}
                                    onChange={(e) => handleCheckboxChange(category, e.target.checked)}
                                >
                                    {category}
                                </Checkbox>

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
                   
                    <div style={{ marginBottom: 16 }}>
                        <strong>Total Expense: AED {calculateTotalExpense().toFixed(2)}</strong>
                    </div>

                    {editingEvent?.general_event_id && (
                        <div style={{ 
                            marginBottom: 16, 
                            color: '#1890ff',
                            padding: '10px',
                            background: isDarkTheme ? '#111d2c' : '#e6f7ff',
                            borderRadius: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}>
                            <LinkOutlined /> This event is linked to a general event. Some fields cannot be edited directly.
                        </div>
                    )}

                    {/* Hidden field for club_id */}
                    <input type="hidden" id="club_id" value={clubId} />
                </Form>
            </Modal>
        </ConfigProvider>
    );
};

export default EventExpensesTable;