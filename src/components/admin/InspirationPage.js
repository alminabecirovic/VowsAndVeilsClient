import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../pages/inspiration-page.css";

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

    // ✅ Funkcija za odobravanje inspiracije
    const handleApprove = async (id) => {
        try {
            await axios.put(`https://localhost:7042/api/Inspiration/approve/${id}?approve=true`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setPendingInspirations((prev) => prev.filter((insp) => insp.id !== id));

            const approvedInspiration = pendingInspirations.find((insp) => insp.id === id);
            if (approvedInspiration) {
                setApprovedInspirations((prev) => [...prev, approvedInspiration]);
            }
        } catch (e) {
            setError("Greška prilikom odobravanja inspiracije.");
        }
    };

    // ✅ Funkcija za brisanje inspiracije (kada se odbije)
   const handleDelete = async (id) => {
    try {
        await axios.delete(`https://localhost:7042/api/Inspiration/delete/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        // Ukloni obrisanu inspiraciju iz stanja
        setPendingInspirations((prev) => prev.filter((insp) => insp.id !== id));
    } catch (e) {
        setError("Greška prilikom brisanja inspiracije.");
    }
};


    return (
        <div className="inspiration-page-container">
            {error && <p className="error-message">{error}</p>}
            {loading ? (
                <p>Učitavanje inspiracija...</p>
            ) : (
                <div className="inspiration-columns">
                    {/* Approved Inspirations */}
                    <div className="inspiration-column">
                        <h2>Odobrene inspiracije</h2>
                        {approvedInspirations.length === 0 ? (
                            <p>Nema odobrenih inspiracija.</p>
                        ) : (
                            <ul className="inspiration-list">
                                {approvedInspirations.map((insp) => (
                                    <li key={insp.id} className="inspiration-item">
                                        <div className="image-container-admin" data-text={`${insp.text} - ${insp.description}`}>
                                            <img src={insp.urlPhotos[0]} alt="Slika inspiracije" className="inspiration-image" />
                                        </div>
                                        <p><strong>{insp.text}</strong></p>
                                        <p>{insp.description}</p>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Pending Inspirations */}
                    <div className="inspiration-column">
                        <h2>Inspiracije na čekanju</h2>
                        {pendingInspirations.length === 0 ? (
                            <p>Nema inspiracija na čekanju.</p>
                        ) : (
                            <ul className="inspiration-list">
                                {pendingInspirations.map((insp) => (
                                    <li key={insp.id} className="inspiration-item">
                                        <div className="image-container-admin" data-text={`${insp.text} - ${insp.description}`}>
                                            <img src={insp.urlPhotos[0]} alt="Slika inspiracije" className="inspiration-image" />
                                        </div>
                                        <p><strong>{insp.text}</strong></p>
                                        <p>{insp.description}</p>
                                        <div className="button-group">
                                        <button onClick={() => handleApprove(insp.id)} className="button1 btn1-approve"> <span className="button-icon">←</span>Odobri  </button>
                                        <button onClick={() => handleDelete(insp.id)} className="button1 btn1-delete">Odbij <span className="button-icon">➝</span> </button>

                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default InspirationPage;
