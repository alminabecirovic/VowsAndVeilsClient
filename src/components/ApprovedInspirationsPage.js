import React, { useContext, useEffect, useState, useCallback } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { MyContext } from "../context/my-context";
import "../pages/approved.css";

const ApprovedInspiration = () => {
    const { userRole } = useContext(MyContext);
    const location = useLocation();
    const navigate = useNavigate();
    const { id } = useParams();
    const [inspiration, setInspiration] = useState(location.state?.inspiration || null);
    const [loading, setLoading] = useState(!inspiration);
    const [error, setError] = useState("");
    const fetchInspirationById = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get(`https://localhost:7042/api/Inspiration/${id}`);
            setInspiration(response.data);
        } catch (e) {
            setError("Greška pri učitavanju inspiracije.");
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        if (!inspiration) {
            fetchInspirationById();
        }
    }, [fetchInspirationById, inspiration]);

    if (loading) return <p className="loading-message">Učitavanje inspiracije...</p>;
    if (error) return <p className="error-message">{error}</p>;
    if (!inspiration) return <p className="error-message">Podaci nisu dostupni.</p>;

    return (
        <div className="approved-inspiration-container">
            {inspiration.urlPhotos && inspiration.urlPhotos.length > 0 ? (
                <img src={inspiration.urlPhotos[0]} alt="Inspiracija" className="approved-image" />
            ) : (
                <p className="no-image-message">Nema dostupne slike.</p>
            )}
            <p className="approved-description">{inspiration.text}</p>
            <p className="approved-description">{inspiration.description}</p>

            <button 
                className="inspiration-page-button" 
                onClick={() => navigate(userRole ? "/inspiration" : "/registration")}
            >
                <span className="button-text">
                    {userRole ? "Ostavi svoju inspiraciju" : "Registrujte se inspirisite druge"}
                </span>
                <span className="button-icon">➝</span>
            </button>
        </div>
    );
};

export default ApprovedInspiration;