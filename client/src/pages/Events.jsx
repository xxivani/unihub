//Components ordering for the event page

import TopSection from "../components/events/top-section";
import BrowseEvents from "../components/events/browse-events";

const Home = () => {
  return (
    <div>
      <TopSection/>
      <BrowseEvents/>
    </div>
  );
};

export default Home;
