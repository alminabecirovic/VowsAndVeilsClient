import React, { useEffect, useState } from "react";
import axios from "axios";
import "../pages/inspiration-page.css";

const InspirationPage = () => {
    const [pendingInspirations, setPendingInspirations] = useState([]);
    const [approvedInspirations, setApprovedInspirations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const token = localStorage.getItem("jwtToken");

    useEffect(() => {
        loadInspirations();
    }, []);

    const loadInspirations = async () => {
        setLoading(true);
        try {
            const [pendingRes, approvedRes] = await Promise.all([
                axios.get("https://localhost:7042/api/Inspiration/pending", {
                    headers: { Authorization: `Bearer ${token}` },
                }),
                axios.get("https://localhost:7042/api/Inspiration/approved", {
                    headers: { Authorization: `Bearer ${token}` },
                })
            ]);

            setPendingInspirations(pendingRes.data);
            setApprovedInspirations(approvedRes.data);
        } catch (e) {
            setError("Greška pri učitavanju inspiracija.");
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (id, approve) => {
        try {
            await axios.put(`https://localhost:7042/api/Inspiration/approve/${id}?approve=${approve}`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setPendingInspirations(pendingInspirations.filter(insp => insp.id !== id));
            if (approve) loadInspirations(); // Ako je odobreno, osvežavamo listu odobrenih
        } catch (e) {
            setError(`Greška prilikom ${approve ? "odobravanja" : "odbijanja"} inspiracije.`);
        }
    };

    return (
        <div className="inspiration-page-container">
            <h1>Upravljanje Inspiracijama</h1>

            {error && <p className="error-message">{error}</p>}
            {loading && <p>Učitavanje inspiracija...</p>}

            {/* Pending Inspirations */}
            <h2>Inspiracije na čekanju</h2>
            {pendingInspirations.length === 0 ? (
                <p>Nema inspiracija na čekanju.</p>
            ) : (
                <ul className="inspiration-list">
                    {pendingInspirations.map((insp) => (
                        <li key={insp.id} className="inspiration-item">
                            <img src={insp.urlPhotos[0]} alt="Slika inspiracije" className="inspiration-image" />
                            <p>{insp.text}</p>
                            <div className="button-group">
                                <button onClick={() => handleAction(insp.id, true)} className="approve-button">Odobri</button>
                                <button onClick={() => handleAction(insp.id, false)} className="reject-button">Odbij</button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            {/* Approved Inspirations */}
            <h2>Odobrene inspiracije</h2>
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
        </div>
    );
};

export default InspirationPage;
