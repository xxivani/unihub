import "./EventExpenses.css"
import EventExpensesTable from "./EventExpenseTable";
import EventAddExpenseButton from "./EventExpensesForm";
import FilterBar from "./FilterBar";
import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";

const EventExpenses = () => {

    return (
        <div className="event-expenses-page">

            <div className="main-event-expenses">
                <div>
                    <div className="event-expenses-title">
                        <h2>Event Expenses</h2>
                    </div>
                    
                    <div className="event-expenses-controls">
                        <div className="event-expenses-filter-bar">
                            <FilterBar />
                        </div>
                        <div className="event-expenses-header">
                            <EventAddExpenseButton />
                        </div>
                    </div> 
                    <div className="event-expenses-search-bar">
                        <FaSearch className="event-expenses-search-icon"/>
                        <input type="text" placeholder="Search for events" />
                        
                    </div>
                    <div className="event-expenses-table">
                        <EventExpensesTable />
                    </div>
                    <div className="event-expenses-button-container">
                        <div>
                            <Link to="/committee/budget-tracker" onClick={() => window.scrollTo(0, 0)} className="event-expenses-back-button">Go Back</Link>
                        </div>
                        <div>
                            <Link to="/committee/budget-tracker/registered-students" onClick={() => window.scrollTo(0, 0)} className="event-expenses-next-button">Go Next</Link>
                        </div>
                    </div>
                    
                    
                </div>
                
            </div>
            
        </div>
    );
};

export default EventExpenses;