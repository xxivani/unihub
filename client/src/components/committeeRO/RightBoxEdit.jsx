import './RightBox.css';

const RightBoxEdit = () => {
    return (
        <div className="right-box">
            <form>
                <label htmlFor="name">Enter Name*</label>
                <input type="text" id="name" name="name"/>

                <label htmlFor="phone">Enter Phone Number*</label>
                <input type="text" id="phone" name="phone" placeholder="+971" />

                <label htmlFor="email">Enter Email Address*</label>
                <input type="text" id="phone" name="phone"/>

                <label htmlFor="why">Why should we choose you?*</label>
                <textarea id="why" name="why"/>

                <label htmlFor="cv">Attach CV</label>
                <input type="file" id="cv" name="cv" accept=".pdf" required />

                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default RightBoxEdit;