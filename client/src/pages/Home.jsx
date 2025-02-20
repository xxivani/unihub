import HeroSection from "../components/Homepage/HeroSection";
import Aboutus from "../components/Homepage/Aboutus";
import EventCards from "../components/Homepage/EventCard";
import LatestEvents from "../components/Homepage/LatestNews";

const Home = () => {
  return (
    <div>
      <HeroSection />
      <Aboutus />
      <EventCards />
      <LatestEvents />
    
    </div>
  );
};

export default Home;
