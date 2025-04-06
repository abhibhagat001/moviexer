//userContext.js
 
import React, { createContext, useState } from "react";
 
export const userContext = createContext(null);
 
export const UserProvider = (props) => {
  const [name, setName] = useState("");
  return (
    <userContext.Provider value={{ name, setName }}>
      {props.children}
    </userContext.Provider>
  );
};
 