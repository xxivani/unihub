import { useState, useEffect } from "react";
import "./BudgetDashboard.css";
import "../../../charts/MonthlyExpenses";
import MonthlyExpensesChart from "../../../charts/MonthlyExpenses";
import { FaMoneyBillWave, FaPlus, FaEdit } from "react-icons/fa";
import LatestEventsList from "./LatestEventsList";
import ExpenseBreakdownChart from "../../../charts/ExpenseBreakdown";
import BTCommitteeMembers from "../../budget-tracker/BudgetDashboard/BTCommitteeMembers";
import AddExpenseButton from "./AddExpense";
import { Link } from "react-router-dom";
import Sidebar from "../../../committee-dashboard/Sidebar";
import { Modal, Form, Input, Button, message } from "antd";

const BudgetDashboard = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditingBudget, setIsEditingBudget] = useState(false);
    const [budgetForm] = Form.useForm();

    // Fetch dashboard data
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${apiUrl}/bt_dashboardRoute`);
            
            if (!response.ok) {
                throw new Error('Failed to fetch dashboard data');
            }
            
            const data = await response.json();
            setDashboardData(data);
            setError(null);
        } catch (err) {
            console.error('Error fetching dashboard data:', err);
            setError('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };
    
    // Fetch data when component mounts
    useEffect(() => {
        fetchDashboardData();
    }, []);

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
                    totalAmount: parseFloat(values.totalAmount)
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
                    totalSpent: parseFloat(values.totalSpent)
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
                        amount: `AED ${event.totalExpense.toLocaleString()}`
                    }))} />
                </div>
            </div>
            
            <div className="expense-breakdown">
                <h4 className="expense-breakdown-title">Club Expenses Breakdown</h4>
                <div className="expense-breakdown-chart">
                    <ExpenseBreakdownChart data={dashboardData?.expenseBreakdown} />
                </div>

                <h4 className="budget-committee-members-title">Committee Members</h4>
                <div className="budget-committee-members">
                    <BTCommitteeMembers />
                </div>
                <div>
                    <Link to="/committee/budget-tracker/event-expenses" onClick={() => window.scrollTo(0, 0)} className="budget-next-button">Go Next</Link>
                </div>
            </div>
        </div>
    );
};

export default BudgetDashboard;