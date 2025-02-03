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
            to="/dress"
            onClick={() => handleSetActiveText("Kolekcija")}
          >
            Kolekcija
          </NavLink>
          <NavLink
            to="/appointments"
            onClick={() => handleSetActiveText("Obaveze")}
          >
            Obaveze
          </NavLink>
        </nav>
      </div>
    </div>
  );
};

export default Navbar3;
