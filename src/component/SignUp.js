import React, { useState } from "react";
import "../Design/SignUp.css";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { app } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import { userContext } from "../context/UserContext";
import * as EmailValidator from "email-validator";
import Logo from "../Assests/logo_.png";
import { useContext } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import Inputs from "../UI/Inputs";
import Dialogbox from "./Dialogbox";
 
const auth = getAuth(app);
const db = getFirestore(app);
export default function SignUp() {
  const user = useContext(userContext);
  const [errors, setErrors] = useState({});
  const [openErrorBox, setOpenErrorBox] = React.useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [userData, setUserData] = useState({
    userName: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
 
  const navigation = useNavigate();
 
  const validate = (name, value) => {
    let error = "";
 
    if (!value.trim()) {
      error = name[0].toUpperCase() + name.slice(1) + " is required !!";
    } else {
      switch (name) {
        case "userName":
          if (value.length < 3) {
            error = `Username must be atleast 3 characters`;
          }
          break;
        case "email":
          if (!EmailValidator.validate(value)) error = "Invalid Email format";
          break;
        case "password":
          if (value.length < 6) {
            error = "Password must be at least 6 characters long";
          }
          break;
        default:
          break;
      }
    }
 
    return error;
  };
 
  // handling form data
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
 
    const error = validate(name, value);
    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
  };
 
  //handling form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    let newErrors = {};
 
    Object.keys(userData).forEach((key) => {
      const error = validate(key, userData[key]);
      if (error) newErrors[key] = error;
    });
 
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
 
    const { userName, email, password } = userData;
    setIsLoading(true);
    await createUserWithEmailAndPassword(auth, email, password)
      .then((value) => {
        setDoc(doc(db, "users", value.user.uid), {
          username: userName,
          email: email,
        });
        user.setName(userName);
        setIsLoading(false);
        navigation("/login");
      })
      .catch((err) => {
        setIsLoading(false);
        setOpenErrorBox(true);
        if (err.code === "auth/email-already-in-use") {
          setError(
            <>
              <i
                className="fa-solid fa-key fw-bold"
                style={{ color: "#b39517", fontWeight: "600" }}
              ></i>{" "}
              You enter valid email id and password
            </>
          );
          return;
        } else if (err.code === "auth/network-request-failed") {
          setError(
            <>
              <i
                class="fa-solid fa-wifi"
                style={{ color: "#007BFF", fontWeight: "600" }}
              ></i>{" "}
              Please check your internet conncetion
            </>
          );
          return;
        } else {
          setError("Unknown Error");
        }
      });
  };
 
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };
 
  const togglePassword = () => {
    setShowPassword(!showPassword);
  };
 
  const handleClose = (event, reason) => {
    if (reason && reason === "backdropClick") return;
    setOpenErrorBox(true);
  };
 
  return (
    <div className="signup-container">
      <div className="container">
        <div className="row content d-flex justify-content-center align-items-center">
          <div className="col-md-5">
            <div className="p-5 sign-up">
              <div className="d-flex justify-content-center">
                <img src={Logo} alt="" className="SignUpImg" />
              </div>
              <h2 className="mb-4 text-center fw-bold text-dark">Sign Up</h2>
              <form onSubmit={handleSubmit}>
                <div>
                  {/* Username input field */}
                  <Inputs
                    htmlFor={"username"}
                    labelClassName={"form-label fw-semibold text-dark mb-2"}
                    id="username"
                    type="text"
                    name="userName"
                    value={userData.userName}
                    placeholder="Enter a username"
                    onChange={handleChange}
                    error={errors.userName}
                  >
                    <i className="fa-solid fa-user"></i> Username:
                  </Inputs>
 
                  {/* email input field */}
                  <Inputs
                    htmlFor={"email"}
                    labelClassName={"form-label fw-semibold text-dark mb-2"}
                    id="email"
                    type="text"
                    name="email"
                    value={userData.email}
                    placeholder="Enter a email"
                    onChange={handleChange}
                    error={errors.email}
                  >
                    <i className="fa-solid fa-envelope"></i> Email:
                  </Inputs>
 
                  {/* password input field */}
                  <Inputs
                    htmlFor={"password"}
                    labelClassName={"form-label fw-semibold text-dark mb-2"}
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={userData.password}
                    placeholder="Enter a password"
                    onChange={handleChange}
                    error={errors.password}
                    showPassword={showPassword}
                    togglePassword={togglePassword}
                  >
                    <i className="fa-solid fa-lock"></i> Password:
                  </Inputs>
                </div>
 
                {/* singUp button */}
                {!isLoading && (
                  <button
                    type="submit"
                    className="btn btn-warning text-dark fw-bold bg-gradient w-100 mt-4"
                  >
                    Sign up
                  </button>
                )}
 
                {/* SignUp button loader */}
                {isLoading && (
                  <button
                    className="btn btn-warning w-100 mt-4"
                    type="button"
                    disabled
                  >
                    <span
                      className="spinner-grow spinner-grow-sm"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Account creating...
                  </button>
                )}
              </form>
 
              {/* Link for Login page */}
              <div className="text-center sign-in text-dark mt-3 fw-semibold ">
                Already have an account ?{"  "}
                <Link
                  to="/login"
                  className="text-primary text-decoration-underline fw-bold"
                >
                  Login Here
                </Link>
              </div>
 
              {/* Dailog box to show proper error on UI */}
              <Dialogbox
                error={error}
                openErrorBox={openErrorBox}
                handleClose={handleClose}
                setOpenErrorBox={setOpenErrorBox}
                component={"SingUp"}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
 
 
