import * as React from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Avatar } from "@mui/material";
import { deepOrange } from "@mui/material/colors";
import { Link } from "react-router-dom";
import Fade from "@mui/material/Fade";
import Tooltip from "@mui/material/Tooltip";
import { getFirestore, getDoc, doc } from "firebase/firestore";
import { app } from "../firebase";
import { useEffect } from "react";
 
// Logout functionality
const db = getFirestore(app);
export default function Logout({ userName }) {
  const [myuserName, setMyUserName] = React.useState("");
 
  useEffect(() => {
    async function fetchMyAPI() {
      try {
        const DocRef = doc(db, "users", localStorage.getItem("userId"));
        const docSnap = await getDoc(DocRef);
        localStorage.setItem("myusername", docSnap.data().username);
        setMyUserName(docSnap.data().username);
      } catch (e) {
        alert(e);
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
        <Avatar
          id="basic-button"
          aria-controls={open ? "basic-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          sx={{
            bgcolor: deepOrange[500],
            width: 35,
            height: 35,
          }}
          onClick={handleClick}
        ></Avatar>
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
        <MenuItem>
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
          <MenuItem onClick={logoutDashboard}>
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
 
 
