import { useEffect, useState } from "react";

const Aboutus = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  const isMobile = windowWidth <= 768;
  
  const aboutusStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "auto",
    width: "100%",
    marginTop: isMobile ? "150px" : "300px",
  };

  const aboutusCardStyle = {
    backgroundColor: "#d9cdbe",
    width: "100%",
    minHeight: isMobile ? "auto" : "500px",
    display: "flex",
    flexDirection: isMobile ? "column" : "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: isMobile ? "20px" : "40px",
  };

  const aboutusTextWholeStyle = {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    marginBottom: "10px",
    alignSelf: isMobile ? "center" : "flex-start",
    marginLeft: isMobile ? "0" : "60px",
  };

  const aboutusTextStyle = {
    fontSize: isMobile ? "1.5rem" : "1.8rem",
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: "1px",
    color: "#1D2130",
    textAlign: "left",
  };

  const aboutusTextContainerStyle = {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    padding: isMobile ? "30px 20px" : "150px",
  };

  const aboutusHeadingStyle = {
    fontSize: isMobile ? "28px" : "40px",
    fontWeight: 700,
    lineHeight: 1.2,
    marginBottom: isMobile ? "30px" : "80px",
  };

  const textStyle = {
    fontSize: "16px",
    lineHeight: 1.6,
    marginTop: "20px",
  };

  const imgStyle = {
    width: isMobile ? "100%" : "400px",
    height: isMobile ? "300px" : "504px",
    backgroundImage: 'url("/assets/images/img.jpeg")',
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    order: isMobile ? -1 : 0,
  };

  return (
    <div style={aboutusStyle}>
      <div style={aboutusTextWholeStyle}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={isMobile ? "50" : "72"}
          height="6"
          viewBox="0 0 72 6"
          fill="none"
        >
          <path d="M0 2.99976H72" stroke="#1D2130" strokeWidth="5" />
        </svg>
        <h1 style={aboutusTextStyle}>ABOUT US</h1>
      </div>
      <div style={aboutusCardStyle}>
        <div style={aboutusTextContainerStyle}>
          <h1 style={aboutusHeadingStyle}>Our Aim</h1>
          <p style={textStyle}>
          At UniHub, we set out to solve one simple problem: university life can be overwhelming when everything from club meetings to networking events is scattered across a dozen different websites. Our MVP brings it all together in one place, students can quickly find on-campus club events, off-campus hackathons, or open leadership roles without jumping between tabs.

          Each week, we package the highlights into a concise newsletter so you never miss a beat whether it’s a must-see lecture, a new committee role, or an upcoming social mixer, it lands in your inbox every Monday morning.
          
          For club leaders, UniHub offers an intuitive dashboard to create and manage events, track who’s joining, and post new role openings. Our budget tracker takes the stress out of planning by letting committees log expenses, forecast annual budgets, and keep everyone on the same page financially. We’ve also added an Event Image Manager, so you can upload and organize eye-catching visuals that make your events pop.
          
          </p>
        </div>
        <div style={imgStyle}></div>
      </div>
    </div>
  );
};

export default Aboutus;