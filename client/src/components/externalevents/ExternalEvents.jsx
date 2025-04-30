import { useState, useEffect } from 'react';
import './ExternalEvents.css';
import {
	FaTimes,
	FaSearch,
	FaFilter,
	FaBell,
	FaChevronLeft,
	FaChevronRight,
	FaTrash,
	FaEdit,
	FaPencilAlt
} from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';

const formatTimestamp = (timestamp) => {
	if (!timestamp) return "";

	try {
		const date = new Date(timestamp);

		if (isNaN(date.getTime())) {
			return timestamp;
		}
		const hours = date.getHours();
		const minutes = date.getMinutes();
		const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

		return formattedTime;
	} catch (error) {
		console.error("Error formatting timestamp:", error);
		return timestamp;
	}
};

const formatDate = (timestamp) => {
	if (!timestamp) return "";

	try {
		const date = new Date(timestamp);

		if (isNaN(date.getTime())) {
			return timestamp;
		}

		const day = date.getDate();
		const month = date.toLocaleString('default', { month: 'long' });
		const year = date.getFullYear();

		return `${day} ${month} ${year}`;
	} catch (error) {
		console.error("Error formatting date:", error);
		return timestamp;
	}
};

const Pagination = ({ totalPages, currentPage, onPageChange }) => {
	const isFirstPage = currentPage === 1;
	const isLastPage = currentPage === totalPages;

	return (
		<div className="pagination">
			<button
				className={`pagination-arrow ${isFirstPage ? 'disabled' : ''}`}
				onClick={() => !isFirstPage && onPageChange(currentPage - 1)}
				aria-label="Previous page"
			>
				<FaChevronLeft />
			</button>

			<button
				className={`pagination-number ${currentPage === 1 ? 'active' : ''}`}
				onClick={() => onPageChange(1)}
			>
				1
			</button>

			<span className="pagination-ellipsis">...</span>

			<button
				className={`pagination-number ${currentPage === totalPages ? 'active' : ''}`}
				onClick={() => onPageChange(totalPages)}
			>
				{totalPages}
			</button>

			<button
				className={`pagination-arrow ${isLastPage ? 'disabled' : ''}`}
				onClick={() => !isLastPage && onPageChange(currentPage + 1)}
				aria-label="Next page"
			>
				<FaChevronRight />
			</button>
		</div>
	);
};

const ExternalEvents = () => {
	const [currentPage, setCurrentPage] = useState(1);
	const [isFormVisible, setIsFormVisible] = useState(false);
	const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
	const [user, setUser] = useState(null);
	const [isEditMode, setIsEditMode] = useState(false);
	const [isEditFormVisible, setIsEditFormVisible] = useState(false);
	const [currentEditEvent, setCurrentEditEvent] = useState(null);
	const [events, setEvents] = useState([]);
	const [loading, setLoading] = useState(true);
	const [refresh, setRefresh] = useState(false);
	const [selectedCategory, setSelectedCategory] = useState('');
	const [selectedEventId, setSelectedEventId] = useState(null);
	const [isEventFullModalVisible, setIsEventFullModalVisible] = useState(false);
	const [isUnfollowModalVisible, setIsUnfollowModalVisible] = useState(false);
	const [followedEvents, setFollowedEvents] = useState([]);
	const [searchQuery, setSearchQuery] = useState('');
	const itemsPerPage = 4;
	const location = useLocation();
	const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

	const filteredEvents = events.filter((event) => {
		if (selectedCategory && event.external_event_category !== selectedCategory) {
			return false;
		}
		
		if (searchQuery) {
			const query = searchQuery.toLowerCase();
			
			const eventDate = event.external_event_date ? new Date(event.external_event_date).toLocaleDateString('en-US', {
				year: 'numeric',
				month: 'long',
				day: 'numeric',
			}).toLowerCase() : '';
			
			const eventTime = event.external_event_time ? new Date(event.external_event_time).toLocaleTimeString('en-US', {
				hour: 'numeric',
				minute: '2-digit',
				hour12: true,
			}).toLowerCase() : '';

			const numericDate = event.external_event_date ? new Date(event.external_event_date).toLocaleDateString('en-US', {
				year: 'numeric',
				month: '2-digit',
				day: '2-digit',
			}).toLowerCase() : '';

			const time24Hour = event.external_event_time ? new Date(event.external_event_time).toLocaleTimeString('en-US', {
				hour: '2-digit',
				minute: '2-digit',
				hour12: false,
			}).toLowerCase() : '';

			return (
				event.external_event_name?.toLowerCase().includes(query) ||
				event.external_event_description?.toLowerCase().includes(query) ||
				event.external_event_location?.toLowerCase().includes(query) ||
				eventDate.includes(query) ||
				eventTime.includes(query) ||
				numericDate.includes(query) ||
				time24Hour.includes(query)
			);
		}
		
		return true;
	});

	const startIndex = (currentPage - 1) * itemsPerPage;
	const endIndex = startIndex + itemsPerPage;


	const paginatedEvents = filteredEvents.slice(startIndex, endIndex);


	const navigate = useNavigate();

	const dummyEvents = [
		{
			id: 1,
			title: "Student Rep Social",
			image: "/assets/images/social.jpeg",
			description: "Join our Student Rep Social Event to connect, share ideas, and collaborate on making student life better.",
			location: "Second floor quiet room",
			time: "15:30-17:00",
			deadline: "15/02/2025",
			date: "20/February/2025",
			capacity: "150 people",
			price: "10 AED/-",
			team: [
				{ role: "Organizer", name: "Bob White" },
				{ role: "Co-Organizer", name: "David Pinkman" },
				{ role: "Manager", name: "Jake Schrader" },
				{ role: "Speaker", name: "Kanye Goodman" }
			],
			category: "SOCIAL_GATHERING"
		},
		{
			id: 2,
			title: "UoBDMUN'25 Conference",
			image: "/assets/images/mun.jpg",
			description: "A dynamic conference where delegates engage in impactful debates, tackle global issues, and refine their diplomacy skills.",
			location: "Main auditorium",
			time: "12:00-14:00",
			deadline: "15/02/2025",
			date: "25/February/2025",
			capacity: "200 people",
			price: "15 AED/-",
			team: [
				{ role: "Organizer", name: "John Smith" },
				{ role: "Co-Organizer", name: "Emily Davis" },
				{ role: "Manager", name: "Michael Johnson" },
				{ role: "Speaker", name: "Sarah Williams" }
			],
			category: "NETWORKING"
		},
		{
			id: 3,
			title: "Intra-Uni Dance Competition",
			image: "/assets/images/dance.jpeg",
			description: "Show off your moves, compete with the best, and set the stage on fire! Open to all university students.",
			location: "Second floor quiet room",
			time: "17:00-18:00",
			deadline: "15/02/2025",
			date: "01/March/2025",
			capacity: "100 people",
			price: "5 AED/-",
			team: [
				{ role: "Organizer", name: "Lisa Johnson" },
				{ role: "Co-Organizer", name: "Mark Brown" },
				{ role: "Manager", name: "Sophie Taylor" }
			],
			category: "SOCIAL_GATHERING"
		},
		{
			id: 4,
			title: "Matcha Morning",
			image: "/assets/images/matcha.webp",
			description: "Have a cup of matcha and join together for a discussion of your new year plan and meet new friends.",
			location: "First floor meeting room",
			time: "9:00-10:00",
			deadline: "15/02/2025",
			date: "05/March/2025",
			capacity: "50 people",
			price: "10 AED/-",
			team: [
				{ role: "Organizer", name: "James Wilson" },
				{ role: "Manager", name: "Emma Roberts" }
			],
			category: "SOCIAL_GATHERING"
		},
		{
			id: 5,
			title: "Plant and Animal Social",
			image: "/assets/images/paws.jpeg",
			description: "Come join us at the PAWS social to unwind with some games, connect with fellow students, and learn more about our society!",
			location: "Room 120B",
			time: "14:00-15:30",
			deadline: "15/02/2025",
			date: "10/March/2025",
			capacity: "75 people",
			price: "8 AED/-",
			team: [
				{ role: "Organizer", name: "Bob White" },
				{ role: "Co-Organizer", name: "David Pinkman" },
				{ role: "Manager", name: "Jake Schrader" },
				{ role: "Speaker", name: "Kanye Goodman" }
			],
			category: "SOCIAL_GATHERING"
		}
	];

	const EVENT_CATEGORIES = [
		"HACKATHON",
		"WORKSHOP",
		"NETWORKING",
		"CAREER",
		"SPORTS",
		"GUEST_LECTURE",
		"SOCIAL_GATHERING",
		"VOLUNTEERING"
	];

	const fetchEvents = async () => {
		try {
			const response = await fetch(`${API_URL}/external-events/`);
			if (!response.ok) {
				throw new Error('Failed to fetch external events');
			}
			const data = await response.json();
			
			const imgResponse = await fetch(`${API_URL}/image-management/`);
			if (!imgResponse.ok) {
				throw new Error('Failed to fetch images');
			}
			const imgData = await imgResponse.json();
			
			const extImages = imgData.filter(img => img.eventType === "External");
			
			const updatedEvents = data.map(event => {
				const eventImages = extImages.filter(img => img.eventName === event.external_event_name);
				const mainImage = eventImages.find(img => img.position === 1); // Get the first position image
				
				return {
					...event,
					image: mainImage ? mainImage.URL : null
				};
			});
			
			setEvents(updatedEvents);
		} catch (error) {
			console.error("Error fetching events:", error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchEvents();
	}, []);

	
	const promptLogin = () => {
		alert("Please log in to follow or view event details.");
		
	};


	useEffect(() => {
		const loadUserAndFollowedEvents = () => {
		  const storedUser = sessionStorage.getItem("user");
		  if (storedUser) {
			const parsedUser = JSON.parse(storedUser);
			setUser(parsedUser);
			const followed = JSON.parse(localStorage.getItem(`followedEvents_${parsedUser.id}`)) || [];
			setFollowedEvents(followed.map(Number)); // Ensure IDs are numbers
		  } else {
			setUser(null);
			setFollowedEvents([]);
		  }
		};
	
		loadUserAndFollowedEvents();
	
		const handleStorageChange = (e) => {
		  if (e.key === `followedEvents_${user?.id}`) {
			const followed = JSON.parse(localStorage.getItem(`followedEvents_${user?.id}`)) || [];
			setFollowedEvents(followed.map(Number));
		  }
		};
	
		window.addEventListener('storage', handleStorageChange);
		window.addEventListener('focus', loadUserAndFollowedEvents); 
	
		return () => {
		  window.removeEventListener('storage', handleStorageChange);
		  window.removeEventListener('focus', loadUserAndFollowedEvents);
		};
	  }, [location.pathname]);

	const totalPages = 2;
	const handlePageChange = (pageNumber) => {
		setCurrentPage(pageNumber);
	};

	useEffect(() => {
		setCurrentPage(1);
	  }, [selectedCategory]);
	  

	const handleFollowClick = (eventId) => {
		if (!user) {
		  promptLogin();
		  return;
		}
		setSelectedEventId(Number(eventId)); 
		setIsFormVisible(true);
	};

	const handleUnfollowClick = async (eventId) => {
		if (!user) {
		  promptLogin();
		  return;
		}
	
		const numericEventId = Number(eventId); 
	
		try {
		  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
		  const response = await fetch(`${apiUrl}/external-events/${numericEventId}/unfollow`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ eventId: numericEventId, userId: user.id }),
		  });
	
		  if (!response.ok) {
			const errorData = await response.json();
			throw new Error(`Failed to unfollow: ${errorData.error || 'Unknown error'}`);
		  }
	
		  const updatedEvent = await response.json();
		  setEvents(prevEvents =>
			prevEvents.map(event =>
			  event.external_event_id === numericEventId
				? { ...event, external_event_number_of_attendees: updatedEvent.external_event_number_of_attendees }
				: event
			)
		  );
		  setFollowedEvents(prev => {
			const updated = prev.filter(id => id !== numericEventId);
			localStorage.setItem(`followedEvents_${user.id}`, JSON.stringify(updated));
			return updated;
		  });
		  setIsUnfollowModalVisible(true);
		} catch (error) {
		  console.error('Error unfollowing event:', error);
		  alert(`Failed to unfollow: ${error.message}`);
		}
	  };

	const handleDetailClick = (eventId) => {
		navigate(`/external-events/${eventId}`);
	};

	const handleCloseForm = () => {
		setIsFormVisible(false);
	};

	const handleFormSubmit = async (e) => {
		e.preventDefault();
		if (!selectedEventId || !user) return;
	
		const numericEventId = Number(selectedEventId);
	
		const formData = {
		  name: e.target.name.value,
		  studentId: e.target.studentId.value,
		  year: e.target.year.value,
		  email: e.target.email.value,
		  userId: user.id,
		  eventId: numericEventId,
		};
	
		try {
		  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
		  const response = await fetch(`${apiUrl}/external-events/${numericEventId}/signup`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(formData),
		  });
	
		  if (!response.ok) {
			const errorData = await response.json();
			if (response.status === 400 && errorData.error === 'Event is full') {
			  setIsFormVisible(false);
			  setIsEventFullModalVisible(true);
			  return;
			}
			throw new Error(`Failed to sign up: ${errorData.error || 'Unknown error'}`);
		  }
	
		  const updatedEvent = await response.json();
		  setEvents(prevEvents =>
			prevEvents.map(event =>
			  event.external_event_id === numericEventId
				? { ...event, external_event_number_of_attendees: updatedEvent.external_event_number_of_attendees }
				: event
			)
		  );
		  setFollowedEvents(prev => {
			const updated = [...prev, numericEventId];
			localStorage.setItem(`followedEvents_${user.id}`, JSON.stringify(updated));
			return updated;
		  });
		  setIsFormVisible(false);
		  setIsSuccessModalVisible(true);
		} catch (error) {
		  console.error('Error signing up for event:', error);
		  alert(`Failed to sign up: ${error.message}`);
		}
	  };
	

	const handleCloseSuccessModal = () => {
		setIsSuccessModalVisible(false);
	};
	const handleCloseEventFullModal = () => {
		setIsEventFullModalVisible(false);
		setSelectedEventId(null);
	};
	const handleCloseUnfollowModal = () => setIsUnfollowModalVisible(false);

	const handleCreateEventClick = () => {
		navigate('/create-external-event');
	};

	const handleEditPageClick = () => {
		setIsEditMode(!isEditMode);
	};

	const handleDeleteEvent = async (id) => {
		if (window.confirm('Are you sure you want to delete this event?')) {
			try {
				console.log("Deleting event with ID:", id);
				const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
				const response = await fetch(`${apiUrl}/external-events/${id}`, {
					method: 'DELETE',
				});

				if (!response.ok) {
					throw new Error('Failed to delete event');
				}

				setEvents(prevEvents => {
					const updatedEvents = prevEvents.filter(event => event.external_event_id !== id);
					console.log("Updated events list:", updatedEvents);
					return updatedEvents;
				});


				alert('Event deleted successfully');
			} catch (error) {
				console.error('Error deleting event:', error);
				alert('Failed to delete event. Please try again.');
			}
		}
	};

	const handleEditIconClick = (event) => {
		console.log("Editing event:", event);

		const formattedEvent = {
			...event,

			// Main form fields
			title: event.external_event_name || event.title || '',
			date: event.external_event_date ? formatDate(event.external_event_date) : event.date || '',
			time: event.external_event_time ? formatTimestamp(event.external_event_time) : event.time || '',
			location: event.external_event_location || event.location || '',
			description: event.external_event_description || event.description || '',

			capacity: event.external_event_max_number_of_attendees?.toString() || event.capacity?.toString() || '',
			price: event.external_event_ticket_amount?.toString() || event.price?.toString() || '',
			category: event.external_event_category || event.category || '',

			external_event_name: event.external_event_name || event.title || '',
			external_event_date: event.external_event_date || event.date || '',
			external_event_time: event.external_event_time || event.time || '',
			external_event_location: event.external_event_location || event.location || '',
			external_event_description: event.external_event_description || event.description || '',

			external_event_capacity: event.external_event_max_number_of_attendees?.toString() || event.capacity?.toString() || '',
			external_event_price: event.external_event_ticket_amount?.toString() || event.price?.toString() || '',
			external_event_category: event.external_event_category || event.category || '',
			external_event_organizer: event.external_event_organizer || '',
			external_event_corganizer: event.external_event_corganizer || '',
			external_event_manager: event.external_event_manager || '',
			external_event_speaker: event.external_event_speaker || '',

			team: Array.isArray(event.team) ? event.team : [],
		};


		console.log("Formatted event for edit:", formattedEvent);

		setCurrentEditEvent(formattedEvent);
		setIsEditFormVisible(true);
	};


	const handleCloseEditForm = () => {
		setIsEditFormVisible(false);
		setCurrentEditEvent(null);
	};

	const handleEditFormChange = (field, value) => {
		setCurrentEditEvent({
			...currentEditEvent,
			[field]: value
		});
	};

	const handleTeamMemberChange = (index, field, value) => {
		const updatedTeam = [...currentEditEvent.team];
		updatedTeam[index] = {
			...updatedTeam[index],
			[field]: value
		};
		setCurrentEditEvent({
			...currentEditEvent,
			team: updatedTeam
		});
	};

	const handleEditFormSubmit = async (e) => {
		e.preventDefault();

		const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

		const updatedEvent = { ...currentEditEvent };

		try {
			if (updatedEvent.external_event_time && typeof updatedEvent.external_event_time === 'string') {
				if (/^\d{1,2}:\d{2}$/.test(updatedEvent.external_event_time)) {
					const [hours, minutes] = updatedEvent.external_event_time.split(':').map(Number);

					const timeDate = new Date();

					timeDate.setHours(hours, minutes, 0, 0);

					updatedEvent.external_event_time = timeDate.toISOString();
				}
			}

			if (updatedEvent.external_event_date && typeof updatedEvent.external_event_date === 'string') {
				const dateParts = updatedEvent.external_event_date.split(' ');
				if (dateParts.length === 3) {
					const day = parseInt(dateParts[0], 10);
					const month = dateParts[1]; // February
					const year = parseInt(dateParts[2], 10);

					const monthNames = ["January", "February", "March", "April", "May", "June",
						"July", "August", "September", "October", "November", "December"];
					const monthIndex = monthNames.findIndex(m => m === month);

					if (monthIndex !== -1 && !isNaN(day) && !isNaN(year)) {
						const dateObj = new Date(year, monthIndex, day);
						updatedEvent.external_event_date = dateObj.toISOString();
					}
				}
			}

			console.log("Sending updated event data:", updatedEvent);

			const response = await fetch(`${apiUrl}/external-events/${currentEditEvent.external_event_id}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(updatedEvent),
			});

			if (!response.ok) throw new Error("Failed to update event");

			const updatedEventData = await response.json();
			console.log("Event updated (from backend):", updatedEventData);

			setEvents(prevEvents =>
				prevEvents.map(event =>
					event.external_event_id === updatedEventData.external_event_id
						? updatedEventData
						: event
				)
			);

			setRefresh(prev => !prev);

			setIsEditFormVisible(false);
			setCurrentEditEvent(null);

			alert("Event updated successfully!");

		} catch (error) {
			console.error("Error updating event:", error);
			alert("Failed to update event. Please try again.");
		}
	};

	return (
		<main className="extevent-main-content">
			<div className="extevent-page-header">
				<h1 className="extevent-page-title">Upcoming Events</h1>
				<div className="extevent-search-filter-container">
					<div className="extevent-search-bar">
						<input 
							type="text" 
							placeholder="Search events..." 
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
						/>
						<button className="extevent-search-button"><FaSearch /></button>
					</div>
					<div className="extevent-action-buttons">
						<select
							className="extevent-filter-dropdown"
							value={selectedCategory}
							onChange={(e) => setSelectedCategory(e.target.value)}
						>
							<option value="">Sort by: Categories</option>
							{EVENT_CATEGORIES.map((category) => (
								<option key={category} value={category}>
									{category.replace('_', ' ')}
								</option>
							))}
						</select>
						{selectedCategory && (
							<button
								onClick={() => setSelectedCategory('')}
								className="clear-filter-button">
								Clear Filter
							</button>
						)}

						{user && user.role === "admin" && (
							<>
								<button
									className="extevent-calendar-button"
									onClick={handleCreateEventClick}
								>
									Create External Event
								</button>
								<button
									className={`extevent-edit-button ${isEditMode ? 'active' : ''}`}
									onClick={handleEditPageClick}
								>
									{isEditMode ? 'Exit Edit Mode' : 'Edit Page'} <FaEdit />
								</button>
							</>
						)}
					</div>
				</div>
			</div>

			{/* Event Cards */}
			<div className="extevents-container">
				{paginatedEvents.map((event) => (
					<div className="extevent-card" key={event.id}>
						<div className="extevent-image">
							<img
								src={
									event.image && event.image.startsWith('/uploads')
										? `${API_URL}${event.image}`
										: event.image || "/assets/images/default-extevent.png"
								}
								alt={event.external_event_name}
								onError={(e) => {
									e.target.src = "/assets/images/default-extevent.png"; 
									e.target.onerror = null; 
								}}
							/>
							{isEditMode && user && user.role === "admin" && (
								<>
									<button
										className="delete-extevent-button"
										onClick={() => handleDeleteEvent(event.external_event_id)}
										aria-label="Delete event"
									>
										<FaTrash />
									</button>
									<button
										className="edit-extevent-button"
										onClick={() => handleEditIconClick(event)}
										aria-label="Edit event"
									>
										<FaPencilAlt />
									</button>
								</>
							)}
						</div>
						<div className="extevent-content">
							<h2 className="extevent-title">{event.external_event_name}</h2>
							<p className="extevent-description">{event.external_event_description}</p>
							<div className="extevent-details">
								<p><strong>Location:</strong> {event.external_event_location}</p>
								<p>
									<strong>Date:</strong>{' '}
									{event.external_event_date
										? new Date(event.external_event_date).toLocaleDateString('en-US', {
											year: 'numeric',
											month: 'long',
											day: 'numeric',
										})
										: event.date}
								</p>
								<p>
									<strong>Time:</strong>{' '}
									{event.external_event_time
										? new Date(event.external_event_time).toLocaleTimeString('en-US', {
											hour: 'numeric',
											minute: '2-digit',
											hour12: true,
										})
										: event.time}
								</p>
							</div>
						</div>
						<div className="extevent-actions">
						{followedEvents.includes(Number(event.external_event_id)) ? (
                <button
                  className="view-button"
                  onClick={() => handleUnfollowClick(event.external_event_id)}
                >
                  Unfollow
                </button>
              ) : (
                <button
                  className="view-button"
                  onClick={() => user ? handleFollowClick(event.external_event_id) : promptLogin()}
                >
                  Follow
                </button>
              )}
              <button
                className="apply-button"
                onClick={() => user ? handleDetailClick(event.external_event_id) : promptLogin()}
              >
                Details
              </button>
            </div>
					</div>
				))}
			</div>
			<Pagination
				totalPages={Math.ceil(filteredEvents.length / itemsPerPage)}
				currentPage={currentPage}
				onPageChange={(page) => setCurrentPage(page)}
			/>

			{/* Sign-Up Form */}
			{isFormVisible && (
				<div className="event-form-overlay">
					<div className="event-form-container">
						<button
							className="close-form-button"
							onClick={handleCloseForm}
							aria-label="Close form"
						>
							<FaTimes />
						</button>
						<h3>Sign Up to Follow Event</h3>
						<form className="event-signup-form" onSubmit={handleFormSubmit}>
							<div className="event-form-group">
								<label htmlFor="name">Name</label>
								<input type="text" id="name" name="name" required />
							</div>
							<div className="event-form-group">
								<label htmlFor="studentId">Student ID</label>
								<input type="text" id="studentId" name="studentId" required />
							</div>
							<div className="event-form-group">
								<label htmlFor="year">Year of Study</label>
								<input type="text" id="year" name="year" required />
							</div>
							<div className="event-form-group">
								<label htmlFor="email">Email</label>
								<input type="email" id="email" name="email" required />
							</div>
							<div className="event-form-actions">
								<button type="submit" className="event-submit-button">Submit</button>
							</div>
						</form>
					</div>
				</div>
			)}

			{/* Success Modal */}
			{isSuccessModalVisible && (
				<div className="event-form-overlay">
					<div className="success-modal">
						<button
							className="close-form-button"
							onClick={handleCloseSuccessModal}
							aria-label="Close modal"
						>
							<FaTimes />
						</button>
						<h2>Event followed successfully</h2>
						<p>
							Please make sure to unfollow it if you won't be able to make it to
							the event on time to give spot to someone else!
						</p>
						<button
							className="return-button"
							onClick={handleCloseSuccessModal}
						>
							Return to Event List
						</button>
					</div>
				</div>
			)}

			{isEventFullModalVisible && (
        <div className="event-form-overlay">
          <div className="success-modal"> {/* Reusing success-modal class for styling */}
            <button
              className="close-form-button"
              onClick={handleCloseEventFullModal}
              aria-label="Close modal"
            >
              <FaTimes />
            </button>
            <h2>Event is Full</h2>
            <p>Sorry, this event has reached its maximum capacity.</p>
            <button
              className="return-button"
              onClick={handleCloseEventFullModal}
            >
              Return to Event List
            </button>
          </div>
        </div>
      )}
	  {isUnfollowModalVisible && (
        <div className="event-form-overlay">
          <div className="success-modal">
            <button className="close-form-button" onClick={handleCloseUnfollowModal} aria-label="Close modal">
              <FaTimes />
            </button>
            <h2>Event unfollowed successfully</h2>
            <p>You have unfollowed this event. The slot is now available for someone else.</p>
            <button className="return-button" onClick={handleCloseUnfollowModal}>
              Return to Event List
            </button>
          </div>
        </div>
      )}

			{/* Edit Event Form */}
			{isEditFormVisible && currentEditEvent && (
				<div className="event-form-overlay">
					<div className="edit-event-form-container">
						<button
							className="close-form-button"
							onClick={handleCloseEditForm}
							aria-label="Close edit form"
						>
							<FaTimes />
						</button>
						<h3>Edit Event Details</h3>
						<form className="edit-event-form" onSubmit={handleEditFormSubmit}>
							<div className="edit-form-row">
								<div className="edit-form-group">
									<label htmlFor="edit-title">Event Name:</label>
									<input
										type="text"
										id="edit-title"
										value={currentEditEvent.title}
										onChange={(e) =>
											setCurrentEditEvent({
												...currentEditEvent,
												external_event_name: e.target.value,
												title: e.target.value 
											})
										}
										maxLength="100"
									/>
									{/* <small>{currentEditEvent.title.length} / 100</small> */}
								</div>
							</div>

							<div className="edit-form-row">
								<div className="edit-form-group">
									<label htmlFor="edit-date">Event Date:</label>
									<input
										type="text"
										id="edit-date"
										value={currentEditEvent.date}
										onChange={(e) =>
											setCurrentEditEvent({
												...currentEditEvent,
												external_event_date: e.target.value,
												date: e.target.value
											})
										}
									/>
								</div>

								<div className="edit-form-group">
									<label htmlFor="edit-time">Event Time:</label>
									<input
										type="text"
										id="edit-time"
										value={currentEditEvent.time}
										onChange={(e) =>
											setCurrentEditEvent({
												...currentEditEvent,
												external_event_time: e.target.value,
												time: e.target.value
											})
										}
									/>
								</div>
							</div>

							<div className="edit-form-group">
								<label htmlFor="edit-location">Location:</label>
								<input
									type="text"
									id="edit-location"
									value={currentEditEvent.location}
									onChange={(e) =>
										setCurrentEditEvent({
											...currentEditEvent,
											external_event_location: e.target.value,
											location: e.target.value
										})
									}
								/>
							</div>

							<div className="edit-form-row">
								<div className="edit-form-group">
									<label htmlFor="edit-capacity">Maximum Attendees:</label>
									<input
										type="text"
										id="edit-capacity"
										value={currentEditEvent.capacity}
										onChange={(e) =>
											setCurrentEditEvent({
												...currentEditEvent,
												external_event_max_number_of_attendees: e.target.value,
												capacity: e.target.value 
											})
										}
									/>
								</div>

								<div className="edit-form-group">
									<label htmlFor="edit-price">Ticket Price:</label>
									<input
										type="text"
										id="edit-price"
										value={currentEditEvent.price}
										onChange={(e) =>
											setCurrentEditEvent({
												...currentEditEvent,
												external_event_ticket_amount: e.target.value,
												price: e.target.value 
											})
										}
									/>
								</div>
							</div>

							<div className="edit-form-group">
								<label htmlFor="edit-category">Event Category:</label>
								<select
									id="edit-category"
									value={currentEditEvent.category}
									onChange={(e) =>
										setCurrentEditEvent({
											...currentEditEvent,
											external_event_category: e.target.value,
											category: e.target.value
										})
									}
									className="event-category-select"
								>
									<option value="">Select Event Category</option>
									{EVENT_CATEGORIES.map((category) => (
										<option key={category} value={category}>
											{category.replace('_', ' ')}
										</option>
									))}
								</select>
							</div>

							<div className="edit-form-group">
								<label htmlFor="edit-description">Description:</label>
								<textarea
									id="edit-description"
									value={currentEditEvent.description}
									onChange={(e) =>
										setCurrentEditEvent({
											...currentEditEvent,
											external_event_description: e.target.value,
											description: e.target.value 
										})
									}
									maxLength="1000"
								/>
							</div>

							<div className="event-team-section">
								<h3>Event Team</h3>

								<div className="edit-form-row">
									<div className="edit-form-group">
										<label htmlFor="organizer">Organizer:</label>
										<input
											type="text"
											id="organizer"
											value={currentEditEvent.external_event_organizer || ''}
											onChange={(e) =>
												setCurrentEditEvent({
													...currentEditEvent,
													external_event_organizer: e.target.value,
												})
											}
										/>
									</div>

									<div className="edit-form-group">
										<label htmlFor="co-organizer">Co-Organizer:</label>
										<input
											type="text"
											id="co-organizer"
											value={currentEditEvent.external_event_corganizer || ''}
											onChange={(e) =>
												setCurrentEditEvent({
													...currentEditEvent,
													external_event_corganizer: e.target.value,
												})
											}
										/>
									</div>
								</div>

								<div className="edit-form-row">
									<div className="edit-form-group">
										<label htmlFor="manager">Manager:</label>
										<input
											type="text"
											id="manager"
											value={currentEditEvent.external_event_manager || ''}
											onChange={(e) =>
												setCurrentEditEvent({
													...currentEditEvent,
													external_event_manager: e.target.value,
												})
											}
										/>
									</div>

									<div className="edit-form-group">
										<label htmlFor="speaker">Speaker:</label>
										<input
											type="text"
											id="speaker"
											value={currentEditEvent.external_event_speaker || ''}
											onChange={(e) =>
												setCurrentEditEvent({
													...currentEditEvent,
													external_event_speaker: e.target.value,
												})
											}
										/>
									</div>
								</div>
							</div>


							<div className="edit-form-actions">
								<button
									type="button"
									onClick={handleCloseEditForm}
									className="cancel-button"
								>
									Cancel
								</button>
								<button type="submit" className="update-event-button">
									Update Event
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</main>
	);
};

export default ExternalEvents;