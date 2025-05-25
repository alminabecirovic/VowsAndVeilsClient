import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { MyContext } from "../context/my-context";
import axios from "axios";
import "../pages/verify-account.css"

const VerifyAccount = () => {
  const [userCode, setUserCode] = useState("");
  const navigate = useNavigate();
  const { setUserFunction } = useContext(MyContext);

  const handleVerification = async (e) => {
    e.preventDefault();
  
    const storedCode = localStorage.getItem("verificationCode");
  
    if (userCode === storedCode) {
      alert("Uspešno ste verifikovani!");
  
      const userData = JSON.parse(localStorage.getItem("userData"));
      const userRole = userData?.Roles; // Pravilno dohvaćanje uloge korisnika
  
      console.log("Slanje podataka za registraciju:", userData);
  
      try {
        await axios.post("https://localhost:7042/api/User/register", userData, {
          headers: { "Content-Type": "application/json" },
        });
  
        // Brisanje podataka iz localStorage nakon uspešne registracije
        localStorage.removeItem("verificationCode");
        localStorage.removeItem("userEmail");
        localStorage.removeItem("userData");
  
        if (userRole === "SalonOwner") {
          navigate("/login");
        } else if (userRole === "User") {
          navigate("/login");
        } else {
          navigate("/");
        }
      } catch (e) {
        console.error("Greška pri registraciji nakon verifikacije:", e.response?.data || e.message);
      }
    } else {
      alert("Kod nije ispravan, pokušajte ponovo.");
    }
  };
  

  return (
    <div className="verify-page">
      <form onSubmit={handleVerification} className="formic">
        <h2 className="h22">Verifikujte svoj nalog</h2>
        <input
        className="put"
          type="text"
          value={userCode}
          onChange={(e) => setUserCode(e.target.value)}
          placeholder="Unesite kod sa vašeg mejla"
          required
        />
        <button type="submit" className="verify">Verifikuj</button>
      </form>
    </div>
  );
};

export default VerifyAccount;