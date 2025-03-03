import "./Aboutus.css"



const Aboutus = () =>{
    return (
        <div className="aboutus">
            <div className="aboutus-text-whole">
                <svg xmlns="http://www.w3.org/2000/svg" width="72" height="6" viewBox="0 0 72 6" fill="none">
                    <path d="M0 2.99976H72" stroke="#1D2130" strokeWidth="5"/>
                </svg>
                <h1 className="aboutus-text">ABOUT US</h1>
            </div>

            <div className="aboutus-card">
                <div className="aboutus-text-container">
                    <h1 className="aboutus-heading"> heading</h1>
                    <p className="text"> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam ipsum dolor, placerat vitae massa a, bibendum tempus velit. Duis leo dui, euismod ut nisi sodales, ultricies hendrerit justo. Etiam semper facilisis tortor, eget varius lacus commodo ut. Aliquam bibendum sit amet odio at tristique. Nam felis augue, mollis in dolor vitae, malesuada vehicula ante. Phasellus semper enim eget mi iaculis, eget convallis ipsum dignissim. </p>
                </div>

                <div className="img"></div>
            </div>


        </div>
    );
};

export default Aboutus;