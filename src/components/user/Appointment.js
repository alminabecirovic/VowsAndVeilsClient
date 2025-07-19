import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import '../../pages//appointment.css';

const Appointment = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        Date: "",
    });

    const [userId, setUserId] = useState(null);
    const [weddingDressId, setWeddingDressId] = useState(null);
    const [dress, setDress] = useState(null);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        const storedDress = JSON.parse(localStorage.getItem("selectedDress"));

        const extractedUserId = storedUser?.user?.id || storedUser?.id;
        const extractedDressId = storedDress?.id;

        if (!extractedUserId) {
            alert("Greška: Prijavite se ponovo.");
            navigate("/login");
            return;
        }

        if (!extractedDressId) {
            alert("Greška: Vratite se nazad i pokušajte ponovo.");
            navigate("/dress-details");
            return;
        }

        setUserId(extractedUserId);
        setWeddingDressId(extractedDressId);
        setDress(storedDress);
    }, [navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const izabraniDatum = new Date(formData.Date);
        const sada = new Date();
        sada.setSeconds(0);
        sada.setMilliseconds(0);

        if (izabraniDatum <= sada) {
            alert("Ne možete zakazati termin u prošlosti ili za isto vreme.");
            return;
        }

        const storedUser = JSON.parse(localStorage.getItem("user"));
        const token = storedUser?.token;

        if (!token) {
            alert("Morate biti prijavljeni da biste zakazali termin.");
            navigate("/login");
            return;
        }

        const appointmentData = {
            userId,
            weddingDressId,
            Date: formData.Date,
        };

        try {
            const response = await fetch("https://vowsandveils-api-production.up.railway.app/api/WeddingDress/reserve", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(appointmentData),
            });

            if (!response.ok) throw new Error("Zakazivanje termina nije uspelo.");

            alert("Termin uspešno zakazan!");
            navigate("/");
        } catch (error) {
            alert("Greška prilikom zakazivanja termina.");
        }
    };

    // 📍 Minimalno vreme za input (da ne može nazad)
    const getMinDateTime = () => {
        const now = new Date();
        now.setMinutes(now.getMinutes() + 1);
        return now.toISOString().slice(0, 16);
    };

    return (
        <div className="appointment-container">
            <div className="appointment-card">
                <div className="appointment-header">
                    {dress && (
                        <p className="appointment-subtitle">
                            za {dress.name}, veličina {dress.size}
                        </p>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="appointment-form">
                    <div className="date-group">
                        <div>
                            <label className="input-label">
                                Datum probe:
                            </label>
                            <input
                                type="datetime-local"
                                name="Date"
                                value={formData.Date}
                                onChange={handleChange}
                                required
                                className="date-input"
                                min={getMinDateTime()}
                            />
                        </div>
                    </div>

                    <div className="submit-button-container">
                        <button
                            type="submit"
                            className="submit-button"
                        >
                            Zakaži termin
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Appointment;
