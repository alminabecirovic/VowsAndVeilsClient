import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import { MyContext } from "../context/my-context";
import "../pages/user-dresses-list.css";

const UserDressesList = () => {
    const [dresses, setDresses] = useState([]); // Sve venčanice
    const [favorites, setFavorites] = useState([]); // Omiljene venčanice
    const [error, setError] = useState("");
    const { userRole } = useContext(MyContext);
    const navigate = useNavigate();

    // Učitaj listu venčanica sa servera
    useEffect(() => {
        const fetchDresses = async () => {
            try {
                const response = await fetch(process.env.REACT_APP_API_URL || "https://localhost:7042/api/Post");
                if (!response.ok) {
                    throw new Error("Greška prilikom učitavanja venčanica");
                }
                const data = await response.json();
                setDresses(data);
            } catch (e) {
                console.error("Error fetching dresses:", e);
                setError("Došlo je do greške prilikom učitavanja liste venčanica.");
            }
        };

        fetchDresses();
    }, []);

    // Učitaj omiljene iz localStorage-a kada se komponenta montira
    useEffect(() => {
        const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
        setFavorites(storedFavorites);
    }, []);

    // Dodaj ili ukloni venčanicu iz omiljenih
    const toggleFavorite = (weddingDress) => {
        let updatedFavorites;
        if (favorites.some((fav) => fav.id === weddingDress.id)) {
            // Ako je već u omiljenim, ukloni je
            updatedFavorites = favorites.filter((fav) => fav.id !== weddingDress.id);
        } else {
            // Ako nije, dodaj je
            updatedFavorites = [...favorites, weddingDress];
        }

        setFavorites(updatedFavorites);
        localStorage.setItem("favorites", JSON.stringify(updatedFavorites)); // Sačuvaj u localStorage
    };

    // Proveri da li je venčanica u omiljenima
    const isFavorite = (weddingDressId) => {
        return favorites.some((fav) => fav.id === weddingDressId);
    };

    // Navigacija na stranicu detalja
    const handleNavigateToDetails = (dressId) => navigate(`/dress-details/${dressId}`);

    return (
        <div>
            <div className="container-dresses">
                {error && <p style={{ color: "red" }}>{error}</p>}
                {!error && dresses.length === 0 && <p>Nema dostupnih venčanica za prikaz.</p>}
                {!error &&
                    dresses.map((weddingDress) => (
                        <div key={weddingDress.id} className="card">
                            <div className="image-container">
                                <img
                                    src={weddingDress.urlPhotos[0]}
                                    alt={weddingDress.name}
                                    onClick={() => handleNavigateToDetails(weddingDress.id)}
                                    style={{ cursor: "pointer" }} // Stil za naglašavanje klika
                                />
                                {userRole === "User" && (
                                    <button
                                        className={`favorite-button ${isFavorite(weddingDress.id) ? "active" : ""}`}
                                        onClick={() => toggleFavorite(weddingDress)}
                                    >
                                     <FaHeart className="icon-heart" />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default UserDressesList;
