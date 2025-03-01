import React from 'react';
import './topSection.css';

const TopSection = () => {
    return (
        <div className="top-container">
            <h1 className="top-title">Browse Clubs</h1>
            <div className="search-container">
                <input 
                    type="text" 
                    placeholder="Search clubs..." 
                    className="top-search" 
                />
                
                <button className="top-button">Filter</button>
            </div>
        </div>
    );
};

export default TopSection;
