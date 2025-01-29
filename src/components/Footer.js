import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { MyContext } from "../context/my-context";
import "../pages/footer.css";

const Footer = () => {
  const { currentUser, setUserFunction, setRoleFunction } = useContext(MyContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    setUserFunction(null);
    setRoleFunction("");
    localStorage.removeItem("user");
    localStorage.removeItem("jwtToken");
    navigate("/");
  };

  return (
    <footer className="footer">
      <div className="footer-left">
        <p className="footer-message">Ti si vredna, osećaj se posebnom!</p>
        
      </div>
      <div className="footer-center">
        © {new Date().getFullYear()} Vows&Veils. Sva prava zadržana.
      </div>
    </footer>
  );
};

export default Footer;
