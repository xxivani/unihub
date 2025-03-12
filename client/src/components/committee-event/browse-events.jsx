import "./browse-events.css"



const BrowseEvents = () =>{
    return (
        <div className="e4c-browse-events">
            <div className="e4c-browse-events-list">
                <div className="e4c-events-list"><div className="e4c-event-format">
                    <div className="e4c-event-image"></div>
                    <div className="e4c-event-info-container"><div className="e4c-event-title">Event Name</div>
                    <div className="e4c-event-description">Super duper trooper looper uper awesome jaw-dropping eye-popping lung-exploding cool event description</div>
                    <div className="e4c-event-time">Location: location Name</div><div className="e4c-event-time">Time: start time - end time</div></div>
                    <div className="e4c-event-button-container">
                    <div className="e4c-event-up-down-container">
                    <button className="e4c-event-detail-button" onClick={() => window.location.href='/event-details'}>Detail</button>
                    <div className="e4c-event-follow-button">Follow</div></div>
                    <div className="e4c-event-notification1"></div></div></div></div>
                <div className="e4c-events-list"><div className="e4c-event-format"><div className="e4c-event-image"></div>
                    <div className="e4c-event-info-container"><div className="e4c-event-title">Event Name</div>
                    <div className="e4c-event-description">Super duper trooper looper uper awesome jaw-dropping eye-popping lung-exploding cool event description</div>
                    <div className="e4c-event-time">Location: location Name</div><div className="e4c-event-time">Time: start time - end time</div></div>
                    <div className="e4c-event-button-container">
                    <div className="e4c-event-up-down-container">
                    <button className="e4c-event-detail-button" onClick={() => window.location.href='/event-details'}>Detail</button>
                    <div className="e4c-event-follow-button">Follow</div></div>
                    <div className="e4c-event-notification1"></div></div></div></div>
                <div className="e4c-events-list"><div className="e4c-event-format"><div className="e4c-event-image"></div>
                    <div className="e4c-event-info-container"><div className="e4c-event-title">Event Name</div>
                    <div className="e4c-event-description">Super duper trooper looper uper awesome jaw-dropping eye-popping lung-exploding cool event description</div>
                    <div className="e4c-event-time">Location: location Name</div><div className="e4c-event-time">Time: start time - end time</div></div>
                    <div className="e4c-event-button-container">
                    <div className="e4c-event-up-down-container">
                    <button className="e4c-event-detail-button" onClick={() => window.location.href='/event-details'}>Detail</button>
                    <div className="e4c-event-follow-button">Follow</div></div>
                    <div className="e4c-event-notification1"></div></div></div></div>
                <div className="e4c-events-list"><div className="e4c-event-format"><div className="e4c-event-image"></div>
                    <div className="e4c-event-info-container"><div className="e4c-event-title">Event Name</div>
                    <div className="e4c-event-description">Super duper trooper looper uper awesome jaw-dropping eye-popping lung-exploding cool event description</div>
                    <div className="e4c-event-time">Location: location Name</div><div className="e4c-event-time">Time: start time - end time</div></div>
                    <div className="e4c-event-button-container">
                    <div className="e4c-event-up-down-container">
                    <button className="e4c-event-detail-button" onClick={() => window.location.href='/event-details'}>Detail</button>
                    <div className="e4c-event-follow-button">Follow</div></div>
                    <div className="e4c-event-notification1"></div></div></div></div>
                <div className="e4c-events-list"><div className="e4c-event-format"><div className="e4c-event-image"></div>
                    <div className="e4c-event-info-container"><div className="e4c-event-title">Event Name</div>
                    <div className="e4c-event-description">Super duper trooper looper uper awesome jaw-dropping eye-popping lung-exploding cool event description</div>
                    <div className="e4c-event-time">Location: location Name</div><div className="e4c-event-time">Time: start time - end time</div></div>
                    <div className="e4c-event-button-container">
                    <div className="e4c-event-up-down-container">
                    <button className="e4c-event-detail-button" onClick={() => window.location.href='/event-details'}>Detail</button>
                    <div className="e4c-event-follow-button">Follow</div></div>
                    <div className="e4c-event-notification1"></div></div></div></div>
            </div>
            <div className="e4c-event-pagination">
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