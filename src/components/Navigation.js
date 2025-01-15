import React, { useState, useContext } from "react";
import { MyContext } from "../context/my-context"; 
import { useNavigate } from "react-router-dom";
import Login from "./Login";
import Registration from "./Registration";
import axios from "axios";
import "../pages/navigation.css";

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
      {/* Left Section */}
      <div className="navbar-left">
        {!currentUser && (
          <>
          <button onClick={() => navigate("/login")}>Login</button>
          <button onClick={() => navigate("/registration")}>Register</button>
          </>
        )}
      </div>

      {/* Center Section */}
      <div className="navbar-center">
        <h1>VOWS AND VEILS</h1>
      </div>

      {/* Right Section */}
      <div className="navbar-right">
        {currentUser && (
          <>
            {userRole === "User" && <button onClick={() => navigate("/fav")}>❤️</button>}
            {userRole === "SalonOwner" && <button onClick={() => navigate("/post")}>➕</button>}
            {["User", "SalonOwner", "Admin"].includes(userRole) && (
              <button onClick={handleLogout}>Logout</button>
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
