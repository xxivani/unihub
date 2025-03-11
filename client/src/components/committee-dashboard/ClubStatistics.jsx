import "./ClubStatistics.css";
import { FiArrowRight } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);


const ClubStatistics = () => {
    const navigate = useNavigate();

    const data1= {
        labels: ["Sep", "Oct", "Nov"],
        datasets: [
            {
                label: "Amount Spent (AED)",
                data: [1200, 1900, 800], 
                backgroundColor: "#0D2535",
                borderRadius: 10, 
            },
        ],
    };
    const data2 = {
        labels: ['Total Budget', 'Remaining Budget'],
        datasets: [
            {
                label: 'Amount Spent',
                data: [2500, 1400],
                backgroundColor: [
                    '#0f2b3e',
                    '#67869c',
                ],
                borderColor: [
                    '#0f2b3e',
                ],
                borderWidth: 1,
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
                // text: "Semester 1", 
                // position: "bottom",
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
        cutout: "65%", 
        plugins: {
            
            legend: {
                position: "bottom",  // Moves the legend to the right
                align: "start",
                
            },
        },
        
    };

    return (
        <div className="entity6-cs">
            <div className="entity6-cs-header">
                <h3>Club Statistics</h3>
                
                <button className="entity6-arrow-btn" onClick={() => navigate("/committee/budget-tracker")}>
                    <FiArrowRight size={24} />
                </button>
            </div>
            <h5>Engagement over the last 3 months</h5>
            <div className="charts-container">
                <div className="bar-chart">
                    <Bar data={data1} options={options1} />
                </div>
                <div className="doughnut-chart">
                    <Doughnut data={data2} options={options2}/>
                    <div className="entity6-doughnut-chart-label">
                        <p>1100</p>
                        <span>Budget Spent</span>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default ClubStatistics;