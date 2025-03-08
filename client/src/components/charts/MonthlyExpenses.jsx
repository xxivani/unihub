import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const MonthlyExpensesChart = () => {
    // Dummy Data for the Chart
    const data1 = {
        labels: ["Sep", "Oct", "Nov", "Dec"],
        datasets: [
            {
                label: "Amount Spent (AED)",
                data: [1200, 1900, 800, 1500], 
                backgroundColor: "#000",
                borderRadius: 10, 
            },
        ],
    };
    const data2 = {
        labels: ["Jan", "Feb", "March", "April"],
        datasets: [
            {
                label: "Amount Spent (AED)",
                data: [1400, 1800, 1000, 1200], 
                backgroundColor: "#000",
                borderRadius: 10, 
            },
        ],
    };

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
        <div style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "10px", textAlign: "center" }}>
            Year 2024-25

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        
                <div style={{ width: "48%", height: "300px" }}>
                    <Bar data={data1} options={options1} />
                </div>
                <div style={{ width: "48%", height: "300px" }}>
                    <Bar data={data2} options={options2} />
                </div>
            </div>
        </div>

    );
};

export default MonthlyExpensesChart;