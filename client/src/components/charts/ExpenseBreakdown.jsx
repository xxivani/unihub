import React, { useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Button, Modal, Form, Input, InputNumber } from "antd";
import { FaPlus } from "react-icons/fa";



ChartJS.register(ArcElement, Tooltip, Legend);

const ExpenseBreakdownChart = () => {

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        form.validateFields()
            .then(values => {
                console.log("New Expense:", values);
                setIsModalVisible(false);
                form.resetFields();
            })
            .catch(errorInfo => {
                console.log("Validation Failed:", errorInfo);
            });
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };


    const data = {
        labels: ['Catering', 'Materials', 'Prize', 'Transportation', 'Venue'],
        datasets: [
            {
                label: 'Amount Spent',
                data: [600, 400, 250, 300, 450],
                backgroundColor: [
                    '#bdd6a8',
                    '#a3c686',
                    '#88b663',
                    '#6f9c49',
                    '#567939',
                ],
                borderColor: [
                    'grey',
                ],
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            
            legend: {
                position: "right",  // Moves the legend to the right
                align: "center",
                
            },
        },
        
    };

    return (
        <div style={{ height: "100%", width: "100%" }}>
            <Doughnut data={data} options={options}/>
        </div>
        
    );
};

export default ExpenseBreakdownChart;



