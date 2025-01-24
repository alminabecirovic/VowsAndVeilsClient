import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../pages/dresses-list.css";

const DressesList = () => {
    const [dresses, setDresses] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchDresses = async () => {
            try {
                const response = await axios.get(
                    "https://localhost:7042/api/Post/owner/{SalonOwnerId}"
                );
                setDresses(response.data);
            } catch (e) {
                console.error("Error fetching dresses:", e);
                setError("Došlo je do greške prilikom učitavanja liste venčanica.");
            }
        };

        fetchDresses();
    }, []);

    const deleteDress = async (weddingDressId) => {
        try {
            await axios.delete(`https://localhost:7042/api/Post/${weddingDressId}`);
            setDresses((prevDresses) =>
                prevDresses.filter((weddingDress) => weddingDress.id !== weddingDressId)
            );
        } catch (e) {
            console.error("Error deleting dress:", e);
            setError("Došlo je do greške prilikom brisanja venčanice.");
        }
    };

    return (
        <div className="dresses-container">
            <h1>Lista Venčanica</h1>
            {error && <p className="error-message">{error}</p>}
            <div className="dresses-grid">
                {dresses.length > 0 ? (
                    dresses.map((weddingDress) => (
                        <div key={weddingDress.id} className="dress-card">
                            <div className="photos-container">
                                {weddingDress.urlPhotos.map((photoUrl, index) => (
                                    <img
                                        key={index}
                                        src={photoUrl}
                                        alt={`${weddingDress.name} - ${index + 1}`}
                                        className="dress-photo"
                                    />
                                ))}
                            </div>
                            <h2>{weddingDress.name}</h2>
                            <p>Cena: {weddingDress.price} RSD</p>
                            <p>Status: {weddingDress.status ? "Aktivan" : "Neaktivan"}</p>
                            <p>Veličina: {weddingDress.size}</p>
                            <p>Dužina Haljine: {weddingDress.dressLength}</p>
                            <button
                                onClick={() => deleteDress(weddingDress.id)}
                                className="delete-button"
                            >
                                Obriši
                            </button>
                        </div>
                    ))
                ) : (
                    <p className="no-dresses">Nema dostupnih venčanica za prikaz.</p>
                )}
            </div>
        </div>
    );
};

export default DressesList;