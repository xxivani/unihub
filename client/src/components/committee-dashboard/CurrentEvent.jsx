import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import "./CurrentEvent.css";

ChartJS.register(ArcElement, Tooltip, Legend);

const CurrentEvent = () => {
    const data = {
        labels: ["Paid", "Not Paid Yet"],
        datasets: [
            {
                data: [40, 21], // Paid: 40, Not Paid: 21
                backgroundColor: ["#1f5387", "#b0bec5"],
                hoverBackgroundColor: ["#1a252f", "#90a4ae"],
                borderWidth: 0,
            },
        ],
    };

    const options = {
        cutout: "70%", 
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                enabled: true,
            },
        },
    };

    return (
        <div className="entity6-event-statistics">
            <div className="entity6-stats-info">
                <h3>Current Event</h3>
                <h4>Statistics</h4>
                <p><strong>Anticipated</strong><br /> Registrations: 80</p>
                <p><strong>Current</strong><br /> Registrations: 61</p>
                <p><strong>Students yet to pay:</strong> 21</p>
            </div>
            <div className="entity6-chart-container">
                <Doughnut data={data} options={options} />
                <div className="entity6-chart-label">
                    <p>61</p>
                    <span>Total Registrations</span>
                </div>

                <div className="entity6-chart-legend">
                    <p><strong>40</strong> Paid</p>
                    {/* <p style={{ color: "#b0bec5" }}><strong>21</strong> Not Paid Yet</p> */}
                </div>
            </div>
        </div>
    );
};

export default CurrentEvent;