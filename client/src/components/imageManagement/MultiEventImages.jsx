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

  const handleImport = (event) => {
    const file = event.target.files[0];
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/svg+xml', 'image/webp'];
  
    if (file && validTypes.includes(file.type)) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newImage = e.target.result;
        
        setEvents((prevEvents) =>
          prevEvents.map((ev) => {
            if (ev.row === selectedRow) {
              return {
                ...ev,
                [`image${selectedColumn}`]: newImage, // Set the new image in the correct column
              };
            }
            return ev;
          })
        );
  
        setTimeout(() => {
          setIsPopupMode(false);
          setSelectedRow(null);
          setSelectedColumn(null);
          setCurrentPreview(null);
        }, 10);
      };
      reader.readAsDataURL(file);
    } else {
      alert('Please choose a correct file format (JPG, PNG, JPEG, SVG, WEBP).');
    }
  };

  const handleDelete = () => {
    setEvents((prevEvents) =>
      prevEvents.map((event) =>
        event.row === selectedRow && selectedColumn != '0' 
          ? {
              ...event,
              [`image${selectedColumn}`]: '', // Set the specific image to an empty string
            }
          : event
      )
    );
    setIsPopupMode(false); // Close the popup after deletion
    setSelectedRow(null); // Reset selectedRow
    setSelectedColumn(null); // Reset selectedColumn
  };

  const totalPages = 10;
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
      handleTargetSelection(event, column); // If in move mode, move the image
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

  const handleTargetSelection = (event, column) => {
    if (isInMoveMode && selectedImage !== null) {
      const sourceRow = selectedRow;
      const targetRow = event.row;
      const sourceColumn = selectedColumn;
      const targetColumn = column;
  
      setEvents((prevEvents) => {
        // Create a new copy of the events array
        const newEvents = prevEvents.map(ev => ({ ...ev }));
  
        if (sourceRow === targetRow) {
          // Same row: swap the images between source and target columns
          newEvents.forEach(ev => {
            if (ev.row === sourceRow) {
              const temp = ev[`image${sourceColumn}`];
              ev[`image${sourceColumn}`] = ev[`image${targetColumn}`];
              ev[`image${targetColumn}`] = temp;
            }
          });
        } else {
          // Cross-row move/swap:
          const sourceEvent = newEvents.find(ev => ev.row === sourceRow);
          const targetEvent = newEvents.find(ev => ev.row === targetRow);
          if (sourceEvent && targetEvent) {
            if (targetEvent[`image${targetColumn}`] === "") {
              // Move: place selected image in target and clear source
              targetEvent[`image${targetColumn}`] = selectedImage;
              sourceEvent[`image${sourceColumn}`] = "";
            } else {
              // Swap: exchange images between source and target
              const temp = targetEvent[`image${targetColumn}`];
              targetEvent[`image${targetColumn}`] = selectedImage;
              sourceEvent[`image${sourceColumn}`] = temp;
            }
          }
        }
        return newEvents;
      });
  
      // Reset move mode state after the move/swap
      setIsInMoveMode(false);
      setSelectedImage(null);
      setIsPopupMode(false);
    }
  };

  const [selectedImage, setSelectedImage] = useState(null); // Track the selected image
  const [targetImage, setTargetImage] = useState(null); // Track the target image (where to move)
  const [isInMoveMode, setIsInMoveMode] = useState(false); // Track if we're in move mode

  const handleMove = () => {
    if (selectedRow !== null && selectedColumn !== null) {
      const movingImage = events.find(ev => ev.row === selectedRow)?.[`image${selectedColumn}`];
      if (movingImage) {
        setSelectedImage(movingImage);
        setIsInMoveMode(true);
        setTimeout(() => setIsPopupMode(false), 10); // Delay popup close slightly
      }
    }
  };
  

  const sortAlgorithm = (event, Column) => {
    setImageRow((prev) => {
      const openSpot = prev[event.row];
      setEvents((prevEvents) =>
        prevEvents.map((ev) => {
          if (ev.row === event.row) {
            const updatedEvent = { ...ev };
            if (updatedEvent[`image${openSpot}`] === "") {
              updatedEvent[`image${openSpot}`] = ev[`image${Column}`];
              if (Number(prev[event.row]) !== Number(Column)) {
                  updatedEvent[`image${Column}`] = '';
              }
          }

            return updatedEvent;
          }
          return ev;
        })
      );
      return {
        ...prev,
        [event.row]: prev[event.row] + 1
      }
    })
  }

  const hasRun = useRef(true);

  const fetchImages = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
      const response = await fetch(`${apiUrl}/image-management/`);
      if (!response.ok) {
      throw new Error('Failed to fetch images');
      }
      const data = await response.json();
      setEvents(prevEvents => 
        prevEvents.map(event => {
          const clearedEvent = { ...event };
          for (let i = 0; i < 8; i++) {
            clearedEvent[`image${i}`] = "";
          }
          return clearedEvent;
        })
      );
      setEvents((prevEvents) =>
        prevEvents.map((event) => {
          const newEvent = { ...event };
          data.forEach((fetchedEvent) => {
            if (fetchedEvent.eventName === event.title) {
              column.forEach((Column) => {  
                if (Column == (fetchedEvent["position"] - 1)) {
                  newEvent[`image${Column}`] = fetchedEvent["URL"];
                  newEvent[`imageId${Column}`] = fetchedEvent["id"];
                }
              });
            }
          });
          return newEvent;
        })
      );
      hasRun.current = false
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  }

  useEffect(() => {
    fetchImages();
  }, []);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

      events.forEach((event) => {
        column.forEach((Column) => {
          if (event[`image${Column}`] !== "") {
            sortAlgorithm(event, Column);
          }
      })
    });
  }, [events]);

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
                <img src={currentPreview[`image${selectedColumn}`]} />
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
        {events.map((event) => (
          <div className="imageM-card" key={event.row}>
            <div className="imageM-image">
              <img src={event.image0}/>
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
                    {(imageRow[event.row] > Column) && (event[`image${Column}`].trim() !== "") && (<img src={event[`image${Column}`] }/>)}
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