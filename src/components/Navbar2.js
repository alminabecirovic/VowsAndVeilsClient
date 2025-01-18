import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "../pages/navbar2.css";

const Navbar2 = () => {
    const [activeText, setActiveText] = useState("");

    const handleSetActiveText = (text) => {
        setActiveText(text);
    };

    return (
        <div className="container">
            <div className="button">{activeText}</div>
            <hr className="divider"/>
            <div className="navigation">
                <nav>
                    <NavLink to="/user_dresses_list" onClick={() => handleSetActiveText("Collection")}>
                        Collection
                    </NavLink>
                    <NavLink to="/inspiration" onClick={() => handleSetActiveText("Inspiration")}>
                        Inspiration
                    </NavLink>
                    <NavLink to="/search" onClick={() => handleSetActiveText("Filter")}>
                        Filter
                    </NavLink>
                </nav>
            </div>
          
        </div>
    );
};

export default Navbar2;


