import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import "../../pages/navbar2.css";

const Navbar3 = () => {
  const [activeText, setActiveText] = useState("");
  

  const handleSetActiveText = (text) => {
    setActiveText(text);
  };

  return (
    <div className="container">
      <div className="button">{activeText}</div>
      <hr className="divider" />
      <div className="navigation">
        <nav>
          <NavLink
            to="/admin_dashboard"
            onClick={() => handleSetActiveText("Lista korisnika")}
          >
           Lista korisnika
          </NavLink>
          <NavLink
            to="/inspiration-page"
            onClick={() => handleSetActiveText("Inspiracija")}
          >
            Inspiracija
          </NavLink>
        </nav>
      </div>
    </div>
  );
};

export default Navbar3;
