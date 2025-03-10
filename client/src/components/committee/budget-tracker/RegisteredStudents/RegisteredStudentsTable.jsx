import { Space, Table, Typography, Button } from 'antd';
import Pagination from "../../../viewRO/Pagination";
import { useState } from 'react';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';



const { Text } = Typography;


const RegisteredStudentsTable = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 6; // Number of rows per page


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
            console.log("Edit event expense:", record);
    };

    const handleDelete = (record) => {
        console.log("Delete event expense:", record);
    };
    

    const data = [
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
    ];
    const totalPages = Math.ceil(data.length / pageSize);
    const paginatedData = data.slice((currentPage - 1) * pageSize, currentPage * pageSize);


    return (

        <>
            
            <Table columns={columns} dataSource={paginatedData} pagination={false} />
            <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
            />
        </>
    );
};

export default RegisteredStudentsTable;