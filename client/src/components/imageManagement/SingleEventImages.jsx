import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import './SingleEventImages.css';

const ImageSEvents = () => {//This is for creating image the first time
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const event_name = queryParams.get("name");
  const event_type = queryParams.get("type"); //internal or external
  const navigate = useNavigate();
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
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";
    const canvasRefs = useRef([]);
    const renderImage = (mode, col) => {
      const canvas = canvasRefs.current[mode * 10 + col];
      if (col == 9) {
        col = selectedColumn;
      }
      if (!canvas || !events[`image${col}`]) return;
  
      const canvasCtx = canvas?.getContext("2d");
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = `${API_URL}${events[`image${col}`]}`;
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        canvasCtx.filter = `
          brightness(${events[`imageBr${col}`]}%) 
          saturate(${events[`imageSa${col}`]}%) 
          blur(${events[`imageBl${col}`]}px) 
          invert(${events[`imageIn${col}`]}%)`;
        canvasCtx.drawImage(img, 0, 0);
      };
    };
  
    const handleImport = async (event) => {
      const file = event.target.files[0];

      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/svg+xml', 'image/webp'];
    
      if (!file || !validTypes.includes(file.type)) {
        alert('Please select a correct file format (jpeg, jpg, png, svg, webp).');
        return;
      }

      const formData = new FormData();
      formData.append("image", file);
      formData.append('eventType', event_type);
      formData.append("eventName", event_name);
      formData.append("position", selectedColumn + 1);

      try {
        const response = await fetch(`${API_URL}/image-management/`, {
          method: "POST",
          body: formData,
        });
  
        if (!response.ok) {
          throw new Error('Failed to upload image');
        }
  
        setIsPopupMode(false);
        setSelectedColumn(null);
  
        fetchImages();
      } catch (error) {
        console.error("Upload image error:", error);
      }
    };
  
    const handleDelete = async () => {
      setEvents(() =>
          selectedColumn != '0' 
            ? {
                ...events,
                [`image${selectedColumn}`]: '',
              }
            : events
      );
      try {
        const imageId = events[`imageId${selectedColumn}`];
        if (!imageId) {
          alert("No image to delete.");
          return;
        }
        const response = await fetch(`${API_URL}/image-management/${imageId}`, {
          method: "DELETE",
        });
  
        if (!response.ok) {
          throw new Error('Failed to delete image');
        }
  
        setIsPopupMode(false);
        setSelectedColumn(null);
  
        fetchImages();
      } catch (error) {
        console.error("Delete image error:", error);
      }
    };

    const handleClose = () => {
      setIsPopupMode(false);
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
      setSelectedColumn(column);
      setIsPopupMode(true);
    };
  
    const handleTargetSelection = async (column) => {
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

        const sourceImageId = events[`imageId${sourceColumn}`];
        const targetImageId = events[`imageId${targetColumn}`];
  
        try {
          if (sourceImageId) {
            const response = await fetch(`${API_URL}/image-management/${sourceImageId}`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                imageId: sourceImageId,
                eventName: event_name,
                position: targetColumn + 1,
              })
            });
      
            if (!response.ok) {
              throw new Error("Failed to update source position in the database");
            }
          };
      
          if (targetImageId) {
            const response = await fetch(`${API_URL}/image-management/${targetImageId}`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                imageId: targetImageId,
                eventName: event_name,
                position: sourceColumn + 1,
              })
            });
      
            if (!response.ok) {
              throw new Error("Failed to update target position in the database");
            }
          }
      
        } catch (err) {
          console.error("Move image failed:", err);
          alert("Image move failed.");
        }

        setIsInMoveMode(false);
        setSelectedImage(null);
        setIsPopupMode(false);

        await fetchImages();
      }
    };

    const [selectedImage, setSelectedImage] = useState(null);
    const [isInMoveMode, setIsInMoveMode] = useState(false);
  
    const handleMove = () => {
      if (selectedColumn != null) {
        const movingImage = events[`image${selectedColumn}`];
        if (movingImage) {
          setSelectedImage(movingImage);
          setIsInMoveMode(true);
          setTimeout(() => setIsPopupMode(false), 10);
        }
      }
    };

    const fetchImages = async () => {
      try {
        const response = await fetch(`${API_URL}/image-management/`);
        if (!response.ok) {
        throw new Error('Failed to fetch images');
        }
        const data = await response.json();
        const events = data.filter(fetched => fetched.eventName === event_name);

        const clearedEvent = {};
        for (let i = 0; i <= 7; i++) {
          clearedEvent[`image${i}`] = "";
          clearedEvent[`imageId${i}`] = "";
          clearedEvent[`imageBr${i}`] = "";
          clearedEvent[`imageSa${i}`] = "";
          clearedEvent[`imageBl${i}`] = "";
          clearedEvent[`imageIn${i}`] = "";
        };
  
        events.forEach(fetched => {
          const col = fetched.position - 1;
          if (col >= 0 && col <= 7) {
            clearedEvent[`image${col}`] = fetched.URL;
            clearedEvent[`imageId${col}`] = fetched.id;
            clearedEvent[`imageBr${col}`] = fetched.brightness;
            clearedEvent[`imageSa${col}`] = fetched.saturation;
            clearedEvent[`imageBl${col}`] = fetched.blur;
            clearedEvent[`imageIn${col}`] = fetched.inversion;
          }
        });
        
        let highestColWithImage = -1;
        for (let col = 0; col <= 7; col++) {
          if (clearedEvent[`image${col}`] && clearedEvent[`image${col}`] !== "") {
            highestColWithImage = col;
          }
        }

        setImageRow(highestColWithImage + 1);
        setEvents(clearedEvent);
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    }

    /*const sortAlgorithm = (Column) => {
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
    }*/

    const hasRun = useRef(false);

    useEffect(() => {
      if (selectedColumn !== null) {
        renderImage(2, 9);
      }
    }, [selectedColumn]);

    useEffect(() => {
      column.forEach((col) => {
        if (events[`image${col}`]) {
          renderImage(1, col);
        }
      });
      if (hasRun.current) return;
      hasRun.current = true;
      fetchImages();
    }, [events]);

  return (
    <div className="imageS-main-container">
      <div className="imageS-header">
        <h1 className="imageS-title">Event Name</h1>
        <button
          className="imageS-go-back-button"
          onClick={() => navigate(-1)}
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
                <canvas ref={(el) => canvasRefs.current[29] = el} />
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
                <button className="imageM-popup-button" onClick={() => window.location.href=`/committee/image-management-edit?id=${events[`imageId${selectedColumn}`]}`}>
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
          <div className="imageS-small-card-container">
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
                    {(imageRow > Column) && (events[`image${Column}`].trim() !== "") && (<canvas ref={(el) => canvasRefs.current[10 + Column] = el}/>)}
                    {imageRow !== Column ? '' : '+'}
                  </button>
                ))}
              </div>
  
            </div>

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
                    {(imageRow > Column) && (events[`image${Column}`].trim() !== "") && (<canvas ref={(el) => canvasRefs.current[10 + Column] = el}/>)}
                    {imageRow !== Column ? '' : '+'}
                  </button>
                ))}
              </div>

            </div>
          </div>

          <button type="submit" className="imageS-update-button">
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageSEvents;