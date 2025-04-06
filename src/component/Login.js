import React, { useState } from "react";
import {
  getAuth,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { app } from "../firebase";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Logo from "../Assests/background.jpg";
import "../Design/Login.css";
import * as EmailValidator from "email-validator";
 
import Inputs from "../UI/Inputs";
import Dialogbox from "./Dialogbox";
const auth = getAuth(app);
export default function Login() {
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [openErrorBox, setOpenErrorBox] = React.useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
 
  const validate = (name, value) => {
    let error = "";
 
    if (!value.trim()) {
      error = name[0].toUpperCase() + name.slice(1) + " is required !!";
    } else {
      switch (name) {
        case "email":
          if (!EmailValidator.validate(value)) error = "Invalid Email format";
          break;
        case "password":
          if (value.length < 6)
            error = "Password must be at least 6 characters long";
          break;
        default:
          break;
      }
    }
 
    return error;
  };
 
  const handleSubmit = (e) => {
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
 
    if (email === "" || password === "") {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    signInWithEmailAndPassword(auth, email, password)
      .then((value) => {
        localStorage.setItem("userId", value.user.uid);
        navigate("/search", { state: { uid: value.user.uid } });
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        setOpenErrorBox(true);
        if (err.code === "auth/network-request-failed") {
          setError(
            <>
              {" "}
              <i
                class="fa-solid fa-wifi"
                style={{ color: "#007BFF", fontWeight: "600" }}
              ></i>{" "}
              Please check your internet connection
            </>
          );
          return;
        } else if ((err.code = "auth/invalid-credential")) {
          setError(
            <>
              <i
                className="fa-solid fa-key fw-bold"
                style={{ color: "#b39517", fontWeight: "600" }}
              ></i>{" "}
              You enter valid email id and password
            </>
          );
        } else {
          setError("Unknown error");
        }
      });
  };
 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
    const error = validate(name, value);
    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
  };
 
  const togglePassword = () => {
    setShowPassword(!showPassword);
  };
 
  const handleClose = (event, reason) => {
    if (reason && reason === "backdropClick") return;
    setOpenErrorBox(true);
  };
 
  return (
    <div className="login">
      <div className="container">
        <div className="row content d-flex  justify-content-center align-items-center">
          <div className="col-md-5">
            <div className="p-5 login-container">
              <div className="d-flex justify-content-center">
                <img src={Logo} alt="" className="logoImg" />
              </div>
              <h2 className="mb-4 text-center fw-bold text-dark">Login</h2>
              <form onSubmit={handleSubmit}>
                <div>
                  {/* Login email */}
                  <Inputs
                    htmlFor="email"
                    labelClassName="form-label fw-semibold text-dark mb-2"
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Enter a Email Address"
                    value={userData.email}
                    onChange={handleChange}
                    error={errors.email}
                  >
                    <i className="fa-solid fa-envelope"></i> Email:
                  </Inputs>
 
                  {/* Login password  */}
                  <Inputs
                    htmlFor="password"
                    labelClassName="form-label fw-semibold text-dark mb-2"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    id="password"
                    placeholder="Enter a password"
                    value={userData.password}
                    onChange={handleChange}
                    error={errors.password}
                    showPassword={showPassword}
                    togglePassword={togglePassword}
                  >
                    <i className="fa-solid fa-lock"></i> Password:
                  </Inputs>
                </div>
 
                {!isLoading && (
                  <button
                    type="submit"
                    className="btn btn-warning text-dark fw-bold bg-gradient w-100 mt-4"
                  >
                    Login
                  </button>
                )}
 
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
                    Loading...
                  </button>
                )}
              </form>
              <div className="text-center mt-4">
                <Link
                  to="/"
                  className="text-primary text-decoration-underline fw-bold"
                >
                  <i className="fa-solid fa-arrow-left"></i> back to Sign Up
                </Link>
              </div>
 
              <Dialogbox
                error={error}
                openErrorBox={openErrorBox}
                handleClose={handleClose}
                setOpenErrorBox={setOpenErrorBox}
                component={"login"}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
 
 
