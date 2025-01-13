import React, { useState } from "react";
import axios from "axios";

const ReserveWeddingDress = () => {
  const [reservation, setReservation] = useState({
    weddingDressId: "",
    reservationDate: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReservation((prev) => ({ ...prev, [name]: value }));
  };

  const handleReserve = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      await axios.post("/api/WeddingDress/reserve", reservation);
      setMessage("Rezervacija venčanice je uspešno izvršena!");
    } catch (err) {
      if (err.response && err.response.status === 400) {
        setError(err.response.data.message || "Došlo je do greške prilikom rezervacije.");
      } else {
        setError("Došlo je do greške na serveru. Pokušajte ponovo kasnije.");
      }
    }
  };

  return (
    <div>
      <h1>Reserve a Wedding Dress</h1>
      <form onSubmit={handleReserve}>
        <div>
          <label>Wedding Dress ID:</label>
          <input
            type="text"
            name="weddingDressId"
            value={reservation.weddingDressId}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Reservation Date:</label>
          <input
            type="datetime-local"
            name="reservationDate"
            value={reservation.reservationDate}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit">Reserve</button>
      </form>

      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default ReserveWeddingDress;
