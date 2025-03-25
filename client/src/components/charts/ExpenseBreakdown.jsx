import React, { useState, useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import AddExpenseButton from "../committee/budget-tracker/BudgetDashboard/AddExpense";

ChartJS.register(ArcElement, Tooltip, Legend);

const ExpenseBreakdownChart = ({ data }) => {

  // Get current theme
  const getInitialTheme = () => document.body.getAttribute("data-theme") || "light";
  const [theme, setTheme] = useState(getInitialTheme());
  const isDarkTheme = theme === "dark";

  // Watch for theme changes
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const newTheme = document.body.getAttribute("data-theme");
      setTheme(newTheme);
    });

    observer.observe(document.body, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);

  // Define color palettes for light and dark modes
  // const lightModeColors = [
  //   '#2d4526', // Catering - Dark green
  //   '#1C2833', // Materials - Dark blue/gray
  //   '#6b6969', // Prize - Medium gray
  //   '#d98248', // Transportation - Orange
  //   '#8C5E3C', // Venue - Brown
  // ];

  // const darkModeColors = [
  //   '#88b663', // Catering - Lighter green
  //   '#4a7aaa', // Materials - Light blue
  //   '#b5b5b5', // Prize - Light gray
  //   '#ffa166', // Transportation - Light orange
  //   '#d4a373', // Venue - Light brown
  // ];

  // Function to get current color palette based on theme
  // const getColors = () => isDarkTheme ? darkModeColors : lightModeColors;



  // Default chart data
  const defaultChartData = {
    labels: ['Catering', 'Materials', 'Prize', 'Transportation', 'Venue'],
    datasets: [
      {
        label: 'Amount Spent',
        data: [600, 400, 250, 300, 450],
        backgroundColor: [
          '#2d4526',
          '#1C2833',
          '#6b6969',
          '#d98248',
          '#8C5E3C',
        ],

        // backgroundColor: getColors(),

        // borderColor: [
        //   'grey',
        // ],
        borderColor: isDarkTheme? "#000" : "grey",

        borderWidth: 1,

      },
    ],
  };
  
  // Initialize with either passed data or default
  const [chartData, setChartData] = useState(defaultChartData);

  // Update chart data when props change
  useEffect(() => {
    if (data) {
      setChartData({
        labels: data.labels,
        datasets: [
          {
            label: 'Amount Spent',
            data: data.data,
            backgroundColor: data.colors || [
              '#2d4526',
              '#1C2833',
              '#6b6969',
              '#d98248',
              '#8C5E3C',
            ],

            // backgroundColor: getColors(),

            // borderColor: ['grey'],
            borderColor: isDarkTheme? "#000" : "grey",
            borderWidth: 1,
          },
        ],
      });
    }
  }, [data]);

  // Update colors when theme changes
  useEffect(() => {
    setChartData(prevData => ({
      ...prevData,
      datasets: prevData.datasets.map(dataset => ({
        ...dataset,
        // backgroundColor: getColors(),
        // borderColor: "grey",
        borderColor: isDarkTheme? "#000" : "grey",
      }))
    }));
  }, [theme]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
        align: "center",
      },
    },
  };

  // This function is simplified to only update local state
  // The actual API call will be handled by AddExpenseButton
  const handleExpenseUpdate = (updatedCategories) => {
    if (!updatedCategories) {
      return;
    }
    
    // Update local state for immediate UI feedback
    const newData = {...chartData};
    
    Object.entries(updatedCategories).forEach(([category, amount]) => {
      const index = chartData.labels.findIndex(
        label => label.toLowerCase() === category.toLowerCase()
      );
      
      if (index !== -1 && amount) {
        newData.datasets[0].data[index] = parseFloat(amount);
      }
    });
    
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