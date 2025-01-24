import { createContext, useState, useEffect } from "react";

export const MyContext = createContext({
  currentUser: null,
  userRole: "", // Dodato za praćenje trenutne uloge
  setUserFunction: (data) => {},
  setRoleFunction: (role) => {}, // Funkcija za setovanje uloge
  clearUserFunction: () => {}, // Funkcija za čišćenje korisničkog stanja
});

export const MyContextProvider = (props) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(""); // Dodato za praćenje uloge korisnika

 

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      console.log("User loaded from localStorage:", parsedUser);
      setCurrentUser(parsedUser);
      setUserRole(parsedUser.roles); // Postavi rolu prilikom učitavanja stranice
    }
  }, []);
  const setUserFunction = (userData) => {
    if (userData) {
      setCurrentUser(userData);
      setRoleFunction(userData.role || ""); // Ako role ne postoji, postavi prazan string
    } else {
      setCurrentUser(null);
      setRoleFunction(""); // Resetuj ulogu na prazan string
    }
  }

  const setRoleFunction = (role) => {
    setUserRole(role); // Postavljanje uloge
  };

  const clearUserFunction = () => {
    setCurrentUser(null);
    setUserRole(""); // Resetovanje uloge
  };

  return (
    <MyContext.Provider
      value={{
        currentUser,
        userRole,
        setUserFunction,
        setRoleFunction,
        clearUserFunction,
      }}
    >
      {props.children}
    </MyContext.Provider>
  );
};