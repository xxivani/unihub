import React, { useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import AddExpenseButton from "../committee/budget-tracker/BudgetDashboard/AddExpense";


ChartJS.register(ArcElement, Tooltip, Legend);

const ExpenseBreakdownChart = () => {

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
        <div style={{ height: "100%", width: "100%", alignItems: "center" }}>
            <Doughnut data={data} options={options}/>
            <AddExpenseButton />
        </div>
        
    );
};

export default ExpenseBreakdownChart;



