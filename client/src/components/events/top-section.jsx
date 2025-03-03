
import "./top-section.css"


const TopSection = () => {
    return (
        <div className="e4-top-container">
            <h1 className="e4-top-title">Upcoming Events</h1>
            <div className="e4-search-container">
                <div className="e4-top-search">
                    <input type="text" placeholder="Search.."></input>
                    </div>
                <div className="e4-top-button"><span>Filter</span></div>
                <div className="e4-top-calendar-button"><span>Calendar</span></div>
                </div>
            </div>
        );
    };

export default TopSection;
