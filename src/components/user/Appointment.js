import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import '../../pages//appointment.css';

const Appointment = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstname: "",
        lastname: "",
        phoneNumber: "",
        startDate: "",
        endDate: "",
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
            firstname: formData.firstname,
            lastname: formData.lastname,
            phoneNumber: formData.phoneNumber,
            startDate: formData.startDate,
            endDate: formData.endDate,
        };

        try {
            const response = await fetch("https://localhost:7042/api/WeddingDress/reserve", {
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

    return (
        <div className="appointment-container">
            <div className="appointment-card">
                <div className="appointment-header">
                    <h2 className="appointment-title">
                        Zakazivanje termina
                    </h2>
                    {dress && (
                        <p className="appointment-subtitle">
                            za {dress.name}
                        </p>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="appointment-form">
                    <div className="form-grid">
                        <div className="input-group">
                            <div className="input-icon">
                                
                            </div>
                            <input
                                type="text"
                                name="firstname"
                                placeholder="Ime"
                                value={formData.firstname}
                                onChange={handleChange}
                                required
                                className="form-input"
                            />
                        </div>

                        <div className="input-group">
                            <div className="input-icon">
                               
                            </div>
                            <input
                                type="text"
                                name="lastname"
                                placeholder="Prezime"
                                value={formData.lastname}
                                onChange={handleChange}
                                required
                                className="form-input"
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <div className="input-icon">
                          
                        </div>
                        <input
                            type="tel"
                            name="phoneNumber"
                            placeholder="Telefon"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            required
                            className="form-input"
                        />
                    </div>

                    <div className="date-group">
                        <div>
                            <label className="input-label">
                               
                                Datum početka
                            </label>
                            <input
                                type="datetime-local"
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleChange}
                                required
                                className="date-input"
                            />
                        </div>

                        <div>
                            <label className="input-label">
                                
                                Datum završetka
                            </label>
                            <input
                                type="datetime-local"
                                name="endDate"
                                value={formData.endDate}
                                onChange={handleChange}
                                required
                                className="date-input"
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