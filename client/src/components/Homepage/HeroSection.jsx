
import "./HeroSection.css"

import heroImage from "/assets/images/hero.jpeg";

const HeroSection = () => {
  return (
    <div className="hero-container" style={{ backgroundImage: `url(${heroImage})` }}>
      <h1 className="hero-text">ENGAGE. EXPLORE. UNWIND.</h1>
    </div>
  );
};

export default HeroSection;
