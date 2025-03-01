
import "./top-section.css"


const TopSection = () => {
    return (
        <div className="top-container">
            <h1 className="top-title">Upcoming Events</h1>
            <div className="search-container">
                <div class="top-search">
                    <input type="text" placeholder="Search.."></input>
                    </div>
                <div class="top-button"><span>Filter</span></div>
                <div class="top-calendar-button"><span>Calendar</span></div>
                </div>
            </div>
        );
    };

export default TopSection;
