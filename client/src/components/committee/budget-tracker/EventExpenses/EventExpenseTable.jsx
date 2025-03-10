import { Space, Table, Tag, Typography, Button, Form, Input, Select, Modal, Checkbox, ConfigProvider } from 'antd';
import Pagination from "../../../viewRO/Pagination";
import { useState } from 'react';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Link } from "react-router-dom";



const { Text } = Typography;
const { Option } = Select;


const EventExpensesTable = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 5; // Number of rows per page
    const [editingEvent, setEditingEvent] = useState(null);
    const [form] = Form.useForm();
    const [selectedCategories, setSelectedCategories] = useState({});
    


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

    const handleSave = () => {
        form.validateFields().then((values) => {
            // Convert selectedCategories object to the array format used in data
            const updatedCategories = Object.entries(selectedCategories).map(([name, amount]) => ({
                name: name,
                amount: amount
            }));
            
            // Calculate the new total expense
            const totalExpense = updatedCategories.reduce((sum, { amount }) => sum + Number(amount), 0);
            
            // Update the data with the new values including categories
            const updatedData = data.map((item) =>
                item.key === editingEvent.key 
                    ? { 
                        ...item, 
                        ...values,
                        categories: updatedCategories,
                    } 
                    : item
            );
            
            setData(updatedData);
            setEditingEvent(null);
            setSelectedCategories({});
        });
    };

    // const handleDelete = (record) => {
    //     Modal.confirm({
    //         title: 'Confirm Deletion',
    //         content: `Are you sure you want to delete ${record.name}?`,
    //         okText: 'Yes, Delete',
    //         okType: 'danger',
    //         cancelText: 'Cancel',
    //         onOk() {
    //             const updatedData = data.filter(item => item.key !== record.key);
    //             setData(updatedData);
    //             console.log("Deleted event expense:", record);
    //         },
    //     });
    // };
    const handleDelete = (record) => {
        // Filter out the record with the matching key
        const updatedData = data.filter(item => item.key !== record.key);
        setData(updatedData);
        
        // Optional: Add confirmation or notification here
        console.log("Deleted event expense:", record);
    };
    


    const categories = ["catering", "materials", "prize", "venue", "transportation"];

    const categoryColors = {
        catering: "blue",
        materials: "green",
        prize: "gold",
        venue: "purple",
        transportation: "red",
    };

    const [data, setData] = useState([
        {
            key: '1',
            name: 'Event 1',
            date: '02/11/2025',
            status: 'ONGOING',
            expense: 'AED 400',
            // categories: ['catering', 'venue', 'prize', 'materials', 'transportation'],
            categories: [
                { name: 'catering', amount: 1500 },
                { name: 'venue', amount: 3500 },
            ],
        },
        {
            key: '2',
            name: 'Event 2',
            date: '15/03/2025',
            status: 'COMPLETED',
            expense: 'AED 6200',
            categories: [
                { name: 'materials', amount: 2200 },
                { name: 'prize', amount: 1800 },
                { name: 'transportation', amount: 2200 },
            ],
        },
        {
            key: '3',
            name: 'Event 3',
            date: '28/07/2025',
            status: 'ONGOING',
            expense: 'AED 5300',
            categories: [
                { name: 'catering', amount: 2000 },
                { name: 'transportation', amount: 1700 },
                { name: 'venue', amount: 1600 },
            ],
        },
        {
            key: '4',
            name: 'Event 4',
            date: '10/10/2025',
            status: 'COMPLETED',
            expense: 'AED 7500',
            categories: [
                { name: 'prize', amount: 3000 },
                { name: 'materials', amount: 2500 },
                { name: 'venue', amount: 2000 },
                { name: 'transportation', amount: 1700 },
                { name: 'catering', amount: 2000 },
            ],
        },
        {
            key: '5',
            name: 'Event 5',
            date: '05/12/2025',
            status: 'ONGOING',
            expense: 'AED 2800',
            categories: [
                { name: 'catering', amount: 1000 },
                { name: 'materials', amount: 800 },
                { name: 'transportation', amount: 1000 },
            ],
        },
        {
            key: '6',
            name: 'Event 6',
            date: '20/08/2025',
            status: 'COMPLETED',
            expense: 'AED 4100',
            categories: [
                { name: 'venue', amount: 1800 },
                { name: 'prize', amount: 1200 },
                { name: 'catering', amount: 1100 },
            ],
        },
        {
            key: '7',
            name: 'Event 7',
            date: '12/01/2026',
            status: 'ONGOING',
            expense: 'AED 3300',
            categories: [
                { name: 'materials', amount: 1200 },
                { name: 'catering', amount: 1100 },
                { name: 'prize', amount: 1000 },
            ],
        },
        {
            key: '8',
            name: 'Event 8',
            date: '22/04/2026',
            status: 'COMPLETED',
            expense: 'AED 5400',
            categories: [
                { name: 'venue', amount: 2500 },
                { name: 'transportation', amount: 1700 },
                { name: 'prize', amount: 1200 },
            ],
        },
        {
            key: '9',
            name: 'Event 9',
            date: '09/06/2026',
            status: 'ONGOING',
            expense: 'AED 4900',
            categories: [
                { name: 'catering', amount: 2000 },
                { name: 'venue', amount: 1500 },
                { name: 'materials', amount: 1400 },
            ],
        },
        {
            key: '10',
            name: 'Event 10',
            date: '30/09/2026',
            status: 'COMPLETED',
            expense: 'AED 7100',
            categories: [
                { name: 'prize', amount: 3200 },
                { name: 'catering', amount: 1900 },
                { name: 'transportation', amount: 2000 },
            ],
        },
        {
            key: '11',
            name: 'Event 11',
            date: '18/12/2026',
            status: 'ONGOING',
            expense: 'AED 5800',
            categories: [
                { name: 'venue', amount: 2600 },
                { name: 'materials', amount: 1700 },
                { name: 'catering', amount: 1500 },
            ],
        },
    ]);
    const totalPages = Math.ceil(data.length / pageSize);
    const paginatedData = data.slice((currentPage - 1) * pageSize, currentPage * pageSize);

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

    return (

        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: "#314521", // Change primary button color (Green)
                    colorPrimaryHover: "#314521"
                },
            }}
        >            
            <div style={{ marginBottom: 16, marginLeft: "10px", justifyContent: "space-between" }}>
                <Text strong>Category Legend: </Text>
                <Space size="small">
                    {Object.entries(categoryColors).map(([category, color]) => (
                        <Tag color={color} key={category}>
                            {category.toUpperCase()}
                        </Tag>
                    ))}
                </Space>
            </div>
            <Table columns={columns} dataSource={paginatedData} pagination={false} />
            <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
            />
            <Modal
                title="Edit Event Expense"
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

                </Form>
            </Modal>
        </ConfigProvider>
    );
};

export default EventExpensesTable;