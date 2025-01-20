import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import axios from "axios";
import "../pages/navbar2.css";

const Navbar2 = () => {
    const [activeText, setActiveText] = useState("");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [filterOptions, setFilterOptions] = useState({
        dressLengths: [],
        sizes: [],
    });
    const [criteria, setCriteria] = useState({
        dressLength: "",
        size: "",
    });
    const [loading, setLoading] = useState(false);

    const location = useLocation(); // Prati trenutnu rutu

    const handleSetActiveText = (text) => {
        setActiveText(text);
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
        if (!isSidebarOpen) {
            fetchFilterOptions();
        }
    };

    const fetchFilterOptions = async () => {
        try {
            const response = await axios.get("https://your-domain.com/api/filter-options");
            setFilterOptions({
                dressLengths: response.data.dressLengths || [],
                sizes: response.data.sizes || [],
            });
        } catch (error) {
            console.error("Error fetching filter options:", error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCriteria((prev) => ({ ...prev, [name]: value }));
    };

    const applyFilters = async () => {
        setLoading(true);
        try {
            const response = await axios.post("https://your-domain.com/api/WeddingDress/search", criteria);
            console.log("Filtered results:", response.data);
            setIsSidebarOpen(false); // Zatvori sidebar nakon primene filtera
        } catch (error) {
            console.error("Error applying filters:", error);
        } finally {
            setLoading(false);
        }
    };

    // Automatski zatvori Sidebar ako korisnik promeni rutu
    useEffect(() => {
        if (location.pathname !== "/user_dresses_list") {
            setIsSidebarOpen(false); // Zatvori sidebar
        }
    }, [location.pathname]); // Prati promene rute

    // Resetuj `activeText` ako se klikne van navbara
    useEffect(() => {
        const handleClickOutside = (e) => {
            // Proverava da li klik nije deo navigacije
            if (!e.target.closest(".navigation")) {
                setActiveText(""); // Resetuj activeText
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
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
                        {/* Prikaz filter dugmeta samo na ruti 'Kolekcija' */}
                        {location.pathname === "/user_dresses_list" && (
                            <NavLink
                                to="#"
                                onClick={() => {
                                    toggleSidebar();
                                }}
                                style={{
                                    display: "flex",
                                    borderRight: "2px solid #f0f0f0",
                                    borderLeft: "2px solid #f0f0f0",
                                    borderBottom: "none",
                                    fontSize: "20px",
                                    textTransform: "uppercase",
                                    transition: "background-color 0.3s, transform 0.3s",
                                    cursor: "pointer",
                                }}
                                onMouseEnter={(e) => (e.target.style.backgroundColor = "#f0f0f0")} // Hover efekat
                                onMouseLeave={(e) => (e.target.style.backgroundColor = "white")} // Vraćanje na belu pozadinu
                            >
                                Filter
                            </NavLink>
                        )}
                    </div>
                </nav>
            </div>

            {/* Sidebar */}
            {isSidebarOpen && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        right: 0,
                        width: "300px",
                        height: "100%",
                        background: "#f4f4f4",
                        boxShadow: "-2px 0 5px rgba(0,0,0,0.5)",
                        padding: "20px",
                        zIndex: 1000,
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <button
                        onClick={toggleSidebar}
                        style={{
                            alignSelf: "flex-end",
                            background: "transparent",
                            border: "none",
                            fontSize: "20px",
                            cursor: "pointer",
                        }}
                    >
                        ✖
                    </button>
                    <div>
                        <label>Dress Length:</label>
                        <select name="dressLength" value={criteria.dressLength} onChange={handleInputChange}>
                            <option value="">All</option>
                            {filterOptions.dressLengths.map((length) => (
                                <option key={length} value={length}>
                                    {length}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label>Size:</label>
                        <select name="size" value={criteria.size} onChange={handleInputChange}>
                            <option value="">All</option>
                            {filterOptions.sizes.map((size) => (
                                <option key={size} value={size}>
                                    {size}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button
                        style={{ marginTop: "20px" }}
                        onClick={applyFilters}
                        disabled={loading}
                    >
                        {loading ? "Loading..." : "Apply Filters"}
                    </button>
                </div>
            )}
        </div>
    );
};

export default Navbar2;

