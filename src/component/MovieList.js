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
import { app } from "../firebase";
import Tooltip from "@mui/material/Tooltip";
import Dialogbox from "./Dialogbox";
import posterFallback from "../Assests/posterFallback.svg";

const MovieList = React.memo((props) => {
  const { darkMode } = useContext(themeContext);
  const wishlist = useContext(wishlistContext);
  const navigate = useNavigate();
  const [openErrorBox, setOpenErrorBox] = React.useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [posterSrc, setPosterSrc] = useState(
    props.movie.Poster && props.movie.Poster !== "N/A"
      ? props.movie.Poster
      : posterFallback
  );
  const db = getFirestore(app);
  const docRef = doc(db, "watchlists", props.uid);

  React.useEffect(() => {
    setPosterSrc(
      props.movie.Poster && props.movie.Poster !== "N/A"
        ? props.movie.Poster
        : posterFallback
    );
  }, [props.movie.Poster]);

  const saveWatchlistToFirestore = async (uid, watchlist) => {
    try {
      const docSnap = await getDoc(docRef);
      if (docSnap.exists) {
        await setDoc(docRef, {
          movies: watchlist,
          userId: uid,
        });
      }
    } catch (saveError) {
      console.log(saveError);
      setError(
        <>
          <i className="fa-solid fa-wifi" style={{ color: "#007BFF" }}></i>{" "}
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
          <i className="fa-solid fa-wifi" style={{ color: "#007BFF" }}></i>{" "}
          Please check your internet conncetion before adding movie to
          watchlist.
        </>
      );
      return;
    }

    for (let i = 0; i < wishlist.movies.length; i += 1) {
      if (wishlist.movies[i].movie.Title === props.movie.Title) {
        alert("Movie is already present in watchlist");
        return;
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

  function fetchMovieDetails(title) {
    navigate(`/movieDetails/${props.movie.Title}`, { state: title });
  }

  return (
    <div className={`movie-card ${darkMode ? "movie-card-dark" : ""}`}>
      <div
        className="movie-poster-wrap"
        onClick={() => fetchMovieDetails(props.movie.Title)}
        role="button"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            fetchMovieDetails(props.movie.Title);
          }
        }}
      >
        <motion.img
          className="movie-poster"
          src={posterSrc}
          alt={`The movie titled: ${props.movie.Title}`}
          onError={() => setPosterSrc(posterFallback)}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        />
        <div className="movie-card-overlay">
          <span>{props.movie.Type || "Movie"}</span>
          <strong>{props.movie.Year}</strong>
        </div>
      </div>

      <div className="card-body">
        <div className="movie-card-meta">
          <span className="movie-chip">{props.movie.Year}</span>
          <span className="movie-chip movie-chip-soft">
            {props.isWatchlist ? "Saved" : "Discover"}
          </span>
        </div>

        <h5 className="card-title">
          <Tooltip title={props.movie.Title}>
            <>
              {props.movie.Title.length < 32
                ? props.movie.Title
                : `${props.movie.Title.slice(0, 32)}...`}
            </>
          </Tooltip>
        </h5>

        <div className="movie-card-actions">
          <button
            className="movie-card-button movie-card-button-secondary"
            onClick={() => fetchMovieDetails(props.movie.Title)}
          >
            <i className="fa-solid fa-circle-info"></i> Details
          </button>

          {props.isWatchlist ? (
            <button
              className="movie-card-button movie-card-button-danger"
              onClick={() => {
                if (!navigator.onLine) {
                  setOpenErrorBox(true);
                  setOpen(false);
                  setError(
                    <>
                      <i className="fa-solid fa-wifi" style={{ color: "#007BFF" }}></i>{" "}
                      Please check your internet conncetion before removing the
                      movie from watchlist.
                    </>
                  );
                  return;
                }
                props.removeFromWatchList(props.movie.Title);
                props.setOpen(true);
              }}
            >
              <i className="fa-solid fa-trash"></i> Remove
            </button>
          ) : (
            <button className="movie-card-button" onClick={() => handleClick()}>
              <i className="fa-solid fa-bookmark"></i> Watchlist
            </button>
          )}
        </div>

        <Snackbar
          open={open}
          autoHideDuration={4000}
          onClose={handleClose}
          action={action}
        >
          <Alert
            onClose={handleClose}
            severity="success"
            variant="filled"
            sx={{ width: "100%", fontSize: "15px" }}
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
});

export default MovieList;
