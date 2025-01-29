import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import { MyContext } from "../context/my-context";
import "../pages/dress-details.css";

const DressDetails = () => {
    const [dress, setDress] = useState(null); // Detalji venčanice
    const [favorites, setFavorites] = useState([]); // Omiljene venčanice
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true); // Indikator učitavanja
    const { userRole } = useContext(MyContext);
    const navigate = useNavigate();
    const { dressId } = useParams(); // Preuzmi dressId iz URL-a

    // Učitaj listu venčanica sa servera i filtriraj prema dressId
    useEffect(() => {
        const fetchDresses = async () => {
            try {
                setLoading(true);
                const response = await fetch(
                    process.env.REACT_APP_API_URL || "https://localhost:7042/api/Post"
                );
                if (!response.ok) {
                    throw new Error("Greška prilikom učitavanja venčanica");
                }
                const data = await response.json();

                // Filtriraj venčanicu prema dressId
                const selectedDress = data.find((item) => item.id === parseInt(dressId));
                if (!selectedDress) {
                    throw new Error("Venčanica sa datim ID-jem nije pronađena.");
                }
                setDress(selectedDress);
            } catch (e) {
                console.error("Error fetching dress details:", e);
                setError("Došlo je do greške prilikom učitavanja detalja venčanice.");
            } finally {
                setLoading(false);
            }
        };

        fetchDresses();
    }, [dressId]);

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

    if (loading) {
        return <p>Učitavanje detalja venčanice...</p>;
    }

    if (error) {
        return <p style={{ color: "red" }}>{error}</p>;
    }

    if (!dress) {
        return <p>Detalji venčanice nisu dostupni.</p>;
    }

    return (
        <div className="container-dress-details">
            <div className="left">
                <div className="name-dress">
                    <div>
                        <h2>{dress.name}</h2>
                    </div>
                    <div>
                        {userRole === "User" && (
                            <button onClick={() => toggleFavorite(dress)}>
                                 <FaHeart className="icon-heart" 
                                    style={{
                                    color: isFavorite(dress.id) ? "red" : "gray", border: "none",}}
                                 />
                            </button>
                        )}
                    </div>
                </div>
                <div className="data">
                    <p>Cena: {dress.price} RSD</p>
                    <p>Status: {dress.status ? "Aktivan" : "Neaktivan"}</p>
                    <p>Veličina: {dress.size}</p>
                    <p>Dužina Haljine: {dress.dressLength}</p>
                </div>
                <div className="btn">
                    {userRole ? (
                        userRole === "User" && (
                            <button onClick={() => navigate("/appointment")}>
                                Napravi termin
                            </button>
                        )
                    ) : (
                        <button onClick={() => navigate("/registration")}>
                            Registrujte se da napravite termin
                        </button>
                    )}
                </div>
            </div>
            <div className="pictures">
                {/* Prikaz svih slika iz urlPhotos */}
                {dress.urlPhotos && dress.urlPhotos.length > 0 ? (
                    <div className="gallery">
                        {dress.urlPhotos.map((photo, index) => (
                            <img
                                key={index}
                                src={photo}
                                alt={`${dress.name} - ${index + 1}`}
                                className="gallery-photo"
                            />
                        ))}
                    </div>
                ) : (
                    <p>Nema dostupnih slika za ovu venčanicu.</p>
                )}
            </div>
        </div>
    );
};

export default DressDetails;
