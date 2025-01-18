import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MyContext } from "../context/my-context";
import "../pages/user-dresses-list.css";

const DressDetails = () => {
    const [dress, setDress] = useState(null); // Detalji venčanice
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true); // Indikator učitavanja
    const { userRole } = useContext(MyContext);
    const navigate = useNavigate();
    const { dressId } = useParams(); // Preuzmi dressId iz URL-a

    // Učitaj listu venčanica sa servera i filtriraj prema dressId
    useEffect(() => {
        const fetchDresses = async () => {
            try {
                setLoading(true);
                const response = await fetch(process.env.REACT_APP_API_URL || "https://localhost:7042/api/Post");
                if (!response.ok) {
                    throw new Error("Greška prilikom učitavanja venčanica");
                }
                const data = await response.json();

                // Filtriraj venčanicu prema dressId
                const selectedDress = data.find((item) => item.id === parseInt(dressId));
                if (!selectedDress) {
                    throw new Error("Venčanica sa datim ID-jem nije pronađena.");
                }
                setDress(selectedDress);
            } catch (e) {
                console.error("Error fetching dress details:", e);
                setError("Došlo je do greške prilikom učitavanja detalja venčanice.");
            } finally {
                setLoading(false);
            }
        };

        fetchDresses();
    }, [dressId]);

    if (loading) {
        return <p>Učitavanje detalja venčanice...</p>;
    }

    if (error) {
        return <p style={{ color: "red" }}>{error}</p>;
    }

    if (!dress) {
        return <p>Detalji venčanice nisu dostupni.</p>;
    }

    return (
        <div className="container-dress-details">
            <img src={dress.urlPhotos[0]} alt={dress.name} width="300" />
            <h2>{dress.name}</h2>
            <p>Cena: {dress.price} RSD</p>
            <p>Status: {dress.status ? "Aktivan" : "Neaktivan"}</p>
            <p>Veličina: {dress.size}</p>
            <p>Dužina Haljine: {dress.dressLength}</p>
            {userRole ? (
            userRole === "User" && (
                <button
                    onClick={() => navigate("/appointment")}
                >
                    Napravi termin
                </button>
                )
            ) : (
                <button
                    onClick={() => navigate("/registration")}
                >
                    Registrujte se da napravite termin
                </button>
            )}

        </div>
    );
};

export default DressDetails;
