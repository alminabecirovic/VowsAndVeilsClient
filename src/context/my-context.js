import { createContext, useState } from "react";

export const MyContext = createContext({
  user: null,
  firstName: "",
  changeFirstName: (fn) => {},
  setUserFunction: (userData) => {},
});

export const MyContextProvider = (props) => {
  const [user, setUser] = useState(null);
  const [firstName, setFirstName] = useState("Ela");

  const changeFirstName = (fn) => {
    setFirstName(fn);
  };

  const setUserFunction = (userData) => {
    setUser(userData);
  };

  return (
    <MyContext.Provider
      value={{ user, firstName, setUserFunction, changeFirstName }}
    >
      {props.children}
    </MyContext.Provider>
  );
};