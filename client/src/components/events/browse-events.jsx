import "./browse-events.css"



const BrowseEvents = () =>{
    return (
        <div className="e4-browse-events">
            <div className="e4-browse-events-list">
                <div className="e4-events-list"><div className="e4-event-format">
                    <div className="e4-event-image"></div>
                    <div className="e4-event-info-container"><div className="e4-event-title">Event Name</div>
                    <div className="e4-event-description">Super duper trooper looper uper awesome jaw-dropping eye-popping lung-exploding cool event description</div>
                    <div className="e4-event-time">Location: location Name</div><div className="e4-event-time">Time: start time - end time</div></div>
                    <div className="e4-event-button-container">
                    <div className="e4-event-up-down-container">
                    <button className="e4-event-detail-button" onClick={() => window.location.href='/event-details'}>Detail</button>
                    <div className="e4-event-follow-button">Follow</div></div>
                    <div className="e4-event-notification1"></div></div></div></div>
                <div className="e4-events-list"><div className="e4-event-format"><div className="e4-event-image"></div>
                    <div className="e4-event-info-container"><div className="e4-event-title">Event Name</div>
                    <div className="e4-event-description">Super duper trooper looper uper awesome jaw-dropping eye-popping lung-exploding cool event description</div>
                    <div className="e4-event-time">Location: location Name</div><div className="e4-event-time">Time: start time - end time</div></div>
                    <div className="e4-event-button-container">
                    <div className="e4-event-up-down-container">
                    <button className="e4-event-detail-button" onClick={() => window.location.href='/event-details'}>Detail</button>
                    <div className="e4-event-follow-button">Follow</div></div>
                    <div className="e4-event-notification1"></div></div></div></div>
                <div className="e4-events-list"><div className="e4-event-format"><div className="e4-event-image"></div>
                    <div className="e4-event-info-container"><div className="e4-event-title">Event Name</div>
                    <div className="e4-event-description">Super duper trooper looper uper awesome jaw-dropping eye-popping lung-exploding cool event description</div>
                    <div className="e4-event-time">Location: location Name</div><div className="e4-event-time">Time: start time - end time</div></div>
                    <div className="e4-event-button-container">
                    <div className="e4-event-up-down-container">
                    <button className="e4-event-detail-button" onClick={() => window.location.href='/event-details'}>Detail</button>
                    <div className="e4-event-follow-button">Follow</div></div>
                    <div className="e4-event-notification1"></div></div></div></div>
                <div className="e4-events-list"><div className="e4-event-format"><div className="e4-event-image"></div>
                    <div className="e4-event-info-container"><div className="e4-event-title">Event Name</div>
                    <div className="e4-event-description">Super duper trooper looper uper awesome jaw-dropping eye-popping lung-exploding cool event description</div>
                    <div className="e4-event-time">Location: location Name</div><div className="e4-event-time">Time: start time - end time</div></div>
                    <div className="e4-event-button-container">
                    <div className="e4-event-up-down-container">
                    <button className="e4-event-detail-button" onClick={() => window.location.href='/event-details'}>Detail</button>
                    <div className="e4-event-follow-button">Follow</div></div>
                    <div className="e4-event-notification1"></div></div></div></div>
                <div className="e4-events-list"><div className="e4-event-format"><div className="e4-event-image"></div>
                    <div className="e4-event-info-container"><div className="e4-event-title">Event Name</div>
                    <div className="e4-event-description">Super duper trooper looper uper awesome jaw-dropping eye-popping lung-exploding cool event description</div>
                    <div className="e4-event-time">Location: location Name</div><div className="e4-event-time">Time: start time - end time</div></div>
                    <div className="e4-event-button-container">
                    <div className="e4-event-up-down-container">
                    <button className="e4-event-detail-button" onClick={() => window.location.href='/event-details'}>Detail</button>
                    <div className="e4-event-follow-button">Follow</div></div>
                    <div className="e4-event-notification1"></div></div></div></div>
            </div>
            <div className="e4-event-pagination">
            <a href="#">&laquo;</a>
            <a class="active" href="#">1</a>
            <a href="#">2</a>
            <a href="#">3</a>
            <a href="#">4</a>
            <a href="#">5</a>
            <a href="#">6</a>
            <a href="#">&raquo;</a>
            </div>
        </div>
    );
};

export default BrowseEvents;