import React, { useEffect, useState, useRef } from 'react';
import './MultiEventImages.css';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';


const ImageMEvents = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPreview, setCurrentPreview] = useState(null);
  const [isPopupMode, setIsPopupMode] = useState(false);
  const [imageRow, setImageRow] = useState({
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  });
  const column = [0, 1, 2, 3, 4, 5, 6, 7];
  const [events, setEvents] = useState([
    {
      row: 1,
      title: 'Picnic',
      image0: '/assets/images/social.jpeg',
      image1: '/assets/images/paws.jpeg',
      image2: '/assets/images/mun.jpg',
      image3: '/assets/images/panda.jpg',
      image4: '',
      image5: '',
      image6: '/assets/images/president.jpg',
      image7: ''
    },
    {
      row: 2,
      title: 'Zoo',
      image0: '/assets/images/paws.jpeg',
      image1: '',
      image2: '',
      image3: '',
      image4: '/assets/images/panda.jpg',
      image5: '',
      image6: '',
      image7: ''
    },
    {
      row: 3,
      title: 'Social gathering',
      image0: '/assets/images/mun.jpg',
      image1: '',
      image2: '',
      image3: '',
      image4: '',
      image5: '',
      image6: '',
      image7: ''
    },
    {
      row: 4,
      title: 'Event 4',
      image0: '/assets/images/picnic.webp',
      image1: '',
      image2: '/assets/images/president.jpg',
      image3: '',
      image4: '',
      image5: '',
      image6: '',
      image7: ''
    },
    {
      row: 5,
      title: 'Event 5',
      image0: '/assets/images/dance.jpeg',
      image1: '',
      image2: '',
      image3: '',
      image4: '',
      image5: '',
      image6: '',
      image7: ''
    },
  ]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedColumn, setSelectedColumn] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";
  const [user, setUser] = useState(null);
  const canvasRefs = useRef([]);
  const renderImage = (eventIndex, col) => {
    let event = null
    let canvas = null;
    if (eventIndex == 9) {
      eventIndex = selectedRow - 1;
      event = events[eventIndex];
      canvas = canvasRefs.current[99];
      col = selectedColumn;
    } else {
      event = events[eventIndex];
      canvas = canvasRefs.current[event.row * 10 + col];
    }
    if (col == 9) {
      col = 0;
    }
    if (!canvas || !event[`image${col}`]) return;

    const canvasCtx = canvas?.getContext("2d");
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = `${API_URL}${event[`image${col}`]}`;
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      canvasCtx.filter = `
        brightness(${event[`imageBr${col}`]}%) 
        saturate(${event[`imageSa${col}`]}%) 
        blur(${event[`imageBl${col}`]}px) 
        invert(${event[`imageIn${col}`]}%)`;
      canvasCtx.drawImage(img, 0, 0);
    };
  };
  const handleImport = async (event) => {
    const file = event.target.files?.[0]; 

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/svg+xml', 'image/webp'];

    if (!file || !validTypes.includes(file.type)) {
      alert('Please select a correct file format (jpeg, jpg, png, svg, webp).');
      return;
    }

    const formData = new FormData();
    formData.append("image", file);
    formData.append('eventType', events.find(ev => ev.row === selectedRow)?.eventType);
    formData.append("eventName", events.find(ev => ev.row === selectedRow)?.title);
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
      setCurrentPreview(null);
      setSelectedRow(null);
      setSelectedColumn(null);

      fetchImages();
    } catch (error) {
      console.error("Upload image error:", error);
    }
  };

  const handleDelete = async () => {
    setEvents((prevEvents) =>
      prevEvents.map((event) =>
        event.row === selectedRow && selectedColumn != '0' 
          ? {
              ...event,
              [`image${selectedColumn}`]: '',
            }
          : event
      )
    );
    try {
      const imageId = currentPreview[`imageId${selectedColumn}`];
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
      setCurrentPreview(null);
      setSelectedRow(null);
      setSelectedColumn(null);

      fetchImages();
    } catch (error) {
      console.error("Delete image error:", error);
    }
  };

  const totalPages = Math.max(Math.ceil(events.length / 5), 5);
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleClose = () => {
    setIsPopupMode(false);
    setCurrentPreview(null);
    setSelectedRow(null);
    setSelectedColumn(null);
  };

  const handlePopup = (event, column) => {
    if (isInMoveMode && selectedImage) {
      handleTargetSelection(event, column);
    } else {
      if (isPopupMode) {
        setIsPopupMode(false);
        setTimeout(() => {
          openPopup(event, column);
        }, 10);
      } else {
        openPopup(event, column);
      }
    }
  };
  
  const openPopup = (event, column) => {
    setCurrentPreview(event);
    setSelectedRow(event.row);
    setSelectedColumn(column);
    setIsPopupMode(true);
  };

  const handleTargetSelection = async (event, column) => {
    if (isInMoveMode && selectedImage !== null) {
      const sourceRow = selectedRow;
      const targetRow = event.row;
      const sourceColumn = selectedColumn;
      const targetColumn = column;
  
      /*frontend render
      setEvents((prevEvents) => {
        const newEvents = prevEvents.map(ev => ({ ...ev }));
  
        if (sourceRow === targetRow) {
          newEvents.forEach(ev => {
            if (ev.row === sourceRow) {
              const temp = ev[`image${sourceColumn}`];
              ev[`image${sourceColumn}`] = ev[`image${targetColumn}`];
              ev[`image${targetColumn}`] = temp;
            }
          });
        } else {
          const sourceEvent = newEvents.find(ev => ev.row === sourceRow);
          const targetEvent = newEvents.find(ev => ev.row === targetRow);
          if (sourceEvent && targetEvent) {
            if (targetEvent[`image${targetColumn}`] === "") {
              targetEvent[`image${targetColumn}`] = selectedImage;
              sourceEvent[`image${sourceColumn}`] = "";
            } else {
              const temp = targetEvent[`image${targetColumn}`];
              targetEvent[`image${targetColumn}`] = selectedImage;
              sourceEvent[`image${sourceColumn}`] = temp;
            }
          }
        }
        return newEvents;
      });*/
      
      const sourceEvent = events.find(ev => ev.row === sourceRow);
      const targetEvent = events.find(ev => ev.row === targetRow);
      const sourceImageId = sourceEvent[`imageId${sourceColumn}`];
      const targetImageId = targetEvent[`imageId${targetColumn}`];

      try {
        if (sourceImageId) {
          const response = await fetch(`${API_URL}/image-management/${sourceImageId}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              imageId: sourceImageId,
              eventName: targetEvent.title,
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
              eventName: sourceEvent.title,
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
    if (selectedRow !== null && selectedColumn !== null) {
      const movingImage = events.find(ev => ev.row === selectedRow)?.[`image${selectedColumn}`];
      if (movingImage) {
        setSelectedImage(movingImage);
        setIsInMoveMode(true);
        setTimeout(() => setIsPopupMode(false), 10);
      }
    }
  };

  const hasRun = useRef(false);

  const fetchImages = async () => {
    try {
      const user = JSON.parse(sessionStorage.getItem("user"));
      setUser(user);
      try {
        if (user.role == "admin") {
          const response = await fetch(`${API_URL}/external-events/`);
          if (!response.ok) {
            throw new Error('Failed to fetch external events');
          }
          const data = await response.json();

          const externalEvents = data.map((event, index) => ({
            row: index + 1,
            title: event.external_event_name,
            eventType: "External", 
            ...Object.fromEntries([...Array(8)].map((_, i) => [`image${i}`, ""]))
          }));

          setEvents(externalEvents);

        }
        const response = await fetch(`${API_URL}/image-management/`);
        if (!response.ok) {
        throw new Error('Failed to fetch images');
        }
        const data = await response.json();
        setEvents(prevEvents => 
          prevEvents.map(event => {
            const clearedEvent = { ...event };
            for (let i = 0; i <= 7; i++) {
              clearedEvent[`image${i}`] = "";
              clearedEvent[`imageId${i}`] = "";
              clearedEvent[`imageBr${i}`] = "";
              clearedEvent[`imageSa${i}`] = "";
              clearedEvent[`imageBl${i}`] = "";
              clearedEvent[`imageIn${i}`] = "";
            }
            return clearedEvent;
          })
        );

        setEvents((prevEvents) => {
          const clearedEvents = prevEvents.map(event => {
            const cleared = { ...event };
            for (let i = 0; i <= 7; i++) cleared[`image${i}`] = "";
            return cleared;
          });
          const updatedEvents = clearedEvents.map(event => {
            const updated = { ...event };
            data.forEach(fetched => {
              if (fetched.eventName === event.title) {
                const col = fetched.position - 1;
                if (col >= 0 && col <= 7) {
                  updated[`image${col}`] = fetched.URL;
                  updated[`imageId${col}`] = fetched.id;
                  updated[`imageBr${col}`] = fetched.brightness;
                  updated[`imageSa${col}`] = fetched.saturation;
                  updated[`imageBl${col}`] = fetched.blur;
                  updated[`imageIn${col}`] = fetched.inversion;
                }
              }
            });
            return updated;
          });
          /*const newImageRow = {};
          const sorted = updatedEvents.map(ev => {
            const e = { ...ev };
            let insertIndex = 0;
            for (let col = 0; col <= 7; col++) {
              const img = e[`image${col}`];
              if (img !== "") {
                if (insertIndex !== col) {
                  e[`image${insertIndex}`] = img;
                  e[`image${col}`] = "";
                }
                insertIndex++;
              }
            }
            newImageRow[ev.row] = insertIndex;
            return e;
          });
          setImageRow(newImageRow);
          return sorted;*/
          const newImageRow = {};
          updatedEvents.forEach(ev => {
            let highestColWithImage = -1;
            for (let col = 0; col <= 7; col++) {
              if (ev[`image${col}`] && ev[`image${col}`] !== "") {
                highestColWithImage = col;
              }
            }
            newImageRow[ev.row] = highestColWithImage + 1;
          });
          setImageRow(newImageRow);
          return updatedEvents;
        });
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  }

  useEffect(() => {
    if (selectedRow !== null && selectedColumn !== null) {
      renderImage(9, 9);
    }
  }, [selectedRow, selectedColumn]);

  useEffect(() => {
    events.forEach((event, rowIndex) => {
      column.forEach((col) => {
        if (event[`image${col}`]) {
          renderImage(rowIndex, col);
          if (col == 0) {
            renderImage(rowIndex, 9);
          }
        }
      });
    });
    if (hasRun.current) return;
    hasRun.current = true;
    fetchImages();
  }, [events, currentPage]);

  return (
    <main className="imageM-main-container">
      <div className="imageM-header">
        <h1 className="imageM-heading">Events Image Management</h1>
      </div>
      <div className="imageM-container">
        {isPopupMode && (
          <div className="imageM-popup">
            <button className="imageM-close-button" onClick={handleClose}>
              Close
            </button>
            <div className="imageM-button-splitter">
              <div className="imageM-preview-image">
              <canvas id="canvas" ref={(el) => canvasRefs.current[99] = el} /*<img src={`${API_URL}${currentPreview[`image${selectedColumn}`]}`}*/ />
              </div>
              <div className="imageM-button-container">
            <button className="imageM-popup-button" onClick={() => document.getElementById('fileInputImage').click()}>
            Import
            </button>
              <input
              id="fileInputImage"
              type="file"
              name="image"
              accept="image/jpeg,image/jpg,image/png,image/svg+xml,image/webp"
              onChange={async (e) => {
                await handleImport(e);
                e.target.value = null;
              }}
              style={{ display: 'none' }}
            />
                <button className="imageM-popup-button" onClick={() => {
                const imageId = currentPreview[`imageId${selectedColumn}`];
                window.location.href=`/committee/image-management-edit?id=${imageId}`
                }}>
                  Edit
                </button>
                <button className="imageM-popup-button" 
                onClick={handleMove}
                disabled={!events.find(ev => ev.row === selectedRow)?.[`image${selectedColumn}`]}
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
        {events.slice((0 + (currentPage - 1) * 5), (5 + (currentPage - 1) * 5)).map((event) => (
          <div className="imageM-card" key={event.row}>
            <div className="imageM-image">
              <canvas id="canvas" ref={(el) => canvasRefs.current[event.row * 10 + 9] = el} /*<img src={`${API_URL}${event.image0}` || event.image0}/>*//>
            </div>
            <div>
              <h2 className="imageM-title">{event.title}</h2>
              <div className="imageM-actions">
                {column.map((Column) => (
                  <button
                    key={Column}
                    className={`imageM-box-button ${
                      imageRow[event.row] !== Column
                        ? imageRow[event.row] < Column
                          ? 'hide'
                          : Column == 0
                            ? 'thumbnail'
                            : ''
                        : 'add'
                    }`}
                    disabled={imageRow[event.row] < Column || isPopupMode}
                    onClick={
                      imageRow[event.row] !== Column
                        ? !isPopupMode
                          ? () => handlePopup(event, Column)
                          : undefined
                        : () =>
                            setImageRow((prev) => ({
                              ...prev,
                              [event.row]: prev[event.row] + 1,
                            }))
                    }
                  >
                    {(imageRow[event.row] > Column) && (event[`image${Column}`].trim() !== "") && (<canvas id="canvas" ref={(el) => canvasRefs.current[event.row * 10 + Column] = el}></canvas>/*<img src={`${API_URL}${event[`image${Column}`]}` || event[`image${Column}`]}/>*/)}
                    {imageRow[event.row] !== Column ? '' : '+'}
                  </button>
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
        className={`imageM-pagination-number ${currentPage === Math.min(Math.max(1, currentPage - 2), totalPages - 4) ? 'active' : ''}`}
        onClick={() => onPageChange(Math.min(Math.max(1, currentPage - 2), totalPages - 4))}
      >
        {Math.min(Math.max(1, currentPage - 2), totalPages - 4)}
      </button>

      <button
        className={`imageM-pagination-number ${currentPage === Math.min(Math.max(2, currentPage - 1), totalPages - 3) ? 'active' : ''}`}
        onClick={() => onPageChange(Math.min(Math.max(2, currentPage - 1), totalPages - 3))}
      >
        {Math.min(Math.max(2, currentPage - 1), totalPages - 3)}
      </button>

      <button
        className={`imageM-pagination-number ${currentPage === Math.min(Math.max(3, currentPage), totalPages - 2) ? 'active' : ''}`}
        onClick={() => onPageChange(Math.min(Math.max(3, currentPage), totalPages - 2))}
      >
        {Math.min(Math.max(3, currentPage), totalPages - 2)}
      </button>

      <button
        className={`imageM-pagination-number ${currentPage === Math.min(Math.max(4, currentPage + 1), totalPages - 1) ? 'active' : ''}`}
        onClick={() => onPageChange(Math.min(Math.max(4, currentPage + 1), totalPages - 1))}
      >
        {Math.min(Math.max(4, currentPage + 1), totalPages - 1)}
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

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught in ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong. Please try again.</h1>;
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <ImageMEvents />
    </ErrorBoundary>
  );
}