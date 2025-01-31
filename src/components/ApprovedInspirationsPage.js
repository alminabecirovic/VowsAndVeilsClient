import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const ApprovedInspirationsPage = () => {
    const [approvedInspirations, setApprovedInspirations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const token = localStorage.getItem("jwtToken");
    const navigate = useNavigate();

    useEffect(() => {
        loadApprovedInspirations();
    }, []);

    const loadApprovedInspirations = async () => {
        setLoading(true);
        try {
            const response = await axios.get("https://localhost:7042/api/Inspiration/approved", {
                headers: { Authorization: `Bearer ${token}` },
            });

            setApprovedInspirations(response.data);
        } catch (e) {
            setError("Greška pri učitavanju odobrenih inspiracija.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="approved-inspirations-container">
            <h1>Odobrene Inspiracije</h1>

            {error && <p className="error-message">{error}</p>}
            {loading && <p>Učitavanje inspiracija...</p>}

            {approvedInspirations.length === 0 ? (
                <p>Nema odobrenih inspiracija.</p>
            ) : (
                <ul className="inspiration-list">
                    {approvedInspirations.map((insp) => (
                        <li key={insp.id} className="inspiration-item">
                            <img src={insp.urlPhotos[0]} alt="Slika inspiracije" className="inspiration-image" />
                            <p>{insp.text}</p>
                        </li>
                    ))}
                </ul>
            )}

            <button className="inspiration-page-button" onClick={() => navigate("/inspiration")}>
                Idi na Inspiration Page
            </button>
        </div>
    );
};

export default ApprovedInspirationsPage;
