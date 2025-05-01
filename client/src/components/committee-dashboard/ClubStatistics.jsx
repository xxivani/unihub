import "./ClubStatistics.css";
import { FiArrowRight } from "react-icons/fi";
import { useNavigate, useLocation } from "react-router-dom";
import { Bar, Doughnut } from "react-chartjs-2";
import { useEffect, useState, useCallback } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const ClubStatistics = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statsData, setStatsData] = useState(null);
  const [selectedClubId, setSelectedClubId] = useState(null);
  
  // Add state to track window width
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
    // Add resize event listener with debounce
    useEffect(() => {
      // Debounce function to limit how often the resize handler is called
      const debounce = (func, delay) => {
        let timeoutId;
        return (...args) => {
          if (timeoutId) {
            clearTimeout(timeoutId);
          }
          timeoutId = setTimeout(() => {
            func(...args);
          }, delay);
        };
      };
  
      // Resize handler with debounce
      const handleResize = debounce(() => {
        setWindowWidth(window.innerWidth);
      }); // 100ms delay
  
      // Add event listener
      window.addEventListener('resize', handleResize);
  
      // Also trigger on orientation change for mobile devices
      window.addEventListener('orientationchange', handleResize);
  
      // Clean up the event listeners
      return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('orientationchange', handleResize);
      };
    }, []); // Empty dependency array means this effect runs once on mount

  // Theme handling
  const getInitialTheme = () => document.body.getAttribute("data-theme") || "light";
  const [theme, setTheme] = useState(getInitialTheme());
  const isDarkTheme = theme === "dark";

  // API URL
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Track theme changes
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const newTheme = document.body.getAttribute("data-theme");
      setTheme(newTheme);
    });

    observer.observe(document.body, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);

  // Get the current club ID from URL or sessionStorage
  const getCurrentClubId = useCallback(() => {
    const queryParams = new URLSearchParams(location.search);
    const urlClubId = queryParams.get('club_id');
    const storedClubId = sessionStorage.getItem("selectedClubId");
    return urlClubId || storedClubId || "1"; // Default to club 1 if none found
  }, [location.search]);

  // Listen for changes to selectedClubId in storage
  useEffect(() => {
    const handleStorageChange = () => {
      const newClubId = sessionStorage.getItem("selectedClubId");
      if (newClubId && newClubId !== selectedClubId) {
        setSelectedClubId(newClubId);
      }
    };

    // Listen for storage events
    window.addEventListener('storage', handleStorageChange);

    // Also check for changes every 1 second (as a fallback)
    const intervalId = setInterval(() => {
      const currentClubId = getCurrentClubId();
      if (currentClubId !== selectedClubId) {
        setSelectedClubId(currentClubId);
      }
    }, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(intervalId);
    };
  }, [getCurrentClubId, selectedClubId]);

  // Set initial club ID and listen for URL changes
  useEffect(() => {
    const clubId = getCurrentClubId();
    setSelectedClubId(clubId);
  }, [getCurrentClubId, location.search]);

  // Fetch club budget statistics when selectedClubId changes
  useEffect(() => {
    const fetchClubStats = async () => {
      if (!selectedClubId) return;

      try {
        setLoading(true);

        // Make API request with the current club ID
        const response = await fetch(`${apiUrl}/club-stats/budget?club_id=${selectedClubId}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch club stats: ${response.status}`);
        }

        const data = await response.json();
        console.log(`Loaded stats for club ${selectedClubId}:`, data);
        setStatsData(data);
        setError(null);
      } catch (err) {
        console.error(`Error fetching club statistics for club ${selectedClubId}:`, err);
        setError("Failed to load club statistics");
      } finally {
        setLoading(false);
      }
    };

    fetchClubStats();
  }, [apiUrl, selectedClubId]);

  // Prepare chart data
  const barChartData = {
    labels: statsData?.recentExpenses?.labels || ["Sep", "Oct", "Nov"],
    datasets: [
      {
        label: "Amount Spent (AED)",
        data: statsData?.recentExpenses?.data || [0, 0, 0],
        backgroundColor: "#0D2535",
        borderRadius: 10,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 500,
          color: isDarkTheme ? "#ffffff" : "#000000",
        },
        grid: {
          color: isDarkTheme ? "#ffffff30" : "#00000030",
        },
      },
      x: {
        ticks: {
          color: isDarkTheme ? "#ffffff" : "#000000",
        },
        grid: {
          color: isDarkTheme ? "#ffffff30" : "#00000030",
        },
      },
    },
  };

  // Prepare doughnut chart data
  const totalBudget = statsData?.budgetSummary?.totalBudget || 0;
  const totalSpent = statsData?.budgetSummary?.totalSpent || 0;
  const remaining = statsData?.budgetSummary?.remaining || 0;

  const doughnutChartData = {
    labels: ["Remaining Budget", "Total Budget"],
    datasets: [
      {
        label: "Amount",
        data: [totalSpent, remaining],
        backgroundColor: ["#0f2b3e", "#67869c"], // original colors
        borderColor: ["#0f2b3e"],
        borderWidth: 1,
      },
    ],
  };

  const doughnutChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "65%",
    plugins: {
      legend: {
        position: windowWidth <= 480 ? "bottom" : "right",
        align: "start",
        labels: {
          color: isDarkTheme ? "#ffffff" : "#000000",
          boxWidth: 15,
          padding: windowWidth <= 480 ? 10 : 5,
          font: {
            size: windowWidth <= 480 ? 12 : 10
          }
        },
        // Ensure text doesn't overflow
        fullWidth: false,
        maxWidth: windowWidth <= 480 ? undefined : 150
      },
    },
  };

  if (loading) {
    return (
      <div className="entity6-cs">
        <div className="entity6-cs-header">
          <h3>Club Statistics</h3>
        </div>
      </div>
    );
  }

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
          <Bar key={`${theme}-${selectedClubId}-bar`} data={barChartData} options={barChartOptions} />
        </div>
        <div className="doughnut-chart">
          <Doughnut key={`${theme}-${selectedClubId}-doughnut`} data={doughnutChartData} options={doughnutChartOptions} />
          <div className="entity6-doughnut-chart-label">
            <p>{totalSpent.toLocaleString()}</p>
            <span>Budget Spent</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClubStatistics;