import { useState, useEffect } from "react";
import "./BudgetDashboard.css";
import "../../../charts/MonthlyExpenses";
import MonthlyExpensesChart from "../../../charts/MonthlyExpenses";
import { FaMoneyBillWave } from "react-icons/fa";
import LatestEventsList from "./LatestEventsList";
import ExpenseBreakdownChart from "../../../charts/ExpenseBreakdown";
import BTCommitteeMembers from "../../budget-tracker/BudgetDashboard/BTCommitteeMembers";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../../../committee-dashboard/Sidebar";
import { message } from "antd";

const BudgetDashboard = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [clubs, setClubs] = useState([]);
    const [selectedClubId, setSelectedClubId] = useState(null);
    const [userRole, setUserRole] = useState("");
    const [hasAccess, setHasAccess] = useState(false);
    const [permissionLoading, setPermissionLoading] = useState(true);

    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const urlClubId = queryParams.get('club_id');

    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

    // Check permission to access budget tracker
    useEffect(() => {
        const checkBudgetAccess = async () => {
            try {
                setPermissionLoading(true);

                const user = JSON.parse(sessionStorage.getItem("user"));

                if (!user || !user.id) {
                    console.log("No user found, redirecting to login");
                    navigate("/login");
                    return;
                }

                if (user.role === "admin") {
                    setHasAccess(true);
                    setPermissionLoading(false);
                    return;
                }

                // First get their committee_member_id
                const committeeMemberRes = await fetch(`${apiUrl}/committee-members/by-user/${user.id}`);

                if (!committeeMemberRes.ok) {
                    console.error("Failed to fetch committee member info");
                    setHasAccess(false);
                    setPermissionLoading(false);
                    message.error("You don't have permission to access the Budget Tracker.");

                }

                const committeeMemberData = await committeeMemberRes.json();

                if (!committeeMemberData || !committeeMemberData.committee_member_id) {
                    console.error("No committee member ID found");
                    setHasAccess(false);
                    setPermissionLoading(false);
                    message.error("You don't have permission to access the Budget Tracker.");

                }

                const committee_member_id = committeeMemberData.committee_member_id;

                // Now fetch the permissions for this committee member
                const permissionsRes = await fetch(`${apiUrl}/committee-member-permissions/${committee_member_id}`);

                if (!permissionsRes.ok) {
                    console.error("Failed to fetch permissions");
                    setHasAccess(false);
                    setPermissionLoading(false);
                    message.error("You don't have permission to access the Budget Tracker.");

                }

                const permissions = await permissionsRes.json();

                // Check if the user has the UpdateBudget permission
                const hasBudgetPermission = permissions.some(p => p.permission === "UpdateBudget");

                setHasAccess(hasBudgetPermission);

            } catch (error) {
                console.error("Error checking budget access:", error);
                setHasAccess(false);
            } finally {
                setPermissionLoading(false);
            }
        };

        checkBudgetAccess();
    }, [navigate, apiUrl]);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const url = selectedClubId ?
                `${apiUrl}/bt_dashboardRoute?club_id=${selectedClubId}` :
                `${apiUrl}/bt_dashboardRoute`;

            console.log("Dashboard fetch URL:", url);

            const response = await fetch(url);
            console.log("Dashboard response status:", response.status);

            if (!response.ok) {
                throw new Error('Failed to fetch dashboard data');
            }

            const data = await response.json();
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

    const fetchClubs = async () => {
        try {
            const res = await fetch(`${apiUrl}/clubs`);
            console.log("Clubs fetch URL:", `${apiUrl}/clubs`);

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
        } catch (err) {
            console.error("Failed to fetch committee member's club_id:", err);
        }
    };

    const getBudgetWarning = () => {
        const remaining = parseFloat(budgetSummary.remaining || 0);
        const total = parseFloat(budgetSummary.totalBudget || 0);
        
        if (total === 0) return null;
        
        const percentageRemaining = (remaining / total) * 100;
        
        if (percentageRemaining < 0) {
          return (
            <div style={{ 
              color: 'red', 
              fontWeight: 'bold', 
              padding: '10px', 
              marginTop: '10px',
              backgroundColor: '#fee',
              borderRadius: '4px'
            }}>
              ⚠️ Budget exceeded! You've overspent by AED {Math.abs(remaining).toLocaleString()}
            </div>
          );
        } else if (percentageRemaining < 10) {
          return (
            <div style={{ 
              color: 'orange', 
              padding: '10px', 
              marginTop: '10px',
              backgroundColor: '#fff3cd',
              borderRadius: '4px'
            }}>
              ⚠️ Warning: Only {percentageRemaining.toFixed(1)}% of budget remaining
            </div>
          );
        }
        
        return null;
      };

    //fallback for when clubs cant be fetched
    useEffect(() => {
        // Check if we have access first before fetching data
        if (hasAccess && !permissionLoading) {
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
        }
    }, [hasAccess, permissionLoading]);

    // Initialize club selection on component mount
    useEffect(() => {
        if (hasAccess && !permissionLoading) {
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
        }
    }, [urlClubId, hasAccess, permissionLoading]);

    // Fetch dashboard data when selectedClubId changes
    useEffect(() => {
        if (selectedClubId && hasAccess && !permissionLoading) {
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
    }, [selectedClubId, location.pathname, location.search, navigate, hasAccess, permissionLoading]);

    if (permissionLoading) {
        return (
            <div className="budget-dashboard">
                <div className="budget-dashboard-sidebar">
                    <Sidebar />
                </div>
                <div className="main-budget-dash">
                    <p>Checking permissions...</p>
                </div>
            </div>
        );
    }

    if (!hasAccess) {
        return (
            <div className="access-denied" >
                <h2>Access Denied</h2>
                <p>You don't have permission to access the Budget Tracker.</p>
            </div>
        );
    }

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

    const budgetSummary = dashboardData?.budgetSummary || {};

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
                                    <FaMoneyBillWave className="budget-icon" />
                                    <p className="budget-box-title">Total Budget</p>
                                </div>
                                <div className="amount">
                                    <p className="budget-box-amt">AED {parseFloat(budgetSummary.totalBudget || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                                </div>
                            </div>
                        </div>

                        <div className="budget-box2">
                            <div className="budget-box-wrapper">
                                <div className="icon">
                                    <FaMoneyBillWave className="budget-icon" />
                                    <p className="budget-box-title">Budget Spent</p>
                                </div>
                                <div className="amount">
                                    <p className="budget-box-amt">AED {parseFloat(budgetSummary.totalSpent || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                                </div>
                            </div>
                        </div>

                        <div className="budget-box3">
                            <div className="budget-box-wrapper">
                                <div className="icon">
                                    <FaMoneyBillWave className="budget-icon" />
                                    <p className="budget-box-title">Remainder</p>
                                </div>
                                <div className="amount">
                                    <p className="budget-box-amt">AED {parseFloat(budgetSummary.remaining || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    {getBudgetWarning()}
                </div>
                <h4 className="monthly-expense-title">Monthly Expense</h4>
                <div className="monthly-expense">
                    <MonthlyExpensesChart data={dashboardData?.monthlyExpenses} />
                </div>
                <h4 className="latest-event-expense-title">Latest Events</h4>
                <div className="latest-event-expense">
                    <LatestEventsList
                        events={dashboardData?.latestEvents && dashboardData.latestEvents.length > 0
                            ? dashboardData.latestEvents.map(event => ({
                                id: event.id,
                                name: event.name,
                                amount: `${(event.totalExpense || event.amount || 0).toLocaleString()}`
                            }))
                            : null
                        }
                    />
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