import React, { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { app } from "../firebase";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Logo from "../Assests/logo_.png";
import "../Design/Login.css";
import * as EmailValidator from "email-validator";
import Inputs from "../UI/Inputs";
import Dialogbox from "./Dialogbox";

const auth = getAuth(app);
const db = getFirestore(app);

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
    let currentError = "";

    if (!value.trim()) {
      currentError = `${name[0].toUpperCase() + name.slice(1)} is required !!`;
    } else {
      switch (name) {
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

    const { email, password } = userData;
    if (email === "" || password === "") {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    signInWithEmailAndPassword(auth, email, password)
      .then(async (value) => {
        localStorage.setItem("userId", value.user.uid);

        try {
          const userDoc = await getDoc(doc(db, "users", value.user.uid));
          if (userDoc.exists()) {
            const currentUserData = userDoc.data();
            if (currentUserData?.username) {
              localStorage.setItem("myusername", currentUserData.username);
            }
          }
        } catch (fetchUserError) {
          console.log(fetchUserError);
        }

        navigate("/search", { state: { uid: value.user.uid } });
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        setOpenErrorBox(true);
        if (err.code === "auth/network-request-failed") {
          setError(
            <>
              <i className="fa-solid fa-wifi" style={{ color: "#007BFF" }}></i>{" "}
              Please check your internet connection
            </>
          );
          return;
        }

        if (err.code === "auth/invalid-credential") {
          setError(
            <>
              <i className="fa-solid fa-key" style={{ color: "#b39517" }}></i>{" "}
              Invalid email or password
            </>
          );
          return;
        }

        setError("Unknown error");
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
    const currentError = validate(name, value);
    setErrors((prevErrors) => ({ ...prevErrors, [name]: currentError }));
  };

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClose = (event, reason) => {
    if (reason && reason === "backdropClick") return;
    setOpenErrorBox(true);
  };

  return (
    <div className="auth-page login">
      <div className="auth-shell">
        <div className="auth-showcase">
          <span className="auth-kicker">Welcome back</span>
          <h1>Movie search with a sharper, studio-inspired interface.</h1>
          <p>
            Log in to continue browsing titles, open ratings instantly, and manage
            your personal watchlist in one clean workspace.
          </p>
        </div>

        <div className="auth-card login-container">
          <div className="d-flex justify-content-center">
            <img src={Logo} alt="Moviexer logo" className="logoImg" />
          </div>

          <h2 className="mb-2 text-center fw-bold text-dark">Login</h2>
          <p className="auth-form-copy text-center">
            Access your saved search experience.
          </p>

          <form onSubmit={handleSubmit}>
            <Inputs
              htmlFor="email"
              labelClassName="form-label fw-semibold text-dark mb-2"
              type="email"
              name="email"
              id="email"
              placeholder="Enter your email address"
              value={userData.email}
              onChange={handleChange}
              error={errors.email}
            >
              <i className="fa-solid fa-envelope"></i> Email
            </Inputs>

            <Inputs
              htmlFor="password"
              labelClassName="form-label fw-semibold text-dark mb-2"
              type={showPassword ? "text" : "password"}
              name="password"
              id="password"
              placeholder="Enter your password"
              value={userData.password}
              onChange={handleChange}
              error={errors.password}
              showPassword={showPassword}
              togglePassword={togglePassword}
            >
              <i className="fa-solid fa-lock"></i> Password
            </Inputs>

            {!isLoading && (
              <button type="submit" className="auth-submit-btn w-100 mt-4">
                Login
              </button>
            )}

            {isLoading && (
              <button className="auth-submit-btn auth-submit-btn-muted w-100 mt-4" type="button" disabled>
                <span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
                Loading...
              </button>
            )}
          </form>

          <div className="text-center mt-4">
            <Link to="/" className="auth-link">
              <i className="fa-solid fa-arrow-left"></i> Back to Sign Up
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
  );
}
