import React, { useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import AddExpenseButton from "../committee/budget-tracker/BudgetDashboard/AddExpense";
ChartJS.register(ArcElement, Tooltip, Legend);

const ExpenseBreakdownChart = () => {
  const [chartData, setChartData] = useState({
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
  });

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right", // Moves the legend to the right
        align: "center",
      },
    },
  };

  // This function will be called when expenses are updated
  const handleExpenseUpdate = (updatedCategories) => {
    // Create a copy of the current chart data
    const newData = {...chartData};
    
    // Update the data values
    Object.entries(updatedCategories).forEach(([category, amount]) => {
      const index = chartData.labels.findIndex(
        label => label.toLowerCase() === category.toLowerCase()
      );
      
      if (index !== -1 && amount) {
        newData.datasets[0].data[index] = parseFloat(amount);
      }
    });
    
    // Update the chart data
    setChartData(newData);
  };

  return (
    <div style={{ height: "100%", width: "100%", alignItems: "center" }}>
      <Doughnut data={chartData} options={options}/>
      <AddExpenseButton onUpdateExpenses={handleExpenseUpdate} chartData={chartData} />
    </div>
  );
};

export default ExpenseBreakdownChart;