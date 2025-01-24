import React, { useState, useContext } from "react";
import { FaHeart } from "react-icons/fa";
import { MyContext } from "../context/my-context"; 
import { useNavigate } from "react-router-dom";
import Login from "./Login";
import Registration from "./Registration";
import axios from "axios";
import "../pages/navbar.css";

const Navbar = () => {
  const { userRole, currentUser, setUserFunction, setRoleFunction } =
    useContext(MyContext);
  const [isLoginOpen, setIsLoginOpen] = useState(false); 
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const navigate = useNavigate();

  const handleLogout = () => {
    if (currentUser) {
      setUserFunction(null);
      setRoleFunction("");
      localStorage.removeItem("user");
      localStorage.removeItem("jwtToken");
      axios.defaults.headers.common["Authorization"] = "";
    }
    setIsLoginOpen(false);
    setIsRegisterOpen(false);
    navigate("/");
  };

  const handleLoginSuccess = (responseData) => {
    setUserFunction(responseData);
    setRoleFunction(responseData.roles);

    localStorage.setItem("user", JSON.stringify(responseData));
    localStorage.setItem("jwtToken", responseData.token);

    axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${responseData.token}`;

    setIsLoginOpen(false);
    navigate("/home");
  };

  return (
    <nav className="navbar">

      <div className="navbar-left">
        {!currentUser && (
          <>
          <button onClick={() => navigate("/login")}>Prijavi se</button>
          <button onClick={() => navigate("/registration")}>Registruj se</button>
          </>
        )}
      </div>

      <div className="navbar-center">
        <img 
          src={process.env.PUBLIC_URL + "/images/logo2.png"} // Putanja do slike
          alt="Logo" 
          className="navbar-logo"
        />
      </div>

      <div className="navbar-right">
      {currentUser && (
    <>
            {userRole === "User" && (<button onClick={() => navigate("/fav")}>Omiljene venčanice </button>)}
            {userRole === "SalonOwner" && <button onClick={() => navigate("/post")}>Kreiraj post</button>}
            {["User", "SalonOwner", "Admin"].includes(userRole) && (
              <button onClick={handleLogout}>Odjavi se</button>
            )}
          </>
        )}
      </div>

      {/* Modals for Login and Registration */}
      {isLoginOpen && (
        <Login
          onLoginSuccess={handleLoginSuccess}
          onClose={() => setIsLoginOpen(false)}
        />
      )}
      {isRegisterOpen && (
        <Registration
          onClose={() => setIsRegisterOpen(false)}
        />
      )}
    </nav>
  );
};

export default Navbar;
