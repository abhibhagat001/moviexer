import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import "../Design/Navbar.css";
import { Link } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Logout from "./Logout";
import { useContext } from "react";
import { themeContext } from "../context/ThemeContext";
import TemporaryDrawer from "./TemporaryDrawer";

export default function Navbar({ children }) {
  const { darkMode, setDarkMode } = useContext(themeContext);

  function toggleMode() {
    setDarkMode((previous) => !previous);
    localStorage.setItem("theme", !darkMode);
  }

  return (
    <Box>
      <AppBar position="sticky" className="navbar-shell" elevation={0}>
        <Toolbar className="navbar-toolbar">
          <div className="brand-block">
            <span className="brand-badge">MX</span>
            <div className="brand-copy">
              <Typography variant="h4" component="div" className="navbar-brand-title">
                {children}
              </Typography>
              <span className="navbar-brand-subtitle">Movie discovery workspace</span>
            </div>
          </div>

          <div className="nav-actions cls">
            <Link to="/watchlist" className="nav-action nav-action-link">
              <i className="fa-solid fa-bookmark"></i>
              <span>Watchlist</span>
            </Link>

            <button
              type="button"
              className="nav-action nav-action-toggle"
              onClick={toggleMode}
            >
              <i className={`fa-solid ${darkMode ? "fa-sun" : "fa-moon"}`}></i>
              <span>{darkMode ? "Light mode" : "Dark mode"}</span>
            </button>

            <Logout />
          </div>

          <div className="hamburger-menu">
            <TemporaryDrawer />
          </div>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
