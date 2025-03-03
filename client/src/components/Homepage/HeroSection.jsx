
import "./HeroSection.css"

const HeroSection = () => {
  return (
    <div
      className="hero-container-landing"
      style={{
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        minHeight: "80vh",
        backgroundImage: `url("/assets/images/hero.jpeg")`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
        filter: "saturate(1.6)",
        padding: "2rem",
      }}
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

