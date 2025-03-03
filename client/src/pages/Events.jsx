//Components ordering for the event page

import TopSection from "../components/events/top-section";
import BrowseEvents from "../components/events/browse-events";

const Event = () => {
  return (
    <div>
      <TopSection/>
      <BrowseEvents/>
    </div>
  );
};

export default Event;
