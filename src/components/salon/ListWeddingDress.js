import React, { useState, useEffect } from "react";
import axios from "axios";

const DressesList = () => {
    const [dresses, setDresses] = useState([]);
    const [error, setError] = useState("");

    // Fetch dresses from API
    useEffect(() => {
        const fetchDresses = async () => {
            try {
                const response = await axios.get("https://localhost:7042/api/Post/owner/{SalonOwnerId}");
                setDresses(response.data);
            } catch (e) {
                console.error("Error fetching dresses:", e);
                setError("Došlo je do greške prilikom učitavanja liste venčanica.");
            }
        };

        fetchDresses();
    }, []);

    // Delete a dress
    const deleteDress = async (weddingDressId) => {
        try {
            await axios.delete(`https://localhost:7042/api/Post/${weddingDressId}`);
            // Update the list after deletion
            setDresses((prevDresses) => prevDresses.filter((weddingDress) => weddingDress.id !== weddingDressId));
        } catch (e) {
            console.error("Error deleting dress:", e);
            setError("Došlo je do greške prilikom brisanja venčanice.");
        }
    };

    return (
        <div>
            <h1>Lista Venčanica</h1>
            {error && <p>{error}</p>}
            {dresses.length > 0 ? (
                dresses.map((weddingDress) => (
                    <div key={weddingDress.id}>
                        <img src={weddingDress.urlPhoto} alt={weddingDress.name} width="200" />
                        <h2>{weddingDress.name}</h2>
                        <p>Cena: {weddingDress.price} RSD</p>
                        <p>Status: {weddingDress.status ? "Aktivan" : "Neaktivan"}</p>
                        <p>Veličina: {weddingDress.size}</p>
                        <p>Dužina Haljine: {weddingDress.dressLength}</p>
                        <button onClick={() => deleteDress(weddingDress.id)}>Obriši</button>
                        <hr />
                    </div>
                ))
            ) : (
                <p>Nema dostupnih venčanica za prikaz.</p>
            )}
        </div>
    );
};

export default DressesList;
