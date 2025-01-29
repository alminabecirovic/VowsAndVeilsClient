import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../pages/dresses-list.css";

const DressesList = () => {
    const [dresses, setDresses] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    // Funkcija za dohvaćanje liste venčanica
    const fetchDresses = async () => {
        const token = localStorage.getItem("jwtToken");

        if (!token) {
            setError("Niste prijavljeni. Molimo prijavite se ponovo.");
            setLoading(false);
            return;
        }

        try {
            setLoading(true); // Prikazuje loading dok traje dohvaćanje
            const response = await axios.get(
                "https://localhost:7042/api/Post/owner/wedding-dresses",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            console.log("Dohvaćeni podaci sa servera:", response.data);

            if (Array.isArray(response.data)) {
                setDresses(response.data); // Postavi venčanice ako je odgovor niz
                console.log("Postavljen dresses state:", response.data);
                setError("");
            } else {
                throw new Error("Nepoznat format odgovora sa servera.");
            }
        } catch (e) {
            console.error("Greška prilikom dohvaćanja venčanica:", e.response || e.message);
            setError(
                e.response?.data?.message ||
                "Došlo je do greške prilikom učitavanja liste venčanica."
            );
        } finally {
            setLoading(false);
        }
    };

    // Funkcija za dodavanje nove venčanice direktno u state
    const addNewDress = (newDress) => {
        setDresses((prevDresses) => [...prevDresses, newDress]);
        console.log("Nova venčanica dodata u state:", newDress);
    };

    // useEffect za inicijalno dohvaćanje venčanica
    useEffect(() => {
        fetchDresses();
    }, []);

    // Funkcija za brisanje venčanice
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
            console.log(`Venčanica sa ID ${weddingDressId} je obrisana.`);

            // Osvežavanje liste nakon brisanja
            setDresses((prevDresses) =>
                prevDresses.filter((weddingDress) => weddingDress.id !== weddingDressId)
            );
            setError("");
        } catch (e) {
            console.error("Greška prilikom brisanja venčanice:", e.response || e.message);
            setError(
                e.response?.data?.message || "Došlo je do greške prilikom brisanja venčanice."
            );
        }
    };

    return (
        <div className="dresses-container">
            <h1>Lista Venčanica</h1>

            {/* Loading indikator */}
            {loading && <p className="loading-message">Učitavanje...</p>}

            {/* Prikaz greške */}
            {error && !loading && <p className="error-message">{error}</p>}

            {/* Prikaz venčanica */}
            {!loading && dresses.length > 0 ? (
                <div className="dresses-grid">
                    {dresses.map((weddingDress, index) => {
                        console.log(`Rendering dress #${index}:`, weddingDress);
                        return (
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
                                <button
                                    onClick={() => deleteDress(weddingDress.id)}
                                    className="delete-button"
                                >
                                    Obriši
                                </button>
                            </div>
                        );
                    })}
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
