import React, { useState, useContext, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { MyContext } from "../context/my-context";
import "../pages/navbar2.css";
import axios from "axios";

const dressTypes = [
  { id: "aline", name: "A-kroj", image: "/images/a-line_s.png", hoverImage: "/images/a-line.png" },
  { id: "mermaid", name: "Sirena", image: "/images/mermaid_s.png", hoverImage: "/images/mermaid.png" },
  { id: "princess", name: "Princeza", image: "/images/princess_s.png", hoverImage: "/images/princess.png" },
  { id: "mini", name: "Mini", image: "/images/mini_s.png", hoverImage: "/images/mini.png" }
];

const Navbar2 = ({ onCriteriaChange }) => {
  const { userRole } = useContext(MyContext);
  const [activeText, setActiveText] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
    sizes: ["S", "M", "L"],
    cities: ["Svi gradovi", "Beograd", "Novi Sad", "Niš", "Novi Pazar", "Kragujevac", "Subotica", "Zrenjanin", "Pančevo", "Čačak", "Kraljevo", "Leskovac"]
  });
  const [criteria, setCriteria] = useState({ dressLength: "", size: "", city: "" });
  const [hoveredDress, setHoveredDress] = useState(null);
  const [activeDress, setActiveDress] = useState(null);
  const location = useLocation();

  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isSidebarOpen]);

  const handleSetActiveText = (text) => {
    setActiveText(text);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const handleDressTypeSelect = (dressType) => {
    setCriteria((prev) => {
      const newCriteria = { ...prev, dressLength: prev.dressLength === dressType ? "" : dressType };
      onCriteriaChange(newCriteria);
      return newCriteria;
    });
    setActiveDress((prevActive) => (prevActive === dressType ? null : dressType));
  };

  const handleSizeChange = (e) => {
    const { value } = e.target;
    setCriteria((prev) => {
      const newCriteria = { ...prev, size: value };
      onCriteriaChange(newCriteria);
      return newCriteria;
    });
  };

  const handleCityChange = (e) => {
    const { value } = e.target;
    setCriteria((prev) => {
      const newCriteria = { ...prev, city: value === "Svi gradovi" ? "" : value };
      onCriteriaChange(newCriteria);
      return newCriteria;
    });
  };

  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const response = await axios.get("https://vowsandveils-api-production.up.railway.app/api/WeddingDress/search");
        console.log("API Response:", response.data);

        setFilterOptions((prev) => ({
          ...prev,
          sizes: ["S", "M", "L"],
          cities: ["Svi gradovi", "Beograd", "Novi Sad", "Niš", "Novi Pazar", "Kragujevac", "Subotica", "Zrenjanin", "Pančevo", "Čačak", "Kraljevo", "Leskovac"]
        }));
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
          {!userRole && (
            <>
              <NavLink to="/user_dresses_list" onClick={() => handleSetActiveText("Kolekcija")}>
                Kolekcija
              </NavLink>
              <NavLink to="/story" onClick={() => handleSetActiveText("Inspiracija")}>
                Inspiracija
              </NavLink>
              {location.pathname === "/user_dresses_list" && (
                <NavLink to="#" onClick={toggleSidebar} className="filter-button">
                  Filter
                </NavLink>
              )}
            </>
          )}

          {userRole === "User" && (
            <>
              <NavLink to="/user_dresses_list" onClick={() => handleSetActiveText("Kolekcija")}>
                Kolekcija
              </NavLink>
              <NavLink to="/story" onClick={() => handleSetActiveText("Inspiracija")}>
                Inspiracija
              </NavLink>
              {location.pathname === "/user_dresses_list" && (
                <NavLink to="#" onClick={toggleSidebar} className="filter-button">
                  Filter
                </NavLink>
              )}
            </>
          )}

          {userRole === "SalonOwner" && (
            <>
              <NavLink to="/dress" onClick={() => handleSetActiveText("Kolekcija")}>
                Kolekcija
              </NavLink>
              <NavLink to="/appointments" onClick={() => handleSetActiveText("Obaveze")}>
                Obaveze
              </NavLink>
            </>
          )}

          {userRole === "Admin" && (
            <>
              <NavLink to="/admin_dashboard" onClick={() => handleSetActiveText("Lista korisnika")}>
                Lista korisnika
              </NavLink>
              <NavLink to="/inspiration-page" onClick={() => handleSetActiveText("Inspiracija")}>
                Inspiracija
              </NavLink>
            </>
          )}
        </nav>
      </div>

      {isSidebarOpen && (
        <div className="sidebar">
          <div className="sidebar-header">
            <h2 className="filter-title">Opcije filtera</h2>
            <button className="close-button" onClick={toggleSidebar}>×</button>
          </div>

          <div className="dress-type-grid">
            {dressTypes.map((dress) => (
              <div
                key={dress.id}
                className={`dress-type-option ${activeDress === dress.name ? "active" : ""}`}
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
            <select value={criteria.size} onChange={handleSizeChange}>
              <option value="">Sve veličine</option>
              {filterOptions.sizes.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>

          <div className="city-selector">
            <label>Grad:</label>
            <select value={criteria.city} onChange={handleCityChange}>
              {filterOptions.cities.map((city, index) => (
                <option key={index} value={city}>
                  {city}
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
