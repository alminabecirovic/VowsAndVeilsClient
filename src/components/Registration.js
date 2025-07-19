import React, {  useState, useEffect } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import axios from "axios";
import emailjs from "@emailjs/browser";
import { useNavigate } from "react-router-dom";
import "../pages/registration.css";

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
    const [visible, setVisible] = useState(true); 
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

    const generateVerificationCode = () => {
        return Math.floor(100000 + Math.random() * 900000).toString();
      };
    const sendVerificationEmail = async (email) => {
        const verificationCode = Math.floor(
          100000 + Math.random() * 900000
        ).toString();
    
        localStorage.setItem("verificationCode", verificationCode);
    
        try {
          await emailjs.send(
            "service_9a17om8", // PROVERI Service ID
            "template_cz3qahm", // PROVERI Template ID
            {
              email,
              message: `Poštovani,
      
              Drago nam je što ste se registrovali na našu aplikaciju! 
              Vaš verifikacioni kod je: ${verificationCode}
              Molimo vas da unesete ovaj kod kako biste završili proces registracije.
              Ukoliko niste zahtevali registraciju, slobodno zanemarite ovaj email.
              
              Srdačan pozdrav,
              Vows&Veils tim.`,
            },
            "-71BY-Z_2gfNf-qG2" // PROVERI Public Key
          );
    
          console.log("Verifikacioni email uspešno poslat!");
        } catch (error) {
          console.error("Greška prilikom slanja emaila:", error);
        }
      };

      // VALIDACIJA: IME I PREZIME (MORA POČETI VELIKIM SLOVOM)
  useEffect(() => {
    if (firstName && !/^[A-ZČĆŠĐŽ][a-zčćšđž]+$/.test(firstName)) {
      setFirstNameMessage("Ime mora početi velikim slovom.");
    } else {
      setFirstNameMessage(null);
    }
  }, [firstName]);

  useEffect(() => {
    if (lastName && !/^[A-ZČĆŠĐŽ][a-zčćšđž]+$/.test(lastName)) {
      setLastNameMessage("Prezime mora početi velikim slovom.");
    } else {
      setLastNameMessage(null);
    }
  }, [lastName]);

  useEffect(() => {
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    setEmailMessage("Unesite validnu email adresu.");
  } else {
    setEmailMessage(null);
    }
    }, [email]);
  // VALIDACIJA: DATUM ROĐENJA (18+ GODINA)
  useEffect(() => {
    if (birthDate) {
      const today = new Date();
      const birth = new Date(birthDate);
      const age = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();
      const dayDiff = today.getDate() - birth.getDate();

      if (
        age < 18 ||
        (age === 18 && (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)))
      ) {
        setBirthDateMessage("Morate imati najmanje 18 godina.");
      } else {
        setBirthDateMessage(null);
      }
    }
  }, [birthDate]);

  // VALIDACIJA: KORISNIČKO IME (SAMO MALA SLOVA)
  useEffect(() => {
    if (username && !/^[a-z0-9]+$/.test(username)) {
      setUsernameMessage(
        "Korisničko ime može sadržati samo mala slova i brojeve."
      );
    } else {
      setUsernameMessage(null);
    }
  }, [username]);

  // VALIDACIJA: LOZINKA (VELIKO SLOVO, BROJ I ZNAK)
  useEffect(() => {
    if (!password) {
        setPasswordMessage(null);
        return;
    }

    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasMinLength = password.length >= 8;

    if (!hasMinLength) {
        setPasswordMessage("Lozinka mora imati najmanje 8 karaktera.");
    } else if (!hasUpperCase) {
        setPasswordMessage("Lozinka mora sadržati barem jedno veliko slovo.");
    } else if (!hasNumber) {
        setPasswordMessage("Lozinka mora sadržati barem jedan broj.");
    } else {
        setPasswordMessage(null); // Ako je lozinka ispravna, nema poruke
    }
}, [password]);
const onSubmitHandler = async (e) => {
  e.preventDefault();

  // Provera da li su sva polja ispravno popunjena
  if (firstNameMessage || lastNameMessage || emailMessage || birthDateMessage || usernameMessage || passwordMessage) {
      console.log("Forma nije validna. Registracija nije dozvoljena.");
      return;
  }

  const verificationCode = generateVerificationCode();
  localStorage.setItem("verificationCode", verificationCode);
  localStorage.setItem("userEmail", email);
  localStorage.setItem(
      "userData",
      JSON.stringify({
          Roles: userRole,
          firstName,
          lastName,
          email,
          birthDate,
          username,
          password,
      })
  );

  await sendVerificationEmail(email, verificationCode);
  navigate("/verify_your_account");
};


      
    return (
        <div className="auth-page">
            <div className="pic">
                <img
                    src={process.env.PUBLIC_URL + "/images/login.jpg"} // Putanja do slike
                    alt="Logo"
                    className="slika"
                />
            </div>
            <div className="auth-page-div">
                <form onSubmit={onSubmitHandler}>
                    <div className="auth-page-input">
                        {/*<select
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
                        */}
                        <select value={userRole} onChange={(e) => setUserRole(e.target.value)}>
                            <option value="" disabled>
                                Prijavite se kao
                            </option>
                             {roles
                            .filter((role) => role !== "Admin") // Uklanja "Admin" iz liste opcija
                            .map((role, index) => (
                                <option key={index} value={role}>
                                    {role === "User" ? "Korisnik" : role === "SalonOwner" ? "Vlasnik salona" : role}
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
                            className="password-toggle1"
                            onClick={() => setVisible((prev) => !prev)}
                        >
                            {visible ? <FaRegEye /> : <FaRegEyeSlash />}
                        </span>
                        {passwordMessage && (
                            <p className="input-alert">{passwordMessage}</p>
                        )}
                    </div>
                    <div className="auth-page-button1">
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
