
const heroContainerStyle = {
  display: "flex",
  justifyContent: "flex-end",
  alignItems: "center",
  minHeight: "80vh",
  width: "100%",
  backgroundImage: 'url("/assets/images/hero.jpeg")',
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
  backgroundPosition: "center",
  position: "relative",
  filter: "saturate(1.6)",
  padding: "2rem",
};

const heroOverlayStyle = {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0, 0, 0, 0.4)",
  zIndex: 1,
};

const textContainerStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  textAlign: "right",
  zIndex: 2,
  position: "relative",
};

const heroTextStyle = {
  color: "white",
  fontSize: "5rem",
  fontWeight: "bold",
  textShadow: "2px 2px 8px rgba(0, 0, 0, 0.5)",
  margin: "15px 0",
};

const exploreTextStyle = {
  color: "#F4BE37",
};

const HeroSection = () => {
  return (
    <div style={heroContainerStyle}>
      <div style={heroOverlayStyle}></div>
      <div style={textContainerStyle}>
        <h1 style={heroTextStyle}>ENGAGE.</h1>
        <h1 style={{ ...heroTextStyle, ...exploreTextStyle }}>EXPLORE.</h1>
        <h1 style={heroTextStyle}>UNWIND.</h1>
      </div>
    </div>
  );
};

export default HeroSection;
