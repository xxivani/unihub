import { Space, Table, Tag, Typography, Button } from 'antd';
import Pagination from "../../../viewRO/Pagination";
import { useState } from 'react';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Link } from "react-router-dom";



const { Text } = Typography;


const EventExpensesTable = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 5; // Number of rows per page


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
                    <Link to="/committee/budget-tracker/registered-students" style={{color: "black"}}>View Registered Students</Link>
                </Space>
            ),
        },
    ];

    const handleEdit = (record) => {
            console.log("Edit event expense:", record);
    };

    const handleDelete = (record) => {
        console.log("Delete event expense:", record);
    };
    
    const handleViewStudents = (record) => {
        console.log("View Registered Students", record);
    };



    const categoryColors = {
        catering: "blue",
        materials: "green",
        prize: "gold",
        venue: "purple",
        transportation: "red",
    };

    const data = [
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
    ];
    const totalPages = Math.ceil(data.length / pageSize);
    const paginatedData = data.slice((currentPage - 1) * pageSize, currentPage * pageSize);


    return (

        <>
            {/* <div> */}
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
            {/* </div> */}
            <Table columns={columns} dataSource={paginatedData} pagination={false} />
            <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
            />
        </>
    );
};

export default EventExpensesTable;