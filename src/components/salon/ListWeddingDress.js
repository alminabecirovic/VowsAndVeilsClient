import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../pages/dresses-list.css";

const DressesList = () => {
    const [dresses, setDresses] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    const fetchDresses = async () => {
        const token = localStorage.getItem("jwtToken");

        if (!token) {
            setError("Niste prijavljeni. Molimo prijavite se ponovo.");
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const response = await axios.get(
                "https://localhost:7042/api/Post/owner/wedding-dresses",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (Array.isArray(response.data)) {
                setDresses(response.data);
                setError("");
            } else {
                throw new Error("Nepoznat format odgovora sa servera.");
            }
        } catch (e) {
            setError(
                e.response?.data?.message ||
                "Došlo je do greške prilikom učitavanja liste venčanica."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDresses();
    }, []);

    const deleteDress = async (weddingDressId) => {
        const token = localStorage.getItem("jwtToken");

        if (!token) {
            setError("Niste prijavljeni. Molimo prijavite se ponovo.");
            return;
        }

        try {
            await axios.delete(`https://localhost:7042/api/Post/${weddingDressId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setDresses((prevDresses) =>
                prevDresses.filter((weddingDress) => weddingDress.id !== weddingDressId)
            );
            setError("");
        } catch (e) {
            setError(
                e.response?.data?.message || "Došlo je do greške prilikom brisanja venčanice."
            );
        }
    };

    return (
        <div className="dresses-container">
            <h1>Lista Venčanica</h1>
            {loading && <p className="loading-message">Učitavanje...</p>}
            {error && !loading && <p className="error-message">{error}</p>}
            {!loading && dresses.length > 0 ? (
                <div className="dresses-grid">
                    {dresses.map((weddingDress) => (
                        <div key={weddingDress.id} className="dress-card">
                            <div className="photos-container">
                                {weddingDress.urlPhotos.map((photoUrl, i) => (
                                    <img
                                        key={i}
                                        src={photoUrl}
                                        alt={`${weddingDress.name} - ${i + 1}`}
                                        className="dress-photo"
                                    />
                                ))}
                            </div>
                            <h2>{weddingDress.name}</h2>
                            <p>Cena: {weddingDress.price} RSD</p>
                            <p>Status: {weddingDress.status ? "Aktivan" : "Neaktivan"}</p>
                            <p>Veličina: {weddingDress.size}</p>
                            <p>Dužina Haljine: {weddingDress.dressLength}</p>
                            <p>Grad: {weddingDress.city}</p>
                            <p>Adresa: {weddingDress.address}</p>
                            <p>Salon: {weddingDress.salonName}</p>
                            <button
                                onClick={() => deleteDress(weddingDress.id)}
                                className="delete-button"
                            >
                                Obriši
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                !loading && (
                    <p className="no-dresses">
                        Nema dostupnih venčanica za prikaz. Kreirajte novu venčanicu ili osvežite stranicu.
                    </p>
                )
            )}
        </div>
    );
};

export default DressesList;
