import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import { MyContext } from "../context/my-context";
import "../pages/dress-details.css";

const DressDetails = () => {
    const [dress, setDress] = useState(null);
    const [favorites, setFavorites] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const { userRole } = useContext(MyContext);
    const navigate = useNavigate();
    const { dressId } = useParams();

    useEffect(() => {
        const fetchDresses = async () => {
            try {
                setLoading(true);
                const response = await fetch(
                    process.env.REACT_APP_API_URL || "https://vowsandveils-api-production.up.railway.app/api/Post"
                );
                if (!response.ok) {
                    throw new Error("Greška prilikom učitavanja venčanica");
                }
                const data = await response.json();
                const selectedDress = data.find((item) => item.id === parseInt(dressId));
                if (!selectedDress) {
                    throw new Error("Venčanica sa datim ID-jem nije pronađena.");
                }
                setDress(selectedDress);
            } catch (e) {
                setError("Došlo je do greške prilikom učitavanja detalja venčanice.");
            } finally {
                setLoading(false);
            }
        };
        fetchDresses();
    }, [dressId]);

    useEffect(() => {
        const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
        setFavorites(storedFavorites);
    }, []);

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

    const handleAppointmentClick = () => {
        if (dress) {
            localStorage.setItem("selectedDress", JSON.stringify(dress)); // ✅ Čuvanje venčanice pre navigacije
            navigate("/appointment");
        } else {
            alert("Greška: Podaci o venčanici nisu dostupni.");
        }
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
                    <h2>{dress.name}</h2>
                    {userRole === "User" && (
                        <button onClick={() => toggleFavorite(dress)}>
                            <FaHeart className="icon-heart"
                                style={{ color: isFavorite(dress.id) ? "red" : "gray", border: "none" }}
                            />
                        </button>
                    )}
                </div>
                <div className="data">
                    <p>Cena: {dress.price} RSD</p>
                    <p>Status: {dress.status ? "Aktivan" : "Neaktivan"}</p>
                    <p>Veličina: {dress.size}</p>
                    <p>Dužina Haljine: {dress.dressLength}</p>
                    <p>Grad: {dress.city}</p>
                    <p>Adresa: {dress.address}</p>
                    <p>Salon: {dress.salonName}</p>
                </div>
                <div className="btn">
                    {userRole ? (
                        userRole === "User" && (
                            <button onClick={handleAppointmentClick}>
                            <span className="button-text">Napravi termin</span>
                            <span className="button-icon">➝</span>
                            </button>
                            
                        )
                    ) : (
                        <button onClick={() => navigate("/registration")}>
                              <span className="button-text">Registrujte se i napravite termin</span>
                              <span className="button-icon">➝</span>
                        </button>
                    )}
                </div>
            </div>
            <div className="pictures">
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
