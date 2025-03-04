import "./BudgetDashboard.css"
import "../../charts/MonthlyExpenses"
import MonthlyExpensesChart from "../../charts/MonthlyExpenses";
import { FaMoneyBillWave } from "react-icons/fa";
import LatestEventsList from "../budget-tracker/LatestEventsList"
import ExpenseBreakdownChart from "../../charts/ExpenseBreakdown";
import BTCommitteeMembers from "../budget-tracker/BTCommitteeMembers";


const BudgetDashboard = () =>{
    return (
        <div className="budget-dashboard">

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
                                    <p className="budget-box-amt">AED 10,000</p>   

                                </div>
                                
                            </div>
                            <div className="graph-overlay">
                                    
                            </div>
                            
                        </div>

                        <div className="budget-box2">
                            <div className="budget-box-wrapper">
                                <div className="icon">
                                    <FaMoneyBillWave className="budget-icon"/>
                                    <p className="budget-box-title">Budget Spent</p>
                                </div>
                                <div className="amount">
                                    <p className="budget-box-amt">AED 10,000</p>   

                                </div>
                                
                            </div>
                            <div className="graph-overlay">
                                    
                            </div>
                        </div>

                        <div className="budget-box3">
                            <div className="budget-box-wrapper">
                                <div className="icon">
                                    <FaMoneyBillWave className="budget-icon"/>
                                    <p className="budget-box-title">Remainder</p>
                                </div>
                                <div className="amount">
                                    <p className="budget-box-amt">AED 10,000</p>   

                                </div>
                                
                            </div>
                            <div className="graph-overlay">
                                    
                            </div>

                        </div>
                    </div>
                </div>
                <div className="monthly-expense">
                    <MonthlyExpensesChart />
                </div>
                <h4 className="latest-event-expense-title">Latest Events</h4>
                <div className="latest-event-expense">
                    <LatestEventsList />
                    
                </div>
            </div>
            
            <div className="expense-breakdown">
                <h4 className="expense-breakdown-title">Club Expenses Breakdown</h4>

                <div className="expense-breakdown-chart">
                    <ExpenseBreakdownChart />

                    <div className="add-expense-button">
                        {/* <div className="add-expense-icon" title="Add Expenses">
                            <FaPlus size={24} />
                            <span className="expense-tooltip">{item.label}</span>

                        </div> */}
                    </div>
                </div>

                <h4 className="budget-committee-members-title">Committee Members</h4>
                <div className="budget-committee-members">
                
                    <BTCommitteeMembers />
                </div>

            </div>
        </div>

    );
    
};

export default BudgetDashboard