import React, { useState } from "react";


const Appointment = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    startDate: "",
    endDate: "",
  });

  const [message, setMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleReserve = async () => {
    const token = localStorage.getItem("token"); // Učitaj token iz localStorage-a

    if (!token) {
      setMessage("Nemate ovlašćenje da izvršite ovu radnju. Prijavite se ponovo.");
      return;
    }

    try {
      const response = await fetch("https://localhost:7042/api/WeddingDress/reserve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Dodaj token u Authorization header
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        setMessage("Rezervacija je uspešno sačuvana!");
        console.log(data);
      } else if (response.status === 401) {
        setMessage("Nemate ovlašćenje da izvršite ovu radnju. Prijavite se ponovo.");
      } else {
        setMessage("Došlo je do greške prilikom rezervacije.");
      }
    } catch (error) {
      console.error("Greška:", error);
      setMessage("Došlo je do greške prilikom povezivanja sa serverom.");
    }
  };

  return (
    <div className="appointment-container">
      <h1>Reserve a Wedding Dress</h1>
      <form>
        <label>
          First Name:
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Last Name:
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Phone Number:
          <input
            type="text"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Start Date:
          <input
            type="datetime-local"
            name="startDate"
            value={formData.startDate}
            onChange={handleInputChange}
          />
        </label>
        <label>
          End Date:
          <input
            type="datetime-local"
            name="endDate"
            value={formData.endDate}
            onChange={handleInputChange}
          />
        </label>
        <button type="button" onClick={handleReserve}>
          Reserve
        </button>
      </form>
      {message && <p className="error-message">{message}</p>}
    </div>
  );
};

export default Appointment;
