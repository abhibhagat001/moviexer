import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Design/MovieList.css";
import { useContext } from "react";
import { themeContext } from "../context/ThemeContext";
import { wishlistContext } from "../context/WatchList";
import { motion } from "framer-motion";
import Alert from "@mui/material/Alert";
import { getFirestore, getDoc, doc, setDoc } from "firebase/firestore";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { app } from '../firebase';
import Tooltip from "@mui/material/Tooltip";
import Dialogbox from "./Dialogbox";
 
export default function MovieList(props) {
  const { darkMode } = useContext(themeContext);
  const wishlist = useContext(wishlistContext);
  const navigate = useNavigate();
  const [IsLoading, setIsLoading] = useState(false);
  const [openErrorBox, setOpenErrorBox] = React.useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const db = getFirestore(app);
  const docRef = doc(db, "watchlists", props.uid);
  const saveWatchlistToFirestore = async (uid, watchlist) => {
    try {
      const docSnap = await getDoc(docRef);
 
      if (docSnap.exists) {
        await setDoc(docRef, {
          movies: watchlist,
          userId: uid,
        });
      }
    } catch (error) {
      console.log(error);
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
  };
 
  const handleClick = () => {
    if (!navigator.onLine) {
      setOpenErrorBox(true);
      setError(
        <>
          <i
            class="fa-solid fa-wifi"
            style={{ color: "#007BFF", fontWeight: "600" }}
          ></i>{" "}
          Please check your internet conncetion before adding movie to
          watchlist.
        </>
      );
      return;
    }
    for (let i = 0; i < wishlist.movies.length; i++) {
      if (wishlist.movies[i].movie.Title === props.movie.Title) {
        alert("Movie is already present in watchlist");
        return 0;
      }
    }
 
    const updatedWatchlist = [...wishlist.movies, props];
    wishlist.setMovies(updatedWatchlist);
    saveWatchlistToFirestore(props.uid, updatedWatchlist);
    setOpen(true);
  };
 
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };
 
  const action = (
    <React.Fragment>
      <Button color="secondary" size="small" onClick={handleClose}></Button>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );
 
  async function fetchMovieDetails(title) {
    navigate(`/movieDetails/${props.movie.Title}`, { state: title });
  }
 
  return (
    <div className="movie-card">
      <div className="flip-card">
        <div className="flip-card-inner">
          <div className="flip-card-front">
            <motion.img
              className={IsLoading ? "img-fluid blur" : "img-fluid"}
              style={{ position: "relative" }}
              onClick={() => fetchMovieDetails(props.movie.Title)}
              src={
                props.movie.Poster !== "N/A"
                  ? props.movie.Poster
                  : "https://placehold.co/600x400"
              }
              alt={`The movie titled: ${props.movie.Title}`}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <div className="flip-card-back">
            <div>
              <button
                className={props.isWatchlist ? "card-btn" : "button-62"}
                alt=""
                onClick={() => fetchMovieDetails(props.movie.Title)}
              >
                <i className="fa-solid fa-circle-info"></i> More Info
              </button>
            </div>
            <div>
              {props.isWatchlist ? (
                <div></div>
              ) : (
                <button
                  className="button-62"
                  alt=""
                  onClick={() => handleClick()}
                >
                  <i className="fa-solid fa-circle-plus"></i> WatchList
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className={darkMode ? "card-body bg-dark" : "card-body bg-light"}>
        <h5
          className={
            darkMode ? "text-white card-title" : "text-dark card-title"
          }
        >
          <Tooltip title={props.movie.Title}>
            <>
              {props.movie.Title.length < 25
                ? props.movie.Title
                : props.movie.Title.slice(0, 25) + "..."}
            </>
          </Tooltip>
        </h5>
        <div
          className={
            darkMode ? "text-white card-title" : "text-dark card-title"
          }
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          {props.movie.Year}
          {props.isWatchlist ? (
            <div>
              <i
                className="fa-solid fa-trash"
                onClick={() => {
                  if (!navigator.onLine) {
                    setOpenErrorBox(true);
                    setOpen(false);
                    setError(
                      <>
                        <i
                          class="fa-solid fa-wifi"
                          style={{ color: "#007BFF", fontWeight: "600" }}
                        ></i>{" "}
                        Please check your internet conncetion before removing
                        the movie from watchlist.
                      </>
                    );
                    return;
                  }
                  props.removeFromWatchList(props.movie.Title);
                  props.setOpen(true);
                }}
              ></i>
            </div>
          ) : (
            <div></div>
          )}
        </div>
 
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert
            onClose={handleClose}
            severity="success"
            variant="filled"
            sx={{ width: "100%", fontSize: "16px" }}
          >
            <b>{props.movie.Title}</b> is added to watchlist
          </Alert>
        </Snackbar>
 
        <Dialogbox
          error={error}
          openErrorBox={openErrorBox}
          handleClose={handleClose}
          setOpenErrorBox={setOpenErrorBox}
          component={"movielist"}
        />
      </div>
    </div>
  );
}
 
 

