import "./EventExpenses.css"
import EventExpensesTable from "./EventExpenseTable";
import EventAddExpenseButton from "./EventExpensesForm";
import FilterBar from "./FilterBar";
import { FaSearch } from "react-icons/fa";

const EventExpenses = () => {

    return (
        <div className="event-expenses-page">

            <div className="main-event-expenses">
                <div className="event-expenses">
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
                        <input type="text" placeholder="Search" />
                        
                    </div>
                    <div className="event-expenses-table">
                        <EventExpensesTable />
                    </div>
                    
                </div>
                
            </div>
            
        </div>
    );
};

export default EventExpenses;