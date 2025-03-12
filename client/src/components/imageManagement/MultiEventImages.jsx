import React, { useState } from 'react';
import './MultiEventImages.css';
import {FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const imageM_events = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPreview, setCurrentPreview] = useState(null);
  const [isPopupMode, setIsPopupMode] = useState(false);
  const [imageRow, setImageRow] = useState({
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0
  });  
  const position = [0, 1, 2, 3, 4, 5, 6, 7];
  const imageRow1 = 0;
  const imageRow2 = 0;
  const imageRow3 = 0;
  const imageRow4 = 0;
  const imageRow5 = 0;
  const events = [
    {
      id: 1,
      title: "Event 1",
      image: "/assets/images/imageM.jpg",
    },
    {
      id: 2,
      title: "Event 2",
      image: "/assets/images/imageM.jpg",
    },
    {
      id: 3,
      title: "Event 3",
      image: "/assets/images/imageM.jpg",
    },
    {
      id: 4,
      title: "Event 4",
      image: "/assets/images/imageM.jpg",
    },
    {
      id: 5,
      title: "Event 5",
      image: "/assets/images/imageM.jpg",
    }
  ];

  const totalPages = 10;
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const handleClose = () => {
    setIsPopupMode(false);
  };
  const handlePopup = (event) => {
    setIsPopupMode(true);
    setCurrentPreview(event);
  }
  return (
    <main className="imageM-main-container">
      <div className="imageM-header">
        <h1 className="imageM-heading">Events Image Management</h1>
      </div>
      <div className="imageM-container">
        {isPopupMode && (
          <div className="imageM-popup">
            <button 
              className="imageM-close-button"
              onClick={handleClose}
            >
              Close
            </button>
            <div className="imageM-preview-image">
              <img src={currentPreview.image} alt={currentPreview.title} />
            </div>
            <button 
              className="imageM-popup-button"
              onClick={undefined}
            >
              Import
            </button>
            <button 
              className="imageM-popup-button"
              onClick={undefined}
            >
              Edit
            </button>
            <button 
              className="imageM-popup-button"
              onClick={undefined}
            >
              Move
            </button>
            <button 
              className="imageM-popup-button"
              onClick={undefined}
            >
              Delete
            </button>
          </div>
        )}
        {events.map(event => (
          <div className="imageM-card" key={event.id}>
            <div className="imageM-image">
              <img src={event.image} alt={event.title} />
            </div>
            <div>
              <h2 className="imageM-title">{event.title}</h2>
            <div className="imageM-actions">
              {position.map(id => (
              <button key={id} className={`imageM-box-button ${imageRow[event.id] !== id ? (imageRow[event.id] < id ? "hide" : "") : "add"}`} disabled={(imageRow[event.id] < id || isPopupMode == true)} onClick={imageRow[event.id] !== id ? () => ((isPopupMode == false) ? handlePopup(event) : undefined) : () => setImageRow(prev => ({ ...prev, [event.id]: (prev[event.id] || 0) + 1 }))}>{imageRow[event.id] !== id ? "" : "+"}</button>
              ))}
              </div>
            </div>
          </div>
        ))}
      </div> 
      <Pagination 
        totalPages={totalPages} 
        currentPage={currentPage} 
        onPageChange={handlePageChange} 
      />
    </main>
  );
};

const Pagination = ({ totalPages, currentPage, onPageChange }) => {
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  return (
    <div className="imageM-pagination">
      <button 
        className={`imageM-pagination-arrow ${isFirstPage ? 'disabled' : ''}`}
        onClick={() => !isFirstPage && onPageChange(currentPage - 1)}
        aria-label="Previous page"
      >
        <FaChevronLeft />
      </button>

      <button
        className={`imageM-pagination-number ${currentPage === Math.min(Math.max(1,currentPage-2),totalPages-4) ? 'active' : ''}`}
        onClick={() => onPageChange(Math.min(Math.max(1,currentPage-2),totalPages-4))}
      >
        {Math.min(Math.max(1,currentPage-2),totalPages-4)}
      </button>
      
      <button
        className={`imageM-pagination-number ${currentPage === (Math.min(Math.max(2,currentPage-1),totalPages-3)) ? 'active' : ''}`}
        onClick={() => onPageChange(Math.min(Math.max(2,currentPage-1),totalPages-3))}
      >
        {Math.min(Math.max(2,currentPage-1),totalPages-3)}
      </button>

      <button
        className={`imageM-pagination-number ${currentPage === (Math.min(Math.max(3,currentPage),totalPages-2)) ? 'active' : ''}`}
        onClick={() => onPageChange(Math.min(Math.max(3,currentPage),totalPages-2))}
      >
        {Math.min(Math.max(3,currentPage),totalPages-2)}
      </button>

      <button
        className={`imageM-pagination-number ${currentPage === (Math.min(Math.max(4,currentPage+1),totalPages-1)) ? 'active' : ''}`}
        onClick={() => onPageChange(Math.min(Math.max(4,currentPage+1),totalPages-1))}
      >
        {Math.min(Math.max(4,currentPage+1),totalPages-1)}
      </button>

      <span className="imageM-pagination-ellipsis">...</span>

      <button
        className={`imageM-pagination-number ${currentPage === totalPages ? 'active' : ''}`}
        onClick={() => onPageChange(totalPages)}
      >
        {totalPages}
      </button>

      <button 
        className={`imageM-pagination-arrow ${isLastPage ? 'disabled' : ''}`}
        onClick={() => !isLastPage && onPageChange(currentPage + 1)}
        aria-label="Next page"
      >
        <FaChevronRight />
      </button>
    </div>
  );
};

export default imageM_events;