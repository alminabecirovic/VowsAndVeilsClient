import React, { useEffect, useState, useContext, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../pages/story-inspiration.css";
import { MyContext } from "../context/my-context";

const InspirationGallery = () => {
    const { userRole } = useContext(MyContext);
    const [inspirations, setInspirations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const token = localStorage.getItem("jwtToken");
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false); 

    const fetchInspirations = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get("https://vowsandveils-api-production.up.railway.app/api/Inspiration/approved", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setInspirations(response.data);
        } catch (e) {
            setError("Greška pri učitavanju odobrenih inspiracija.");
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchInspirations();
    }, [fetchInspirations]);

    const toggleDropdown = () => setIsOpen(!isOpen);

    return (
        <div className="gallery-container">
            <div style={{ position: 'relative', display: 'inline-block' }}>
                <button onClick={toggleDropdown}>Meni ▼</button>
                {isOpen && (
                    <ul>
                        <li><a href="#">1</a></li>
                        <li><a href="#">2</a></li>
                        <li><a href="#"> 3</a></li>
                    </ul>
                )}
            </div>

            {error && <p className="gallery-error">{error}</p>}
            {loading && <p className="gallery-loading">Učitavanje inspiracija...</p>}

            {!loading && inspirations.length === 0 ? (
                <div className="gallery-empty-container">
                    <p className="gallery-empty">Nema odobrenih inspiracija.</p>
                    <button
                        className="inspiration-page-button1"
                        onClick={() => navigate(userRole ? "/inspiration" : "/registration")}
                    >
                        <span className="button-text">
                            {userRole ? "Ostavi svoju inspiraciju" : "Registrujte se i inspirišite druge"}
                        </span>
                        <span className="button-icon">➝</span>
                    </button>
                </div>
            ) : (
                <ul className="gallery-list">
                    {inspirations.map((insp) => (
                        <li key={insp.id} className="gallery-item">
                            <div className="gallery">
                                {insp.urlPhotos && insp.urlPhotos.length > 0 ? (
                                    <img
                                        src={insp.urlPhotos[0]}
                                        alt="Slika inspiracije"
                                        className="gallery-image"
                                        onClick={() => navigate(`/approved/${insp.id}`, { state: { inspiration: insp } })}
                                    />
                                ) : (
                                    <p>Nema dostupnih slika.</p>
                                )}
                            </div>
                            <p className="gallery-description">{insp.text}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default InspirationGallery;
