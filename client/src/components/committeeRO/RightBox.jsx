import './RightBox.css';

const RightBox = () => {
    return (
        <div className="right-box">
            <form>
                <label htmlFor="position">Enter Position*</label>
                <input type="text" id="position" name="position" placeholder="Treasurer" />

                <label htmlFor="due-date">Enter Due Date*</label>
                <input type="text" id="due-date" name="due-date" placeholder="DD/MM/YYYY" />

                <label htmlFor="job-description">Enter Job Description*</label>
                <textarea id="job-description" name="job-description" placeholder="Manages finances and budgets." />

                <label htmlFor="eligibility">Enter Eligibility Criteria*</label>
                <textarea id="eligibility" name="eligibility" placeholder="Must be an Economics Student. Must have some experience regarding accounting." />

                <button type="submit">Save Changes</button>
            </form>
        </div>
    );
};

export default RightBox;