import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

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

    // Dohvatanje podataka iz localStorage prilikom učitavanja stranice
    useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const storedDress = JSON.parse(localStorage.getItem("selectedDress"));

    console.log("📌 User iz localStorage-a:", storedUser);
    console.log("📌 Wedding Dress iz localStorage-a:", storedDress);

    // Popravi čitanje userId ako se nalazi unutar user objekta
    const extractedUserId = storedUser?.user?.id || storedUser?.id; // Dodaj ovu liniju
    const extractedDressId = storedDress?.id;

    if (!extractedUserId) {
        console.error("❌ Nedostaje korisnički ID!");
        alert("Greška: Prijavite se ponovo.");
        navigate("/login");
        return;
    }

    if (!extractedDressId) {
        console.error("❌ Nedostaje ID venčanice!");
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
      const token = storedUser?.token;  // Preuzmi token iz localStorage-a
  
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
          startDate: new Date(formData.startDate).toISOString(),  // Pretvaramo u ISO format
          endDate: new Date(formData.endDate).toISOString(),
      };
  
      try {
          const response = await fetch("https://localhost:7042/api/WeddingDress/reserve", {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${token}`  // ✅ Sad je ispravno!
              },
              body: JSON.stringify(appointmentData),
          });
  
          if (!response.ok) {
              const errorText = await response.text();
              console.error("Greška sa backenda:", errorText);
              throw new Error("Zakazivanje termina nije uspelo.");
          }
  
          alert("Termin uspešno zakazan!");
          navigate("/");
      } catch (error) {
          alert("Greška prilikom zakazivanja termina.");
      }
  };
  
  
    

    return (
        <div className="appointment-container">
            <h2>Zakazivanje termina za {dress?.name}</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="firstname"
                    placeholder="Ime"
                    value={formData.firstname}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="lastname"
                    placeholder="Prezime"
                    value={formData.lastname}
                    onChange={handleChange}
                    required
                />
                <input
                    type="tel"
                    name="phoneNumber"
                    placeholder="Telefon"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    required
                />
                <label>Datum početka:</label>
                <input
                    type="datetime-local"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    required
                />
                <label>Datum završetka:</label>
                <input
                    type="datetime-local"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    required
                />
                <button type="submit">Zakaži termin</button>
            </form>
        </div>
    );
};

export default Appointment;