//themeContext
 
import React, { createContext, useState } from "react";
 
export const themeContext = createContext(null);
 
export const ThemeProvider = (props) => {
  const storedTheme = localStorage.getItem("theme") === "true";
  const [darkMode, setDarkMode] = useState(storedTheme);
  React.useEffect(() => {
    localStorage.setItem("theme", darkMode);
  }, [darkMode]);
  return (
    <themeContext.Provider value={{ darkMode, setDarkMode }}>
      {props.children}
    </themeContext.Provider>
  );
};