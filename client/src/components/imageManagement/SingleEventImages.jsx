import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import './SingleEventImages.css';

const ImageSEvents = () => {
  const navigate = useNavigate();
  const [currentPreview, setCurrentPreview] = useState(null);
  const [isPopupMode, setIsPopupMode] = useState(false);
  const [imageRow, setImageRow] = useState(0);
  const column = [0, 1, 2, 3, 4, 5, 6, 7];
  const [events, setEvents] = useState(
      {
        id: 1,
        title: 'Event 1',
        image0: '/assets/images/social.jpeg',
        image1: '/assets/images/paws.jpeg',
        image2: '/assets/images/mun.jpg',
        image3: '/assets/images/panda.jpg',
        image4: '',
        image5: '',
        image6: '/assets/images/president.jpg',
        image7: ''
      });
  const handleUpdate = (e) => {
    e.preventDefault();
  };
    const [selectedColumn, setSelectedColumn] = useState(null);
  
    const handleImport = (event) => {
      const file = event.target.files[0];
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/svg+xml', 'image/webp'];
    
      if (file && validTypes.includes(file.type)) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const newImage = e.target.result;
          
          setEvents((prevEvents) => ({
                  ...prevEvents,
                  [`image${selectedColumn}`]: newImage,
              })
          );
    
          setCurrentPreview(newImage);

          setTimeout(() => {
            setIsPopupMode(false);
            setSelectedColumn(null);
          }, 10);
        };
        reader.readAsDataURL(file);
      } else {
        alert('Please choose a correct file format (JPG, PNG, JPEG, SVG, WEBP).');
      }
    };
  
    const handleDelete = () => {
      setEvents(() =>
          selectedColumn != '0' 
            ? {
                ...events,
                [`image${selectedColumn}`]: '',
              }
            : events
      );
      setIsPopupMode(false);
      setSelectedColumn(null);
    };

    const handleClose = () => {
      setIsPopupMode(false);
      setCurrentPreview(null);
      setSelectedColumn(null);
    };
  
    const handlePopup = (column) => {
      if (isInMoveMode && selectedImage) {
        handleTargetSelection(column);
      } else {
        if (isPopupMode) {
          setIsPopupMode(false);
          setTimeout(() => {
            openPopup(column);
          }, 10);
        } else {
          openPopup(column);
        }
      }
    };

    const openPopup = (column) => {
      setCurrentPreview(events[`image${column}`]);
      setSelectedColumn(column);
      setIsPopupMode(true);
    };
  
    const handleTargetSelection = (column) => {
      if (isInMoveMode && selectedImage !== null) {
        const sourceColumn = selectedColumn;
        const targetColumn = column;
    
        setEvents((prevEvents) => {
          const updatedEvents = { ...prevEvents };
          const temp = updatedEvents[`image${sourceColumn}`];
          updatedEvents[`image${sourceColumn}`] = updatedEvents[`image${targetColumn}`];
          updatedEvents[`image${targetColumn}`] = temp;
          return updatedEvents;
      });
  
        setIsInMoveMode(false);
        setSelectedImage(null);
        setIsPopupMode(false);
      }
    };

    const [selectedImage, setSelectedImage] = useState(null);
    const [targetImage, setTargetImage] = useState(null);
    const [isInMoveMode, setIsInMoveMode] = useState(false);
  
    const handleMove = () => {
      console.log("sc:" + selectedColumn);
      if (selectedColumn != null) {
        const movingImage = events[`image${selectedColumn}`];
        if (movingImage) {
          setSelectedImage(movingImage);
          setIsInMoveMode(true);
          setTimeout(() => setIsPopupMode(false), 10);
        }
      }
    };

    const sortAlgorithm = (Column) => {
      setImageRow((prevImageRow) => {
        setEvents(() => {
              const updatedEvent = { ...events };
              updatedEvent[`image${prevImageRow}`] = events[`image${Column}`];
              if (Number(imageRow) != Number(Column)) {
                updatedEvent[`image${Column}`] = '';
              }
              return updatedEvent;
            }
        )
        return prevImageRow + 1;
      })
    }

    const hasRun = useRef(false);
    
      useEffect(() => {
        if (hasRun.current) return;
        hasRun.current = true;
    
            column.forEach((Column) => {
              if (events[`image${Column}`] !== "") {
                sortAlgorithm(Column);
              }
          })
      }, []);

  return (
    <div className="imageS-main-container">
      <div className="imageS-header">
        <h1 className="imageS-title">Event Name</h1>
        <button
          className="imageS-go-back-button"
          onClick={() => navigate("/committee/image-management")}
        >
          Go Back
        </button>
      </div>

      <div className="imageS-container">
      {isPopupMode && (
          <div className="imageM-popup">
            <button className="imageM-close-button" onClick={handleClose}>
              Close
            </button>
            <div className="imageM-button-splitter">
              <div className="imageM-preview-image">
                <img src={currentPreview} />
              </div>
              <div className="imageM-button-container">
            <button className="imageM-popup-button" onClick={() => document.getElementById('fileInput').click()}>
            Import
            </button>
              <input
              id="fileInput"
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/svg+xml,image/webp"
              onChange={handleImport}
              style={{ display: 'none' }}
            />
                <button className="imageM-popup-button" onClick={() => window.location.href="/committee/image-management-single"}>
                  Detail
                </button>
                <button className="imageM-popup-button" onClick={() => window.location.href="/committee/image-management-edit"}>
                  Edit
                </button>
                <button className="imageM-popup-button" 
                onClick={handleMove}
                disabled={!events?.[`image${selectedColumn}`]}
                >
                  Move
                </button>
                <button className="imageM-popup-button" onClick={handleDelete}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
        <div className="imageS-card" onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '600px' }}>
          {/* Container for the two smaller cards */}
          <div className="imageS-small-card-container">
            {/* First smaller card */}
            <div className="imageS-small-card">
              <div className="imageS-actions">
                {column.slice(0,4).map((Column) => (
                  <button
                    key={Column}
                    className={`imageS-box-button ${
                      imageRow !== Column
                        ? imageRow < Column
                          ? 'hide'
                          : Column == 0
                            ? 'thumbnail'
                            : ''
                        : 'add'
                    }`}
                    disabled={imageRow < Column || isPopupMode}
                    onClick={
                      imageRow !== Column
                        ? !isPopupMode
                          ? () => handlePopup(Column)
                          : undefined
                        : () => setImageRow(imageRow + 1)
                    }
                  >
                    {(imageRow > Column) && (events[`image${Column}`].trim() !== "") && (<img src={events[`image${Column}`] }/>)}
                    {imageRow !== Column ? '' : '+'}
                  </button>
                ))}
              </div>
  
            </div>

            {/* Second smaller card */}
            <div className="imageS-small-card">
              <div className="imageS-actions">
                {column.slice(4).map((Column) => (
                  <button
                    key={Column}
                    className={`imageS-box-button ${
                      imageRow !== Column
                        ? imageRow < Column
                          ? 'hide'
                          : ''
                        : 'add'
                    }`}
                    disabled={imageRow < Column || isPopupMode}
                    onClick={
                      imageRow !== Column
                        ? !isPopupMode
                          ? () => handlePopup(Column)
                          : undefined
                        : () => setImageRow(imageRow + 1)
                    }
                  >
                    {(imageRow > Column) && (events[`image${Column}`].trim() !== "") && (<img src={events[`image${Column}`] }/>)}
                    {imageRow !== Column ? '' : '+'}
                  </button>
                ))}
              </div>

            </div>
          </div>

          {/* Update button remains at the bottom */}
          <button type="submit" className="imageS-update-button">
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageSEvents;