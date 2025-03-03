import heroImage from "../../assets/hero.jpeg";

import "./HeroSection.css"


const HeroSection = () => {
  return (
    <div className="hero-container"
      style={{ backgroundImage: `url(${heroImage})` }}
      >
      <div className="hero-overlay"></div> 
      <div className="text-container">
        <h1 className="hero-text">ENGAGE.</h1>
        <h1 className="hero-text explore-text">EXPLORE.</h1>
        <h1 className="hero-text">UNWIND.</h1>
      </div>
    </div>
  );
};

export default HeroSection;

