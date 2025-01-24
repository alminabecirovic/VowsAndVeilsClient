import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import axios from "axios";
import "../pages/navbar2.css";

const dressTypes = [
  {
    id: "aline",
    name: "A-kroj",
    image: "/images/a-line_s.png",
    hoverImage: "/images/a-line.png"
  },
  {
    id: "mermaid",
    name: "Sirena",
    image: "/images/mermaid_s.png",
    hoverImage: "/images/mermaid.png"
  },
  {
    id: "princess",
    name: "Princeza",
    image: "/images/princess_s.png",
    hoverImage: "/images/princess.png"
  },
  {
    id: "mini",
    name: "Mini",
    image: "/images/mini_s.png",
    hoverImage: "/images/a-line.png"
  }
];

const Navbar2 = ({ onCriteriaChange }) => {
  const [activeText, setActiveText] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
    sizes: [],
  });
  const [criteria, setCriteria] = useState({
    dressLength: "",
    size: "",
  });
  const [hoveredDress, setHoveredDress] = useState(null);
  const [activeDress, setActiveDress] = useState(null); // Za aktivnu sliku

  const location = useLocation();

  const handleSetActiveText = (text) => {
    setActiveText(text);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleDressTypeSelect = (dressType) => {
    setCriteria((prev) => {
      const newCriteria = {
        ...prev,
        dressLength: prev.dressLength === dressType ? "" : dressType
      };
      onCriteriaChange(newCriteria);
      return newCriteria;
    });

    // Postavi ili skloni aktivnu sliku
    setActiveDress((prevActive) => prevActive === dressType ? null : dressType);
  };

  const handleSizeChange = (e) => {
    const { value } = e.target;
    setCriteria((prev) => {
      const newCriteria = { ...prev, size: value };
      onCriteriaChange(newCriteria);
      return newCriteria;
    });
  };

  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const response = await axios.get("https://localhost:7042/api/WeddingDress/search");
        console.log("API Response:", response.data);
        setFilterOptions({
          sizes: ["S", "M", "L"],
        });
      } catch (error) {
        console.error("Greška pri učitavanju opcija filtera:", error);
      }
    };

    fetchFilterOptions();
  }, []);

  return (
    <div className="container">
      <div className="button">{activeText}</div>
      <hr className="divider" />
      <div className="navigation">
        <nav>
          <NavLink
            to="/user_dresses_list"
            onClick={() => handleSetActiveText("Kolekcija")}
          >
            Kolekcija
          </NavLink>
          <NavLink
            to="/inspiration"
            onClick={() => handleSetActiveText("Inspiracija")}
          >
            Inspiracija
          </NavLink>

          <div className="filter">
            {location.pathname === "/user_dresses_list" && (
              <NavLink
                to="#"
                onClick={toggleSidebar}
                style={{
                  display: "flex",
                  borderRight: "2px solid #f0f0f0",
                  borderLeft: "2px solid #f0f0f0",
                  borderBottom: "none",
                  fontSize: "20px",
                  textTransform: "uppercase",
                  cursor: "pointer",
                }}
              >
                Filter
              </NavLink>
            )}
          </div>
        </nav>
      </div>

      {isSidebarOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            right: 0,
            width: "400px",
            height: "100%",
            background: "#fff",
            boxShadow: "-2px 0 5px rgba(0,0,0,0.1)",
            padding: "30px",
            zIndex: 1000,
            overflowY: "auto"
          }}
        >
          <div className="sidebar-header">
            <h2 className="filter-title">Opcije filtera</h2>
            <button className="close-button" onClick={toggleSidebar}>×</button>
          </div>

          <div className="dress-type-grid">
            {dressTypes.map((dress) => (
              <div
                key={dress.id}
                className={`dress-type-option ${activeDress === dress.name ? 'active' : ''}`}
                onClick={() => handleDressTypeSelect(dress.name)}
                onMouseEnter={() => setHoveredDress(dress.id)}
                onMouseLeave={() => setHoveredDress(null)}
              >
                <img
                  src={hoveredDress === dress.id || activeDress === dress.name ? dress.hoverImage : dress.image}
                  alt={dress.name}
                />
                <div className="dress-type-label">{dress.name}</div>
              </div>
            ))}
          </div>

          <div className="size-selector">
            <label>Veličina:</label>
            <select
              value={criteria.size}
              onChange={handleSizeChange}
            >
              <option value="">Sve veličine</option>
              {filterOptions.sizes.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar2;
