import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./BrowseClubs.css";
import "./ClubCard.css";
import { FaSearch, FaChevronLeft, FaChevronRight, FaTrash, FaPencilAlt, FaEdit } from "react-icons/fa";

const BrowseClubs = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [clubs, setClubs] = useState([]);
  const [user, setUser] = useState(null);
  const [userMemberships, setUserMemberships] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingClub, setEditingClub] = useState(null);
  const clubsPerPage = 4;
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5050/api";

  useEffect(() => {
    const loadUserAndMemberships = () => {
      const storedUser = sessionStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);

        const savedMemberships = localStorage.getItem(`userMemberships_${parsedUser.id}`);
        if (savedMemberships) {
          setUserMemberships(JSON.parse(savedMemberships).map(Number));
        }

        fetchUserMemberships(parsedUser.id);
      } else {
        setUser(null);
        setUserMemberships([]);
      }
    };

    loadUserAndMemberships();

    const handleStorageChange = (e) => {
      if (e.key === `userMemberships_${user?.id}`) {
        const saved = JSON.parse(localStorage.getItem(`userMemberships_${user?.id}`)) || [];
        setUserMemberships(saved.map(Number));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('focus', loadUserAndMemberships);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', loadUserAndMemberships);
    };
  }, [location.pathname]);

  const fetchUserMemberships = async (userId) => {
    try {
      const response = await fetch(`${apiUrl}/club-memberships/user/${userId}`);
      const memberships = await response.json();
      setUserMemberships(memberships.map(Number));
      localStorage.setItem(`userMemberships_${userId}`, JSON.stringify(memberships));
    } catch (error) {
      console.error("Error fetching memberships:", error);
    }
  };

  const refreshMemberships = () => {
    if (user) {
      fetchUserMemberships(user.id);
    }
  };

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const response = await fetch(`${apiUrl}/clubs`);
        const data = await response.json();
        setClubs(data);
      } catch (error) {
        console.error("Error fetching clubs:", error);
      }
    };

    fetchClubs();
  }, []);

  const handleJoinClub = async (clubId) => {
    if (!user) {
      alert("Please log in first.");
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/club-memberships`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, clubId: Number(clubId) }),
      });

      if (response.status === 201) {
        const updatedMemberships = [...userMemberships, Number(clubId)];
        setUserMemberships(updatedMemberships);
        localStorage.setItem(`userMemberships_${user.id}`, JSON.stringify(updatedMemberships));
        alert("Joined club successfully!");
      } else if (response.status === 400) {
        alert("You are already a member of this club.");
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Join club error:", error);
      alert("Failed to join club.");
    }
  };

  const handleLeaveClub = async (clubId) => {
    if (!user) {
      alert("Please log in first.");
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/club-memberships/leave`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, clubId: Number(clubId) }),
      });

      if (response.ok) {
        const updatedMemberships = userMemberships.filter(id => id !== Number(clubId));
        setUserMemberships(updatedMemberships);
        localStorage.setItem(`userMemberships_${user.id}`, JSON.stringify(updatedMemberships));
        alert("Left club successfully!");
      } else {
        alert("Failed to leave the club.");
      }
    } catch (error) {
      console.error("Leave club error:", error);
      alert("Server error while leaving the club.");
    }
  };

  const handleDeleteClub = async (clubId) => {
    if (!window.confirm("Are you sure you want to delete this club?")) return;

    try {
      const response = await fetch(`${apiUrl}/clubs/${clubId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setClubs(prev => prev.filter(club => club.club_id !== clubId));
        alert("Club deleted successfully!");
      } else {
        alert("Failed to delete the club.");
      }
    } catch (error) {
      console.error("Error deleting club:", error);
      alert("Server error while deleting the club.");
    }
  };

  const handleEditClick = (club) => {
    setEditingClub(club);
  };

  const handleEditFormChange = (field, value) => {
    setEditingClub({ ...editingClub, [field]: value });
  };

  const handleEditFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${apiUrl}/clubs/${editingClub.club_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          club_name: editingClub.club_name,
          club_description: editingClub.club_description,
          club_thumbnail_url: editingClub.club_thumbnail_url,
        }),
      });

      if (response.ok) {
        alert("Club updated successfully!");
        setEditingClub(null);
        window.location.reload();
      } else {
        alert("Failed to update club.");
      }
    } catch (error) {
      console.error("Edit club error:", error);
      alert("Error updating club.");
    }
  };

  const filteredClubs = clubs.filter((club) => {
    const matchesSearch = club.club_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "" || club.club_category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const indexOfLastClub = currentPage * clubsPerPage;
  const indexOfFirstClub = indexOfLastClub - clubsPerPage;
  const currentClubs = filteredClubs.slice(indexOfFirstClub, indexOfLastClub);
  const totalPages = Math.ceil(filteredClubs.length / clubsPerPage);

  return (
    <main className="browse-clubs-main">
      <div className="browse-clubs-header">
        <h1 className="browse-clubs-title">Browse Clubs</h1>
        <div className="browse-clubs-search-filter">
          <div className="browse-clubs-search">
            <input
              type="text"
              placeholder="Search clubs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="search-button">
              <FaSearch />
            </button>
          </div>

          <div className="browse-clubs-actions">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="filter-dropdown"
            >
              <option value="">Filter by Category</option>
              <option value="Tech">Tech</option>
              <option value="Social">Social</option>
              <option value="STEM">STEM</option>
              <option value="Engineering">Engineering</option>
              <option value="Arts">Arts</option>
            </select>

            {selectedCategory && (
              <button className="clear-filter-button" onClick={() => setSelectedCategory("")}>
                Clear Filter
              </button>
            )}

            {user && user.role === "admin" && (
              <>
                <button
                  className="create-club-button"
                  onClick={() => navigate("/create-club")}
                >
                  Create Club
                </button>
                <button
                  className={`edit-clubs-button ${isEditMode ? "active" : ""}`}
                  onClick={() => setIsEditMode(!isEditMode)}
                >
                  {isEditMode ? "Exit Edit Mode" : "Edit Page"} <FaEdit />
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="club-cards-list">
        {currentClubs.length > 0 ? (
          currentClubs.map((club) => {
            const isMember = userMemberships.includes(Number(club.club_id));

            return (
              <div key={club.club_id} className="club-card">
                <div className="club-image">
                  <img
                    src={club.club_thumbnail_url || "https://picsum.photos/200/150?random=1"}
                    alt={club.club_name}
                    onError={(e) => {
                      e.target.src = "https://picsum.photos/200/150?random=1";
                      e.target.onerror = null;
                    }}
                  />
                  {user && user.role === "admin" && isEditMode && (
                    <>
                      <button
                        className="delete-club-button"
                        onClick={() => handleDeleteClub(club.club_id)}
                      >
                        <FaTrash />
                      </button>
                      <button
                        className="edit-club-button"
                        onClick={() => handleEditClick(club)}
                      >
                        <FaPencilAlt />
                      </button>
                    </>
                  )}
                </div>

                <div className="club-details">
                  <h3>{club.club_name}</h3>
                  <p>{club.club_description}</p>
                </div>

                <div className="club-buttons">
                  <button
                    className="view-club-btn"
                    onClick={() => navigate(`/club-details/${club.club_id}`)}
                  >
                    View Club Details
                  </button>

                  {isMember ? (
                    <button
                      className="leave-club-btn"
                      onClick={() => handleLeaveClub(club.club_id)}
                    >
                      Leave
                    </button>
                  ) : (
                    <button
                      className="join-club-btn"
                      onClick={() => handleJoinClub(club.club_id)}
                    >
                      Join
                    </button>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <p>No clubs found.</p>
        )}
      </div>

      <div className="pagination-controls">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          <FaChevronLeft /> Prev
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next <FaChevronRight />
        </button>
      </div>

      {editingClub && (
        <div className="edit-modal-overlay">
          <div className="edit-modal">
            <button
              className="close-modal-button"
              onClick={() => setEditingClub(null)}
            >
              ×
            </button>
            <h2>Edit Club</h2>
            <form onSubmit={handleEditFormSubmit}>
              <div className="edit-form-group">
                <label>Club Name:</label>
                <input
                  type="text"
                  value={editingClub.club_name}
                  onChange={(e) => handleEditFormChange("club_name", e.target.value)}
                  required
                />
              </div>

              <div className="edit-form-group">
                <label>Club Logo URL:</label>
                <input
                  type="text"
                  value={editingClub.club_thumbnail_url || ""}
                  onChange={(e) => handleEditFormChange("club_thumbnail_url", e.target.value)}
                />
              </div>

              <div className="edit-form-group">
                <label>Club Description:</label>
                <textarea
                  value={editingClub.club_description}
                  onChange={(e) => handleEditFormChange("club_description", e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="save-changes-btn">Save Changes</button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};

export default BrowseClubs;
