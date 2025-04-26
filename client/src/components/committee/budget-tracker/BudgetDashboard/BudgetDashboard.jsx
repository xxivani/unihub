import { useState, useEffect } from "react";
import "./BudgetDashboard.css";
import "../../../charts/MonthlyExpenses";
import MonthlyExpensesChart from "../../../charts/MonthlyExpenses";
import { FaMoneyBillWave, FaPlus, FaEdit } from "react-icons/fa";
import LatestEventsList from "./LatestEventsList";
import ExpenseBreakdownChart from "../../../charts/ExpenseBreakdown";
import BTCommitteeMembers from "../../budget-tracker/BudgetDashboard/BTCommitteeMembers";
import AddExpenseButton from "./AddExpense";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../../../committee-dashboard/Sidebar";
import { Modal, Form, Input, Button, message } from "antd";

const BudgetDashboard = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditingBudget, setIsEditingBudget] = useState(false);
    const [budgetForm] = Form.useForm();

    const [clubs, setClubs] = useState([]);
    const [selectedClubId, setSelectedClubId] = useState(null);
    const [userRole, setUserRole] = useState("");

    // Get club_id from URL parameters
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const urlClubId = queryParams.get('club_id');

    // Fetch dashboard data
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            // const response = await fetch(`${apiUrl}/bt_dashboardRoute`);

            const url = selectedClubId ? 
            `${apiUrl}/bt_dashboardRoute?club_id=${selectedClubId}` : 
            `${apiUrl}/bt_dashboardRoute`;
            
            //debug
            console.log("Dashboard fetch URL:", url);

            const response = await fetch(url);  
            //debug
            console.log("Dashboard response status:", response.status);

            
            if (!response.ok) {
                throw new Error('Failed to fetch dashboard data');
            }
            
            const data = await response.json();
            //debug
            console.log("Dashboard data received:", data);

            setDashboardData(data);
            setError(null);
        } catch (err) {
            console.error('Error fetching dashboard data:', err);
            setError('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    //function to fetch clubs
    const fetchClubs = async () => {
        try {
            const res = await fetch(`${apiUrl}/api/clubs`);
            //debug
            console.log("Clubs fetch URL:", `${apiUrl}/api/clubs`);

            if (!res.ok) {
                throw new Error(`Failed to fetch clubs: ${res.status}`);
            }

            const data = await res.json();
            console.log("Clubs fetched:", data);

            setClubs(data);
            

            return data;

        } catch (err) {
            console.error("Failed to fetch clubs:", err);
        }
    };
    //fallback for when clubs cant be fetched
    useEffect(() => {
        //check for user role and fetch appropriate clubs
        const user = JSON.parse(sessionStorage.getItem("user"));
        if (user && user.id) {
            console.log("User found:", user);
            setUserRole(user.role);
            
            if (user.role === "admin") {
                fetchClubs().catch(() => {
                    // Fallback - fetch dashboard without club filtering
                    fetchDashboardData();
                });
            } else {
                fetchCommitteeClub(user.id).catch(() => {
                    // Fallback - fetch dashboard without club filtering
                    fetchDashboardData();
                });
            }
        } else {
            console.log("No user found, fetching dashboard data without club filtering");
            fetchDashboardData();
        }
    }, []);

    const fetchCommitteeClub = async (userId) => {
        try {
            const res = await fetch(`${apiUrl}/committee-members/by-user/${userId}`);
            if (!res.ok) {
                throw new Error(`Failed to fetch committee member's club: ${res.status}`);
            }

            const data = await res.json();
            console.log("Committee member's club:", data);

            if (data && data.club_id) {
                return data.club_id;
            }
            return null;

            // setSelectedClubId(data.club_id);
        } catch (err) {
            console.error("Failed to fetch committee member's club_id:", err);
        }
    };
    
    // Fetch data when component mounts
    useEffect(() => {
        //check for user role and fetch appropriate clubs
        const user = JSON.parse(sessionStorage.getItem("user"));
        if (user && user.id) {
            console.log("User found:", user);
            setUserRole(user.role);
            
            if (user.role === "admin") {
                fetchClubs();
            } else {
                fetchCommitteeClub(user.id);
            }
        } else {
            console.log("No user found, fetching dashboard data without club filtering");
            fetchDashboardData();
        }
    }, []);

    // Initialize club selection on component mount
    useEffect(() => {
        const initializeClubSelection = async () => {
            try {
                // Get user info from session storage
                const user = JSON.parse(sessionStorage.getItem("user"));
                if (user && user.id) {
                    console.log("User found:", user);
                    setUserRole(user.role);
                    
                    // Handle club selection based on user role
                    if (user.role === "admin") {
                        // For admin, fetch all clubs
                        const clubsData = await fetchClubs();
                        
                        // Determine which club ID to use (priority: URL > session > first club)
                        if (urlClubId) {
                            // URL parameter has highest priority
                            setSelectedClubId(urlClubId);
                            sessionStorage.setItem("selectedClubId", urlClubId);
                        } else {
                            // Fall back to session storage or first club
                            const storedClubId = sessionStorage.getItem("selectedClubId");
                            if (storedClubId) {
                                setSelectedClubId(storedClubId);
                            } else if (clubsData && clubsData.length > 0) {
                                setSelectedClubId(clubsData[0].club_id);
                                sessionStorage.setItem("selectedClubId", clubsData[0].club_id);
                            }
                        }
                    } else {
                        // For committee members, get their specific club
                        const committeeClubId = await fetchCommitteeClub(user.id);
                        if (committeeClubId) {
                            setSelectedClubId(committeeClubId);
                            sessionStorage.setItem("selectedClubId", committeeClubId);
                        }
                    }
                } else {
                    console.log("No user found, using URL parameter or falling back to all clubs");
                    if (urlClubId) {
                        setSelectedClubId(urlClubId);
                        sessionStorage.setItem("selectedClubId", urlClubId);
                    }
                }
            } catch (error) {
                console.error("Error initializing club selection:", error);
            }
        };
        
        initializeClubSelection();
    }, [urlClubId]); // Depend on urlClubId to re-run when the URL changes


    // Fetch dashboard data when selectedClubId changes
    // useEffect(() => {
    //     if (selectedClubId) {
    //         console.log("Selected club ID changed to:", selectedClubId);
    //         fetchDashboardData();
    //     }
    // }, [selectedClubId]);

    useEffect(() => {
        if (selectedClubId) {
            console.log("Selected club ID changed to:", selectedClubId);
            
            // Update URL with club_id without reloading page
            const newParams = new URLSearchParams(location.search);
            newParams.set('club_id', selectedClubId);
            navigate({
                pathname: location.pathname,
                search: newParams.toString()
            }, { replace: true });
            
            fetchDashboardData();
        }
    }, [selectedClubId]);



    // Handle budget edit
    const handleEditBudget = () => {
        if (dashboardData?.budgetSummary) {
            budgetForm.setFieldsValue({
                totalAmount: dashboardData.budgetSummary.totalBudget
            });
        }
        setIsEditingBudget(true);
    };

    // Handle budget update
    const handleUpdateBudget = async (values) => {
        try {
            setLoading(true);
            const response = await fetch(`${apiUrl}/update_expRoute/budget`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    totalAmount: parseFloat(values.totalAmount),
                    club_id: selectedClubId // Add the clubId to the request

                })
            });
            
            if (!response.ok) {
                throw new Error('Failed to update budget');
            }
            
            await fetchDashboardData(); // Refresh dashboard data
            alert('Budget updated successfully');
            setIsEditingBudget(false);
        } catch (error) {
            console.error('Error updating budget:', error);
            alert('Failed to update budget');
        } finally {
            setLoading(false);
        }
    };

    // Add these state variables
    const [isEditingSpent, setIsEditingSpent] = useState(false);
    const [spentForm] = Form.useForm();

    // Add this handler function
    const handleEditSpent = () => {
        if (dashboardData?.budgetSummary) {
            spentForm.setFieldsValue({
                totalSpent: dashboardData.budgetSummary.totalSpent
            });
        }
        setIsEditingSpent(true);
    };

    // Add this update handler
    const handleUpdateSpent = async (values) => {
        try {
            setLoading(true);
            const response = await fetch(`${apiUrl}/update_expRoute/spent`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    totalSpent: parseFloat(values.totalSpent),
                    club_id: selectedClubId
                })
            });
            
            if (!response.ok) {
                throw new Error('Failed to update spent amount');
            }
            
            await fetchDashboardData(); // Refresh dashboard data
            alert('Spent amount updated successfully');
            setIsEditingSpent(false);
        } catch (error) {
            console.error('Error updating spent amount:', error);
            alert('Failed to update spent amount');
        } finally {
            setLoading(false);
        }
    };

    // Display loading state
    if (loading) {
        return (
            <div className="budget-dashboard">
                <div className="budget-dashboard-sidebar">
                    <Sidebar />
                </div>
                <div className="main-budget-dash">
                    <p>Loading dashboard data...</p>
                </div>
            </div>
        );
    }

    // Display error state
    if (error) {
        return (
            <div className="budget-dashboard">
                <div className="budget-dashboard-sidebar">
                    <Sidebar />
                </div>
                <div className="main-budget-dash">
                    <p className="error-message">{error}</p>
                </div>
            </div>
        );
    }

    // Default budget values if no data
    const budgetSummary = dashboardData?.budgetSummary || {
        totalBudget: 2000,
        // totalSpent: 600,
        // remaining: 400,
        fiscalYear: '2024-2025'
    };

    



    return (
        <div className="budget-dashboard">
            <div className="budget-dashboard-sidebar">
                <Sidebar />
            </div>

            <div className="main-budget-dash">
                <div className="budget">
                    <div className="budget-dashboard-title">
                        <h2>Dashboard</h2>
                    </div>
                    <div className="budget-boxes">
                        <div className="budget-box1">
                            <div className="budget-box-wrapper">
                                <div className="icon">
                                    <FaMoneyBillWave className="budget-icon"/>
                                    <p className="budget-box-title">Total Budget</p>
                                </div>
                                <div className="amount">
                                    <p className="budget-box-amt">AED {parseFloat(budgetSummary.totalBudget).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                                </div>
                            </div>
                            {/* <div className="graph-overlay"></div> */}
                        </div>

                        <div className="budget-box2">
                            <div className="budget-box-wrapper">
                                <div className="icon">
                                    <FaMoneyBillWave className="budget-icon"/>
                                    <p className="budget-box-title">Budget Spent</p>
                                </div>
                                <div className="amount">
                                    <p className="budget-box-amt">AED {parseFloat(budgetSummary.totalSpent).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                                </div>
                            </div>
                            {/* <div className="graph-overlay"></div> */}
                        </div>

                        <div className="budget-box3">
                            <div className="budget-box-wrapper">
                                <div className="icon">
                                    <FaMoneyBillWave className="budget-icon"/>
                                    <p className="budget-box-title">Remainder</p>
                                </div>
                                <div className="amount">
                                    <p className="budget-box-amt">AED {parseFloat(budgetSummary.remaining).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                                </div>
                            </div>
                            {/* <div className="graph-overlay"></div> */}
                        </div>
                    </div>
                </div>
                <h4 className="monthly-expense-title">Monthly Expense</h4>
                <div className="monthly-expense">
                    <MonthlyExpensesChart data={dashboardData?.monthlyExpenses} />
                </div>
                <h4 className="latest-event-expense-title">Latest Events</h4>
                <div className="latest-event-expense">
                    <LatestEventsList events={dashboardData?.latestEvents && dashboardData.latestEvents.map(event => ({
                        id: event.id,
                        name: event.name,
                        // amount: `AED ${event.totalExpense.toLocaleString()}`
                        amount: `AED ${(event.totalExpense || event.amount || 0).toLocaleString()}`

                    }))} />
                      {/* <LatestEventsList events={dashboardData?.latestEvents || []} /> */}

                </div>
            </div>
            
            <div className="expense-breakdown">
                <div>
                    {userRole === "admin" && (
                    <div className="select-club-container-bt">
                        <select 
                            className="select-club-dropdown-bt" 
                            value={selectedClubId || ""} 
                            onChange={(e) => {
                                setSelectedClubId(e.target.value);
                                sessionStorage.setItem("selectedClubId", e.target.value);
                            }}
                        >
                            <option value="">All Clubs</option>
                            {clubs.map(club => (
                                <option key={club.club_id} value={club.club_id}>{club.club_name}</option>
                            ))}
                        </select>
                    </div>
                )}
                </div>
                <h4 className="expense-breakdown-title">Club Expenses Breakdown</h4>
                <div className="expense-breakdown-chart">
                    <ExpenseBreakdownChart data={dashboardData?.expenseBreakdown} />
                </div>

                <h4 className="budget-committee-members-title">Committee Members</h4>
                <div className="budget-committee-members">
                    <BTCommitteeMembers />
                </div>
                <div>
                    <Link to="/committee/budget-tracker/event-expenses" 
                    onClick={() => window.scrollTo(0, 0)} 
                    className="budget-next-button">Go Next</Link>
                </div>
            </div>
        </div>
    );
};

export default BudgetDashboard;