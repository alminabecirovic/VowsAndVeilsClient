import React from 'react'
import { Link } from "react-router-dom";

const Navbar = () =>{

    return (
    <div className="menu-lista">
        <div className="navigation-link">
            <Link to="/login">Prijavi se</Link>
        </div>
        <div className="navigation-link">
            <Link to="/registration">Registruj se</Link>
        </div>
    </div>
    )
}
export default Navbar;