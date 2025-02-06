import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { MyContext } from "../context/my-context";
import axios from "axios";

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

      try {
        await axios.post("https://localhost:7168/api/User/register", userData);

        localStorage.removeItem("verificationCode");
        localStorage.removeItem("userEmail");
        localStorage.removeItem("userData");

        //navigate("/login");
        const userRole = localStorage.getItem("userRole");

        if (userRole === "BungalowOwner") {
          navigate("/create_advertisement");
        } else if (userRole === "User") {
          navigate("/user_home");
        } else {
          navigate("/");
        }
      } catch (e) {
        console.error(" Greška pri registraciji nakon verifikacije:", e);
      }
    } else {
      alert("Kod nije ispravan, pokušajte ponovo.");
    }
  };

  return (
    <div className="verify-page">
      <form onSubmit={handleVerification}>
        <h2>Verifikujte svoj nalog</h2>
        <label>Verifikacioni kod</label>
        <input
          type="text"
          value={userCode}
          onChange={(e) => setUserCode(e.target.value)}
          placeholder="Enter the code sent to your email"
          required
        />
        <button type="submit">Verifikuj</button>
      </form>
    </div>
  );
};

export default VerifyAccount;