import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import { MyContext } from "../context/my-context";
import "../pages/user-dresses-list.css";

const UserDressesList = ({ criteria }) => {
    const [dresses, setDresses] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    // Pristup kontekstu
    const { currentUser, userRole } = useContext(MyContext);

    useEffect(() => {
        const fetchDresses = async () => {
            try {
                const response = await fetch(
                    `https://localhost:7042/api/WeddingDress/search?dressLength=${criteria.dressLength}&size=${criteria.size}`
                );
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
    }, [criteria]);

    const toggleFavorite = (weddingDress) => {
        let updatedFavorites;
        if (favorites.some((fav) => fav.id === weddingDress.id)) {
            updatedFavorites = favorites.filter((fav) => fav.id !== weddingDress.id);
        } else {
            updatedFavorites = [...favorites, weddingDress];
        }

        setFavorites(updatedFavorites);
        localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    };

    const isFavorite = (weddingDressId) => {
        return favorites.some((fav) => fav.id === weddingDressId);
    };

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
                                    style={{ cursor: "pointer" }}
                                />
                                {/* Prikaz srca samo ako je korisnik registrovan */}
                                {currentUser && userRole === "User" && (
                                    <button
                                        className={`favorite-button ${isFavorite(weddingDress.id) ? "active" : ""}`}
                                        onClick={() => toggleFavorite(weddingDress)}
                                    >
                                        <FaHeart
                                            className="icon-heart"
                                            style={{ color: isFavorite(weddingDress.id) ? "red" : "gray" }}
                                        />
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
