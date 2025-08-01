import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../pages/appointments-list.css";

const AppointmentPage = () => {
    const [appointments, setAppointments] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAppointments = async () => {
            const storedUser = JSON.parse(localStorage.getItem("user"));
            const token = storedUser?.token;
            const salonOwnerId = storedUser?.user?.id || storedUser?.id;

            if (!token || !salonOwnerId) {
                setError("Nemate pristup ovoj stranici.");
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(
                    `https://vowsandveils-api-production.up.railway.app/api/Post/appoitments/${salonOwnerId}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                setAppointments(Array.isArray(response.data) ? response.data : []);
                setError("");
            } catch (e) {
                setError("Došlo je do greške prilikom učitavanja termina.");
            } finally {
                setLoading(false);
            }
        };

        fetchAppointments();
    }, []);

    return (
        <div className="appointments-container">
            {loading && <p className="loading-message">Učitavanje...</p>}
            {error && !loading && <p className="error-message">{error}</p>}

            {!loading && appointments.length > 0 ? (
                <table className="appointments-table">
                    <thead>
                        <tr>
                            <th>Ime</th>
                            <th>Prezime</th>
                            <th>Email</th>
                            <th>Datum </th>
                            <th>Ime venčanice</th>
                            <th>Broj venčanice</th>
                        </tr>
                    </thead>
                    <tbody>
                        {appointments.map((appointment) => (
                            <tr key={appointment.id}>
                                <td>{appointment.firstname}</td>
                                <td>{appointment.lastname}</td>
                                <td>{appointment.email}</td>
                                <td>{new Date(appointment.date).toLocaleString()}</td>
                                <td>{appointment.weddingDressName || "Nepoznato"}</td>
                                <td>{appointment.weddingDressSize || "Nepoznato"}</td>

                            </tr>
                        ))}
                
                    </tbody>
                </table>
            ) : (
                !loading && <p className="no-appointments">Nema dostupnih termina za prikaz.</p>
            )}
        </div>
    );
};

export default AppointmentPage;