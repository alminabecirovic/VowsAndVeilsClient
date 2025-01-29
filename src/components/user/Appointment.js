import React, { useState } from "react";
import axios from "axios";

const ReserveWeddingDress = () => {
  const [reservation, setReservation] = useState({
    firstname: "",
    lastname: "",
    phoneNumber: "",
    startDate: "",
    endDate: "",
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

    const token = localStorage.getItem("jwtToken");


    console.log("Token pre slanja zahteva:", token);
    console.log("Podaci za rezervaciju:", reservation);

    if (!token) {
      setError("Nemate validan token. Prijavite se ponovo.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:7042/api/WeddingDress/reserve", 
        reservation,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            
          },
        }
      );
      console.log("Odgovor sa backend-a:", response.data);
      setMessage("Rezervacija venčanice je uspešno izvršena!");
    } catch (err) {
      console.error("Greška prilikom slanja zahteva:", err.response ? err.response.data : err);

      if (err.response) {
        if (err.response.status === 400) {
          setError(err.response.data.message || "Došlo je do greške prilikom rezervacije.");
        } else if (err.response.status === 401) {
          setError("Nemate ovlašćenje da izvršite ovu radnju. Prijavite se ponovo.");
        } else {
          setError("Došlo je do greške na serveru. Pokušajte ponovo kasnije.");
        }
      } else {
        setError("Nije moguće povezivanje sa serverom.");
      }
    }
  };

  return (
    <div>
      <h1>Reserve a Wedding Dress</h1>
      <form onSubmit={handleReserve}>
        <div>
          <label>First Name:</label>
          <input
            type="text"
            name="firstname"
            value={reservation.firstname}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Last Name:</label>
          <input
            type="text"
            name="lastname"
            value={reservation.lastname}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Phone Number:</label>
          <input
            type="tel"
            name="phoneNumber"
            value={reservation.phoneNumber}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Start Date:</label>
          <input
            type="datetime-local"
            name="startDate"
            value={reservation.startDate}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>End Date:</label>
          <input
            type="datetime-local"
            name="endDate"
            value={reservation.endDate}
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
