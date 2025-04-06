import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { wishlistContext } from "../context/WatchList";
import MovieList from "./MovieList";
import Backdrop from "@mui/material/Backdrop";
import NoDataImage from "../Assests/emptyWatchlist.jpg";
import "../Design/WatchList.css";
import { themeContext } from "../context/ThemeContext";
import { Link } from "react-router-dom";
import {
  getFirestore,
  getDoc,
  setDoc,
  doc,
  Firestore,
} from "firebase/firestore";
import { app } from "../firebase";
import Navbar from "./Navbar";
import WatchlistLoader from "./WatchlistLoader";
import Dialogbox from "./Dialogbox";
import firebase from "firebase/compat/app";
 
const db = getFirestore(app);
 
const WatchList = (props) => {
  const watchlist = useContext(wishlistContext);
  const theme = useContext(themeContext);
  const userId = localStorage.getItem("userId");
  const [isLoading, setIsLoading] = useState(true);
  const [open, setOpen] = React.useState(false);
  const [error, setError] = useState("");
  const [openErrorBox, setOpenErrorBox] = React.useState(false);
  const DocRef = doc(db, "watchlists", userId);
 
  useEffect(() => {
    fetchList();
  }, []);
 
  async function fetchList() {
    try {
      const docSnap = await getDoc(DocRef);
      const docData = docSnap.data();
      if (docData && docData.movies) {
        watchlist.setMovies(docSnap.data().movies);
        setIsLoading(false);
      }
    } catch (err) {
      setOpenErrorBox(true);
      if (err.code === "unavailable") {
        setError(
          <>
            <i
              class="fa-solid fa-wifi"
              style={{ color: "#007BFF", fontWeight: "600" }}
            ></i>{" "}
            Please check your internet conncetion
          </>
        );
      } else {
        setError(
          <>
            <i
              class="fa-solid fa-wifi"
              style={{ color: "#007BFF", fontWeight: "600" }}
            ></i>{" "}
            Internal server error
          </>
        );
      }
    }
  }
 
  async function removeFromWatchList(title) {
    setTimeout(() => {
      setOpen(false);
    }, 2000);
 
    try {
      const docSnap = await getDoc(DocRef);
      const updatedList = docSnap
        .data()
        .movies.filter((item) => item.movie.Title !== title);
 
      await setDoc(DocRef, {
        movies: updatedList,
        userId: userId,
      });
      watchlist.setMovies(updatedList);
    } catch (err) {
      setIsLoading(false);
      setOpenErrorBox(true);
      if (err.code === "unavailable") {
        setError(
          <>
            <i
              class="fa-solid fa-wifi"
              style={{ color: "#007BFF", fontWeight: "600" }}
            ></i>{" "}
            Please check your internet conncetion
          </>
        );
      } else {
        setError(
          <>
            <i
              class="fa-solid fa-wifi"
              style={{ color: "#007BFF", fontWeight: "600" }}
            ></i>{" "}
            Internal server error
          </>
        );
      }
    }
  }
 
  const handleClose = (event, reason) => {
    if (reason && reason === "backdropClick") return;
    setOpenErrorBox(true);
  };
 
  return (
    <div
      className={
        theme.darkMode
          ? "bg-dark d-flex flex-column w-100 min-vh-100"
          : "bg-light d-flex flex-column w-100 min-vh-100"
      }
    >
      {/* Navbar */}
      <Navbar>WatchList</Navbar>
 
      {/* Back Button */}
      <Link
        to="#"
        onClick={(e) => {
          e.preventDefault();
          window.history.back();
        }}
      >
        <button className="btn btn-warning" id="back-btn">
          <i className="fa-solid fa-arrow-left"></i> Back
        </button>
      </Link>
 
      {/* Container for showing the watchlist */}
      <div className="container-fluid">
        <div className="row d-flex justify-content-center">
          {isLoading && (
            <div className="d-flex justify-content-center align-items-center overflow-auto">
              <WatchlistLoader />
            </div>
          )}
 
          {/* Rendering NoDataFoundImage on  */}
          {!openErrorBox && !isLoading && watchlist.movies.length === 0 && (
            <div className="noDatoFound img-fluid d-flex justify-content-center">
              <img
                id="noWtchlistFound"
                src={NoDataImage}
                alt={""}
                style={{
                  width: "50%",
                  height: "100%",
                }}
              />
            </div>
          )}
 
          {/* Rendering the WatchList from Firestore */}
          {!isLoading && watchlist.movies.length > 0 && (
            <div className="watchlist">
              {watchlist.movies.map((item, index) => (
                <div
                  className="col-lg-3 col-sm-6 col-md-4 mb-4 user-watchlist"
                  key={index}
                >
                  <MovieList
                    movie={item.movie}
                    uid={localStorage.getItem("userId")}
                    isWatchlist={true}
                    removeFromWatchList={removeFromWatchList}
                    setOpen={setOpen}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
 
      {/* Backdrop while deleting the movie from wathclist */}
      <Backdrop
        sx={(theme) => ({ color: "#ffff", zIndex: theme.zIndex.drawer + 1 })}
        open={open}
      >
        <span className="deleting">Deleting</span>
      </Backdrop>
 
      <Dialogbox
        error={error}
        openErrorBox={openErrorBox}
        handleClose={handleClose}
        setOpenErrorBox={setOpenErrorBox}
        handleClick={fetchList}
        component={"watchlist"}
      />
    </div>
  );
};
 
export default WatchList;
 
 
