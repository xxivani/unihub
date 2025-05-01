import { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import EditMonthlyChart from "../committee/budget-tracker/BudgetDashboard/EditMonthlyChart";
import axios from "axios";
import { useTheme } from "../../ThemeContext";
// import { toast } from "react-toastify"; // Optional, for notifications

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const MonthlyExpensesChart = ({ data }) => {

  // ✅ Immediately read current theme on first render
  const getInitialTheme = () => document.body.getAttribute("data-theme") || "light";
  const [theme, setTheme] = useState(getInitialTheme());
  const isDarkTheme = theme === "dark";

  useEffect(() => {
    // ✅ Watch for theme changes (e.g., via toggle)
    const observer = new MutationObserver(() => {
      const newTheme = document.body.getAttribute("data-theme");
      setTheme(newTheme);
    });

    observer.observe(document.body, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);

  // Add state to track window width
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Add resize event listener
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Clean up the event listener
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []); // Empty dependency array means this effect runs once on mount


  // Get the bar color based on the current theme
  // const getBarColor = () => isDarkTheme ? "#bfbfbf" : "#000000";
  const getBarColor = () => isDarkTheme ? "#0b3474" : "#000000";


  // Default data for the Charts
  const defaultData1 = {
    labels: ["Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Amount Spent (AED)",
        // data: [1200, 1900, 800, 1500],
        // backgroundColor: "#000",
        backgroundColor: getBarColor(),
        // borderColor: isDarkTheme ? "white" : "white",
        borderRadius: 10,
      },
    ],
  };
  
  const defaultData2 = {
    labels: ["Jan", "Feb", "March", "April", "May", "June"],
    datasets: [
      {
        label: "Amount Spent (AED)",
        // data: [1400, 1800, 1000, 1200],
        // backgroundColor: "#000",
        backgroundColor: getBarColor(),
        borderRadius: 10,
      },
    ],
  };

  // Initialize with default data
  const [data1, setChartData1] = useState(defaultData1);
  const [data2, setChartData2] = useState(defaultData2);
  const [isUpdating, setIsUpdating] = useState(false);
  const [fiscalYear, setFiscalYear] = useState("2024-25");

  // Update chart data when API data changes
  useEffect(() => {
    if (data) {
      // If we have API data, split it into two semesters
      const firstSemData = {
        labels: data.labels.slice(0, 4), // Sep, Oct, Nov, Dec
        datasets: [
          {
            label: "Amount Spent (AED)",
            data: data.data.slice(0, 4),
            // backgroundColor: "#000",
            // backgroundColor: isDarkTheme ? "white" : "white",
            borderRadius: 10,
          },
        ],
      };

      const secondSemData = {
        labels: data.labels.slice(4), // Jan, Feb, Mar, Apr
        datasets: [
          {
            label: "Amount Spent (AED)",
            data: data.data.slice(4),
            // backgroundColor: "#000",
            // backgroundColor: isDarkTheme ? "#ffffff" : "#000000",
            borderRadius: 10,
          },
        ],
      };

      setChartData1(firstSemData);
      setChartData2(secondSemData);
    }
  }, [data]);

  // Update chart colors when theme changes
  useEffect(() => {
    // Update chart1 colors
    setChartData1(prevData => ({
      ...prevData,
      datasets: prevData.datasets.map(dataset => ({
        ...dataset,
        backgroundColor: getBarColor()
      }))
    }));

    // Update chart2 colors
    setChartData2(prevData => ({
      ...prevData,
      datasets: prevData.datasets.map(dataset => ({
        ...dataset,
        backgroundColor: getBarColor()
      }))
    }));
  }, [theme]); // Re-run when theme changes


  const options1 = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Semester 1",
        position: "bottom",
        font: {
          size: 16,
        },
        color: isDarkTheme ? "#09295d" : "#000000",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 500,
          color: isDarkTheme ? "#09295d" : "#000000",
        },
        grid: {
          color: isDarkTheme ? "#0b3474" : "#00000030",
        },
      },
      x: {
        ticks: {
          color: isDarkTheme ? "#09295d" : "#000000",
        },
        grid: {
          color: isDarkTheme ? "#0b3474" : "#00000030",
        },
      },
    },
  };

  const options2 = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Semester 2",
        position: "bottom",
        font: {
          size: 16,
        },
        color: isDarkTheme ? "#09295d" : "#000000",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 500,
          color: isDarkTheme ? "#09295d" : "#000000",
        },
        grid: {
          color: isDarkTheme ? "#0b3474" : "#00000030",
        },
      },
      x: {
        ticks: {
          color: isDarkTheme ? "#09295d" : "#000000",
        },
        grid: {
          color: isDarkTheme ? "#0b3474" : "#00000030",
        },
      },
    },
  };

  // Handler for updating chart data
  const handleUpdateChartData = async (newData, semesterNumber) => {
    try {
      setIsUpdating(true);
      
      // Update local state first
      if (semesterNumber === 1) {
        setChartData1(newData);
      } else {
        setChartData2(newData);
      }

      // Find which month was updated by comparing the data
      const originalData = semesterNumber === 1 ? data1 : data2;
      const updatedIndex = newData.datasets[0].data.findIndex((value, index) => {
        return value !== originalData.datasets[0].data[index];
      });
      
      if (updatedIndex !== -1) {
        const month = newData.labels[updatedIndex];
        const amount = newData.datasets[0].data[updatedIndex];
        
        // Send update to backend
        await axios.post('/api/expense-updates/monthly', {
          month,
          amount,
          semester: semesterNumber
        });
        
        // Show success message
        if (toast) {
          toast.success(`${month} expenses updated successfully`);
        } else {
          console.log(`${month} expenses updated successfully`);
        }
      }
    } catch (error) {
      console.error('Error updating monthly expenses:', error);
      
      // Show error message
      if (toast) {
        toast.error('Failed to update monthly expenses');
      } else {
        console.error('Failed to update monthly expenses');
      }
      
      // Revert UI changes on error by refetching data
      try {
        const response = await axios.get('/api/bt_dashboard/monthly-expenses');
        if (response.data) {
          // Split the refreshed data into semesters
          const refreshedData1 = {
            labels: response.data.labels.slice(0, 4),
            datasets: [
              {
                label: "Amount Spent (AED)",
                data: response.data.data.slice(0, 4),
                backgroundColor: "#000",
                borderRadius: 10,
              },
            ],
          };
          
          const refreshedData2 = {
            labels: response.data.labels.slice(4),
            datasets: [
              {
                label: "Amount Spent (AED)",
                data: response.data.data.slice(4),
                backgroundColor: "#000",
                borderRadius: 10,
              },
            ],
          };
          
          setChartData1(refreshedData1);
          setChartData2(refreshedData2);
        }
      } catch (refreshError) {
        console.error('Error refreshing data:', refreshError);
      }
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    // <div style={{
    //   fontSize: "18px",
    //   fontWeight: "bold",
    //   marginBottom: "10px",
    //   textAlign: "center",
    //   position: "relative",
    //   color: isDarkTheme ? "#09295d" : "#000000",
    // }}>
    //   {isUpdating && <div className="updating-overlay">Updating...</div>}
    //   Year {fiscalYear}
    //   <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
    //     <div style={{ width: "48%", height: "300px" }}>
    //       <Bar data={data1} options={options1} />
    //     </div>
    //     <div style={{ width: "48%", height: "300px" }}>
    //       <Bar data={data2} options={options2} />
    //     </div>
    //   </div>
    //   {/* Add the edit button component */}
    //   <EditMonthlyChart
    //     chartData1={data1}
    //     chartData2={data2}
    //     onUpdateChartData={() => fetchDashboardData()}
    //   />
    // </div>

    <div style={{
      fontSize: "18px",
      fontWeight: "bold",
      marginBottom: "10px",
      textAlign: "center",
      position: "relative",
      color: isDarkTheme ? "#09295d" : "#000000",
    }}>
      {isUpdating && <div className="updating-overlay">Updating...</div>}
      Year {fiscalYear}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: windowWidth <= 480 ? "column" : "row"
        }}
      >
        <div
          style={{
            width: windowWidth <= 480 ? "100%" : "48%",
            height: windowWidth <= 480 ? "250px" : "300px",
            marginBottom: windowWidth <= 480 ? "20px" : "0"
          }}
        >
          <Bar data={data1} options={options1} />
        </div>
        <div
          style={{
            width: windowWidth <= 480 ? "100%" : "48%",
            height: windowWidth <= 480 ? "250px" : "300px"
          }}
        >
          <Bar data={data2} options={options2} />
        </div>
      </div>
      {/* Add the edit button component */}
      <EditMonthlyChart
        chartData1={data1}
        chartData2={data2}
        onUpdateChartData={() => fetchDashboardData()}
      />
    </div>
  );
};

export default MonthlyExpensesChart;