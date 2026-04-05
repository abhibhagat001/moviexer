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
    let currentError = "";

    if (!value.trim()) {
      currentError = `${name[0].toUpperCase() + name.slice(1)} is required !!`;
    } else {
      switch (name) {
        case "userName":
          if (value.length < 3) {
            currentError = "Username must be atleast 3 characters";
          }
          break;
        case "email":
          if (!EmailValidator.validate(value)) currentError = "Invalid Email format";
          break;
        case "password":
          if (value.length < 6) {
            currentError = "Password must be at least 6 characters long";
          }
          break;
        default:
          break;
      }
    }

    return currentError;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
    const currentError = validate(name, value);
    setErrors((prevErrors) => ({ ...prevErrors, [name]: currentError }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    Object.keys(userData).forEach((key) => {
      const currentError = validate(key, userData[key]);
      if (currentError) newErrors[key] = currentError;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const { userName, email, password } = userData;
    setIsLoading(true);
    await createUserWithEmailAndPassword(auth, email, password)
      .then(async (value) => {
        await setDoc(doc(db, "users", value.user.uid), {
          username: userName,
          email,
        });
        localStorage.setItem("myusername", userName);
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
              <i className="fa-solid fa-key" style={{ color: "#b39517" }}></i>{" "}
              This email is already in use
            </>
          );
          return;
        }

        if (err.code === "auth/network-request-failed") {
          setError(
            <>
              <i className="fa-solid fa-wifi" style={{ color: "#007BFF" }}></i>{" "}
              Please check your internet conncetion
            </>
          );
          return;
        }

        setError("Unknown Error");
      });
  };

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClose = (event, reason) => {
    if (reason && reason === "backdropClick") return;
    setOpenErrorBox(true);
  };

  return (
    <div className="auth-page signup-container">
      <div className="auth-shell">
        <div className="auth-showcase">
          <span className="auth-kicker">Create your account</span>
          <h1>Build a modern movie browsing experience from your very first login.</h1>
          <p>
            Sign up to search titles, review details, and organize your watchlist
            with a cleaner and more professional interface.
          </p>
        </div>

        <div className="auth-card sign-up">
          <div className="d-flex justify-content-center">
            <img src={Logo} alt="Moviexer logo" className="SignUpImg" />
          </div>

          <h2 className="mb-2 text-center fw-bold text-dark">Sign Up</h2>
          <p className="auth-form-copy text-center">
            Create an account and start saving titles.
          </p>

          <form onSubmit={handleSubmit}>
            <Inputs
              htmlFor={"username"}
              labelClassName={"form-label fw-semibold text-dark mb-2"}
              id="username"
              type="text"
              name="userName"
              value={userData.userName}
              placeholder="Enter your username"
              onChange={handleChange}
              error={errors.userName}
            >
              <i className="fa-solid fa-user"></i> Username
            </Inputs>

            <Inputs
              htmlFor={"email"}
              labelClassName={"form-label fw-semibold text-dark mb-2"}
              id="email"
              type="text"
              name="email"
              value={userData.email}
              placeholder="Enter your email"
              onChange={handleChange}
              error={errors.email}
            >
              <i className="fa-solid fa-envelope"></i> Email
            </Inputs>

            <Inputs
              htmlFor={"password"}
              labelClassName={"form-label fw-semibold text-dark mb-2"}
              id="password"
              type={showPassword ? "text" : "password"}
              name="password"
              value={userData.password}
              placeholder="Create a secure password"
              onChange={handleChange}
              error={errors.password}
              showPassword={showPassword}
              togglePassword={togglePassword}
            >
              <i className="fa-solid fa-lock"></i> Password
            </Inputs>

            {!isLoading && (
              <button type="submit" className="auth-submit-btn w-100 mt-4">
                Sign Up
              </button>
            )}

            {isLoading && (
              <button className="auth-submit-btn auth-submit-btn-muted w-100 mt-4" type="button" disabled>
                <span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
                Creating account...
              </button>
            )}
          </form>

          <div className="text-center sign-in text-dark mt-3 fw-semibold">
            Already have an account?{" "}
            <Link to="/login" className="auth-link">
              Login Here
            </Link>
          </div>

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
  );
}
