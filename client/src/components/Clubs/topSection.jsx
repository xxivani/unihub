import React from 'react';
import { useNavigate } from 'react-router-dom';
import './topSection.css';

const TopSection = () => {
    const navigate = useNavigate(); 

    return (
        <section className="browse-clubs-top">
            <h1 className="top-title">Browse Clubs</h1>
            
            <div className="search-filter-container">
                <input 
                    type="text" 
                    placeholder="Search clubs..." 
                    className="top-search" 
                />
                <button className="top-button">Filter</button>
                <button 
                    className="top-button create-club-button"
                    onClick={() => navigate('/create-club')} 
                >
                    Create Club
                </button>
            </div>
        </section>
    );
}

export default TopSection;
