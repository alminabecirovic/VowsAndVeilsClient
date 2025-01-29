import React, { useContext, useState, useEffect } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import axios from "axios";
import { MyContext } from "../context/my-context";
import { useNavigate } from "react-router-dom";
import "../pages/login.css";

const Registration = () => {
    const [roles, setRoles] = useState([]);
    const [userRole, setUserRole] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [birthDate, setBirthDate] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [firstNameMessage, setFirstNameMessage] = useState(null);
    const [lastNameMessage, setLastNameMessage] = useState(null);
    const [emailMessage, setEmailMessage] = useState(null);
    const [birthDateMessage, setBirthDateMessage] = useState(null);
    const [usernameMessage, setUsernameMessage] = useState(null);
    const [passwordMessage, setPasswordMessage] = useState(null);
    const [visible, setVisible] = useState(true); // State za prikaz lozinke
    const { setUserFunction } = useContext(MyContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await axios.get(
                    "https://localhost:7042/api/User/valid-roles"
                );
                setRoles(response.data);
            } catch (error) {
                console.error("Error fetching roles:", error);
            }
        };

        fetchRoles();
    }, []);

    const onSubmitHandler = async (e) => {
        e.preventDefault();

        setFirstNameMessage(null);
        setLastNameMessage(null);
        setEmailMessage(null);
        setBirthDateMessage(null);
        setUsernameMessage(null);
        setPasswordMessage(null);

        if (firstName.trim().length === 0) {
            setFirstNameMessage("Molim vas unesite validno ime!");
            return;
        }
        if (lastName.trim().length === 0) {
            setLastNameMessage("Molim vas unesite validno prezime!");
            return;
        }
        if (email.trim().length === 0) {
            setEmailMessage("Molim vas unesite validan email!");
            return;
        }
        if (username.trim().length === 0) {
            setUsernameMessage("Molim vas unesite validno korisničko ime!");
            return;
        }
        if (password.trim().length === 0) {
            setPasswordMessage("Molim vas unesite validnu lozinku!");
            return;
        }

        try {
            const response = await axios.post(
                "https://localhost:7042/api/User/register",
                {
                    Roles: userRole,
                    firstName,
                    lastName,
                    email,
                    birthDate,
                    username,
                    password,
                }
            );

            const responseData = response.data;

            axios.defaults.headers.common[
                "Authorization"
            ] = `Bearer ${responseData.token}`;

            setUserFunction(responseData);

            setUserRole("");
            setFirstName("");
            setLastName("");
            setEmail("");
            setUsername("");
            setPassword("");

            localStorage.setItem("user", JSON.stringify(responseData));

            navigate("/login");
        } catch (e) {
            console.log("Error", e);
            alert("Došlo je do greške prilikom registracije. Proverite unesene podatke.");
        }
    };

    return (
        <div className="auth-page">
            <div className="pic">
                <img
                    src={process.env.PUBLIC_URL + "/images/login.jpg"} // Putanja do slike
                    alt="Logo"
                    className="navbar-logo"
                />
            </div>
            <div className="auth-page-div">
                <form onSubmit={onSubmitHandler}>
                    <div className="auth-page-input">
                        <select
                            value={userRole}
                            onChange={(e) => setUserRole(e.target.value)}
                        >
                            <option value="" disabled>
                                Prijavite se kao
                            </option>
                            {roles.map((role, index) => (
                                <option key={index} value={role}>
                                    {role === "User" ? "Korisnik" : "Vlasnik salona"}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="auth-page-input">
                        <input
                            type="text"
                            placeholder="Ime"
                            onChange={(e) => setFirstName(e.target.value)}
                            value={firstName}
                        />
                        {firstNameMessage && (
                            <p className="input-alert">{firstNameMessage}</p>
                        )}
                    </div>
                    <div className="auth-page-input">
                        <input
                            type="text"
                            placeholder="Prezime"
                            onChange={(e) => setLastName(e.target.value)}
                            value={lastName}
                        />
                        {lastNameMessage && (
                            <p className="input-alert">{lastNameMessage}</p>
                        )}
                    </div>
                    <div className="auth-page-input">
                        <input
                            type="email"
                            placeholder="Email"
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                        />
                        {emailMessage && (
                            <p className="input-alert">{emailMessage}</p>
                        )}
                    </div>
                    <div className="auth-page-input">
                        <input
                            type="date"
                            onChange={(e) => setBirthDate(e.target.value)}
                            value={birthDate}
                        />
                        {birthDateMessage && (
                            <p className="input-alert">{birthDateMessage}</p>
                        )}
                    </div>
                    <div className="auth-page-input">
                        <input
                            type="text"
                            placeholder="Korisničko ime"
                            onChange={(e) => setUsername(e.target.value)}
                            value={username}
                        />
                        {usernameMessage && (
                            <p className="input-alert">{usernameMessage}</p>
                        )}
                    </div>
                    <div className="auth-page-input">
                        <input
                            type={visible ? "password" : "text"}
                            placeholder="Lozinka"
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                        />
                        <span
                            className="password-toggle"
                            onClick={() => setVisible((prev) => !prev)}
                        >
                            {visible ? <FaRegEye /> : <FaRegEyeSlash />}
                        </span>
                        {passwordMessage && (
                            <p className="input-alert">{passwordMessage}</p>
                        )}
                    </div>
                    <div className="auth-page-button">
                        <button type="submit">Registrujte se</button>
                    </div>
                </form>
                <p className="form-footer">
                        Imate nalog?{" "}
                        <span onClick={() => navigate("/login")} className="form-footer-link">
                            Prijavi se.
                        </span>
                    </p>
            </div>
        </div>
    );
};

export default Registration;
