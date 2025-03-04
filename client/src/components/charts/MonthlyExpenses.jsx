import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";


ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const MonthlyExpensesChart = () => {
    // Dummy Data for the Chart
    const data = {
        labels: ["Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "March"],
        datasets: [
            {
                label: "Amount Spent ($)",
                data: [1200, 1900, 800, 1500, 2200, 1800, 1000], 
                backgroundColor: "#000",
                borderRadius: 10, 
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: false, 
            },
            title: {
                display: true,
                text: "Monthly Expenses for Year 2024-25", 
                font: {
                    size: 16,
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 500, 
                },
            },
        },
    };

    return (
        <div style={{ width: "100%", height: "300px" }}>
            <Bar data={data} options={options} />
        </div>
    );
};

export default MonthlyExpensesChart;