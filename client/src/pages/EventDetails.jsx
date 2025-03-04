//Components ordering for the event detail page

import TopSection from "../components/events/top-detail";
import EventPanel from "../components/events/event-panel";

const EventDetail = () => {
  return (
    <div>
      <TopSection/>
      <EventPanel/>
    </div>
  );
};

export default EventDetail;
