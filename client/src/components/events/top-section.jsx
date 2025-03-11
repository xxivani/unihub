
import "./top-section.css"


const TopSection = () => {
    return (
        <div className="e4-top-container">
            <div className="e4-search-container">
            <h1 className="e4-top-title">Upcoming Events</h1>
                <div className="e4-top-search">
                    <input type="text" placeholder="Search.."></input>
                    </div>
                <div className="e4-top-button"><span>Filter</span></div>
                </div>
            </div>
        );
    };

export default TopSection;
