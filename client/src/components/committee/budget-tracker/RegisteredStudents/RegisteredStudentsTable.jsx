import { Space, Table, Typography, Button, Form, Input, Select, Modal, ConfigProvider } from 'antd';
import Pagination from "../../../viewRO/Pagination";
import { useState } from 'react';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';



const { Option } = Select;


const RegisteredStudentsTable = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 6; // Number of rows per page
    const [editingDetails, setEditingDetails] = useState(null);
    const [form] = Form.useForm();

    const columns = [
        {
            title: "Student Name",
            dataIndex: "name",
            key: "name",
            // width: 250,
            render: (text) => <a>{text}</a>,

        },
        {
            title: "Student Email",
            dataIndex: "email",
            key: "email",
        },
        {
            title: "Phone No.",
            dataIndex: "phone",
            key: "phone",
        },
        {
            title: "Payment Status",
            dataIndex: "status",
            key: "status",

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
        
    ];

    const handleEdit = (record) => {
        setEditingDetails(record);
        form.setFieldsValue(record);
        // form.setFieldValue({
        //     name: record.name,
        //     email: record.email,
        //     phone: record.phone,
        //     status: record.status,
        // });
    };
    const handleSave = () => {
        form.validateFields().then((values) => {
            // Update the data with the new values
            const updatedData = data.map((item) =>
                item.key === editingDetails.key ? { ...item, ...values } : item
            );
            setData(updatedData); // Set the updated data in the state
            setEditingDetails(null); // Close the modal

        });
    };
    

    const handleDelete = (record) => {
        // Filter out the record with the matching key
        const updatedData = data.filter(item => item.key !== record.key);
        setData(updatedData);

        // Optional: Add confirmation or notification here
        console.log("Deleted event expense:", record);    
    };
    

    const [data, setData] = useState([
        {
            key: 1,
            name: "Student 1",
            email: "student123@student.bham.ac.uk",
            phone: "012345678",
            status: "PAID",
        },
        {
            key: 2,
            name: "Student 2",
            email: "student123@student.bham.ac.uk",
            phone: "012345679",
            status: "UNPAID",
        },
        {
            key: 3,
            name: "Student 3",
            email: "student123@student.bham.ac.uk",
            phone: "012345680",
            status: "PAID",
        },
        {
            key: 4,
            name: "Student 4",
            email: "student123@student.bham.ac.uk",
            phone: "012345681",
            status: "PAID",
        },
        {
            key: 5,
            name: "Student 5",
            email: "student123@student.bham.ac.uk",
            phone: "012345682",
            status: "UNPAID",
        },
        {
            key: 6,
            name: "Student 6",
            email: "student123@student.bham.ac.uk",
            phone: "012345683",
            status: "PAID",
        },
        {
            key: 7,
            name: "Student 7",
            email: "student123@student.bham.ac.uk",
            phone: "012345684",
            status: "PAID",
        },
        {
            key: 8,
            name: "Student 8",
            email: "student123@student.bham.ac.uk",
            phone: "012345685",
            status: "UNPAID",
        },
        {
            key: 9,
            name: "Student 9",
            email: "student123@student.bham.ac.uk",
            phone: "012345686",
            status: "PAID",
        },
        {
            key: 10,
            name: "Student 10",
            email: "student123@student.bham.ac.uk",
            phone: "012345687",
            status: "UNPAID",
        },
        {
            key: 11,
            name: "Student 11",
            email: "student123@student.bham.ac.uk",
            phone: "012345688",
            status: "PAID",
        },
    ]);
    const totalPages = Math.ceil(data.length / pageSize);
    const paginatedData = data.slice((currentPage - 1) * pageSize, currentPage * pageSize);


    return (

        <ConfigProvider
        
            theme={{
                token: {
                    colorPrimary: '#314521', // Primary color for buttons
                    colorPrimaryHover: '#314521', // Hover color for buttons
                    colorBgButton: '#314521', // Background color for buttons (e.g. OK button)
                }
            }}
        
        >
            
            <Table columns={columns} dataSource={paginatedData} pagination={false} />
            <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
            />
            <Modal
                title="Edit Student Details"
                open={!!editingDetails}
                onCancel={() => setEditingDetails(null)}
                onOk={handleSave}
                // okButtonProps={{
                //     style: {
                //         backgroundColor: '#314521', // Custom background color (Green)
                //         borderColor: '#314521', // Custom border color
                //         color: '#fff', // Text color (white)
                //     },
                // }}
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="name" label="Student Name" rules={[{ required: true }]}> 
                        <Input />
                    </Form.Item>
                    <Form.Item name="email" label="Student Email" rules={[{ required: true }]}> 
                        <Input />
                    </Form.Item>
                    <Form.Item name="phone" label="Phone No." rules={[{ required: true }]}> 
                        <Input />
                    </Form.Item>
                    <Form.Item name="status" label="Payment Status" rules={[{ required: true }]}> 
                        <Select>
                            <Option value="PAID">PAID</Option>
                            <Option value="UNPAID">UNPAID</Option>
                        </Select>
                    </Form.Item>
                    
                </Form>
            </Modal>
        </ConfigProvider>
    );
};

export default RegisteredStudentsTable;