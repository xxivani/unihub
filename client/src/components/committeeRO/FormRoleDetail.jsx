import './FormRoleDetail.css';
import formSubmissions from './formSubmissions.js';
import Pagination from '../viewRO/Pagination';
import { useState } from "react";

const FormRoleDetail = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const submissionsPerPage = 1;
    const totalPages = formSubmissions.length;

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const currentSubmission = formSubmissions[currentPage - 1];

    const handleDownload = () => {
        if (currentSubmission.cv) {
            const url = URL.createObjectURL(currentSubmission.cv);
            const a = document.createElement("a");
            a.href = url;
            a.download = currentSubmission.cv.name;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
    };

    return (
        <div className="entity6-role-detail">
            {currentSubmission ? (
                <form>
                    <h3>Response #{currentPage}</h3>
                    <label htmlFor="name">Enter Name</label>
                    <input type="text" id="name" name="name" value={currentSubmission.name} readOnly />

                    <label htmlFor="phone">Enter Phone Number</label>
                    <input type="text" id="phone" name="phone" value={currentSubmission.phone} readOnly />

                    <label htmlFor="email">Enter Email Address</label>
                    <input type="email" id="email" name="email" value={currentSubmission.email} readOnly />

                    <label htmlFor="why">Why should we choose you?</label>
                    <textarea id="why" name="why" value={currentSubmission.why} readOnly />

                    <label htmlFor="cv">Attach CV</label>
                    {currentSubmission.cv ? (
                        <button type="button" className="download-btn" onClick={handleDownload}>
                            Download CV
                        </button>
                    ) : (
                        <p>No file uploaded</p>
                    )}
                </form>
            ) : (
                <p>No submissions available.</p>
            )}

            <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={handlePageChange}
            />
        </div>
    );
};

export default FormRoleDetail;
