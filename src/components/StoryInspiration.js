import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../pages/story-inspiration.css";

const InspirationGallery = () => {
    const [inspirations, setInspirations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const token = localStorage.getItem("jwtToken");
    const navigate = useNavigate();

    useEffect(() => {
        fetchInspirations();
    }, []);

    const fetchInspirations = async () => {
        setLoading(true);
        try {
            const response = await axios.get("https://localhost:7042/api/Inspiration/approved", {
                headers: { Authorization: `Bearer ${token}` },
            });

            setInspirations(response.data);
        } catch (e) {
            setError("Greška pri učitavanju odobrenih inspiracija.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="gallery-container">
            {error && <p className="gallery-error">{error}</p>}
            {loading && <p className="gallery-loading">Učitavanje inspiracija...</p>}

            {!loading && inspirations.length === 0 ? (
                <p className="gallery-empty">Nema odobrenih inspiracija.</p>
            ) : (
                <ul className="gallery-list">
                    {inspirations.map((insp) => (
                        <li key={insp.id} className="gallery-item">
                            <div className="gallery">
                                {insp.urlPhotos && insp.urlPhotos.length > 0 ? (
                                    <img
                                        src={insp.urlPhotos[0]} // Učitava samo prvu sliku
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
