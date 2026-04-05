import * as React from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Avatar } from "@mui/material";
import { Link } from "react-router-dom";
import Fade from "@mui/material/Fade";
import Tooltip from "@mui/material/Tooltip";
import { getFirestore, getDoc, doc } from "firebase/firestore";
import { app } from "../firebase";
import { useEffect } from "react";
 
// Logout functionality
const db = getFirestore(app);
export default function Logout() {
  const [myuserName, setMyUserName] = React.useState("");
 
  useEffect(() => {
    async function fetchMyAPI() {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          setMyUserName("User");
          return;
        }

        const DocRef = doc(db, "users", userId);
        const docSnap = await getDoc(DocRef);

        if (!docSnap.exists()) {
          setMyUserName("User");
          return;
        }

        const userData = docSnap.data();
        const safeUserName = userData?.username || "User";
        localStorage.setItem("myusername", safeUserName);
        setMyUserName(safeUserName);
      } catch (e) {
        console.log(e);
        setMyUserName("User");
      }
    }
 
    if (localStorage.getItem("myusername")) {
      setMyUserName(localStorage.getItem("myusername"));
    } else {
      fetchMyAPI();
    }
  }, []);
 
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
 
  const handleClose = () => {
    setAnchorEl(null);
  };
 
  const logoutDashboard = () => {
    localStorage.clear();
  };
 
  return (
    <div>
      <Tooltip
        title={myuserName}
        TransitionComponent={Fade}
        TransitionProps={{ timeout: 600 }}
      >
        <button
          type="button"
          className="profile-trigger"
          id="basic-button"
          aria-controls={open ? "basic-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClick}
        >
          <div className="profile-copy">
            <strong className="profile-name">{myuserName || "User"}</strong>
          </div>
          <Avatar
            sx={{
              bgcolor: "#b44f2e",
              width: 38,
              height: 38,
              fontSize: "1rem",
              fontWeight: 700,
            }}
          >
            {(myuserName || "U").charAt(0).toUpperCase()}
          </Avatar>
        </button>
      </Tooltip>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem onClick={handleClose}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              fontSize: "15px",
            }}
          >
            <i className="fa-solid fa-user"></i>
            {myuserName}
          </div>
        </MenuItem>
 
        <Link to="/login" style={{ textDecoration: "none" }}>
          <MenuItem
            onClick={() => {
              logoutDashboard();
              handleClose();
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                fontSize: "15px",
              }}
            >
              <i className="fa-solid fa-right-from-bracket"></i>
              Logout
            </div>
          </MenuItem>
        </Link>
      </Menu>
    </div>
  );
}
 
 
