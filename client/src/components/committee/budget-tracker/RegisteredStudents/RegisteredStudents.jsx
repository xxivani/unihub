import "./RegisteredStudents.css"
import FilterBarStudents from "./FilterBar-RegisteredStudents";
import RegisteredStudentsTable from "./RegisteredStudentsTable";
import { FaSearch } from "react-icons/fa";
import AddStudents from "./AddStudents";
import { Link } from "react-router-dom";

const RegisteredStudents = () => {

    return (
        <div className="registered-students-page">

            <div className="main-registered-students">
                <div>
                    <div className="registered-students-title">
                        <h2>List of Registered Students</h2>
                    </div>
                    
                    <div className="registered-students-controls">
                        <div className="registered-students-filter-bar">
                            <FilterBarStudents />
                        </div>
                        <div className="registered-students-header">
                            {/* <AddStudents /> */}
                        </div>
                    </div> 
                    <div className="registered-students-search-bar">
                        <FaSearch className="registered-students-search-icon"/>
                        <input type="text" placeholder="Search for Students" />
                        
                    </div>
                    <div className="registered-students-table">
                        <RegisteredStudentsTable />
                    </div>
                    <div>
                        {/* <p>back button</p> */}
                        <Link to="/committee/budget-tracker/event-expenses" onClick={() => window.scrollTo(0, 0)} className="registered-students-back-button">Go Back</Link>

                    </div>
                    
                </div>
                
            </div>
            
        </div>
    );
};

export default RegisteredStudents;