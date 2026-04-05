import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../Design/MovieDetails.css";
import { themeContext } from "../context/ThemeContext";
import { wishlistContext } from "../context/WatchList";
import Navbar from "./Navbar";
import WatchlistLoader from "./WatchlistLoader";
import Modal from "./Modal";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import rottenTomatoes from "../Assests/Rotten_Tomatoes.png";
import imdb from "../Assests/IMDB.png";
import meta from "../Assests/Metacritic.png";
import posterFallback from "../Assests/posterFallback.svg";
import useFetchAPI from "../Hooks/useFetchAPI";
import useLocalStorage from "../Hooks/useLocalStorage";
import { getFirestore, getDoc, doc, setDoc } from "firebase/firestore";
import { app } from "../firebase";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Dialogbox from "./Dialogbox";

function MovieDetails() {
  const { darkMode } = useContext(themeContext);
  const wishlist = useContext(wishlistContext);
  const [movies, setMovies, dataLoader, error, setError, getMovieDetails] =
    useFetchAPI();
  const [, setStoredValue] = useLocalStorage("movieDetailsState", {});
  const location = useLocation();
  const navigate = useNavigate();
  const movieData = location.state;
  const [value, setValue] = useState("1");
  const [posterSrc, setPosterSrc] = useState(posterFallback);
  const [open, setOpen] = useState(false);
  const [openErrorBox, setOpenErrorBox] = useState(false);
  const [wishlistError, setWishlistError] = useState("");
  const db = getFirestore(app);
  const userId = localStorage.getItem("userId");
  const docRef = userId ? doc(db, "watchlists", userId) : null;

  useEffect(() => {
    if (!movieData) return;

    const saved = JSON.parse(localStorage.getItem("movieDetailsState"));
    if (saved && saved.movieData === movieData && saved.movies) {
      setMovies(saved.movies);
      return;
    }

    getMovieDetails("/", { t: movieData, apikey: "2149ed44" });
  }, [movieData, setMovies, getMovieDetails]);

  useEffect(() => {
    setStoredValue({ movies, movieData });
  }, [movies, movieData, setStoredValue]);

  useEffect(() => {
    setPosterSrc(
      movies?.Poster && movies.Poster !== "N/A" ? movies.Poster : posterFallback
    );
  }, [movies]);

  const isSavedToWatchlist = wishlist.movies.some(
    (item) => item.movie?.imdbID === movies?.imdbID
  );

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleClose = () => {
    setError("");
    navigate(-1);
  };

  const handleWishlistClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const handleDialogClose = () => {
    setOpenErrorBox(false);
  };

  const saveWatchlistToFirestore = async (uid, watchlistItems) => {
    if (!docRef) {
      return;
    }

    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      await setDoc(docRef, {
        movies: watchlistItems,
        userId: uid,
      });
      return;
    }

    await setDoc(docRef, {
      movies: watchlistItems,
      userId: uid,
    });
  };

  const handleAddToWatchlist = async () => {
    if (!navigator.onLine) {
      setWishlistError(
        <>
          <i className="fa-solid fa-wifi" style={{ color: "#007BFF" }}></i>{" "}
          Please check your internet connection before adding this movie to your
          watchlist.
        </>
      );
      setOpenErrorBox(true);
      return;
    }

    if (!movies?.Title || isSavedToWatchlist) {
      return;
    }

    try {
      const watchlistItem = {
        movie: {
          Title: movies.Title,
          Year: movies.Year,
          imdbID: movies.imdbID,
          Type: movies.Type,
          Poster: movies.Poster,
        },
        uid: userId,
      };

      const updatedWatchlist = [...wishlist.movies, watchlistItem];
      wishlist.setMovies(updatedWatchlist);
      await saveWatchlistToFirestore(userId, updatedWatchlist);
      setOpen(true);
    } catch (saveError) {
      console.log(saveError);
      setWishlistError(
        <>
          <i className="fa-solid fa-triangle-exclamation" style={{ color: "#b44f2e" }}></i>{" "}
          Unable to save this movie right now. Please try again.
        </>
      );
      setOpenErrorBox(true);
    }
  };

  const ratings = [
    { label: "IMDb", image: imdb, value: movies?.Ratings?.[0]?.Value || "NA" },
    {
      label: "Rotten Tomatoes",
      image: rottenTomatoes,
      value: movies?.Ratings?.[1]?.Value || "NA",
    },
    {
      label: "Metacritic",
      image: meta,
      value: movies?.Ratings?.[2]?.Value || "NA",
    },
  ];

  return (
    <div
      className={
        darkMode
          ? "bg-dark text-light mainContainer d-flex flex-column min-vh-100"
          : "lighttheme text-dark mainContainer d-flex flex-column min-vh-100"
      }
    >
      <Navbar>MOVIEXER</Navbar>

      {dataLoader && (
        <div className="d-flex justify-content-center align-items-center py-5">
          <WatchlistLoader />
        </div>
      )}

      {error && (
        <Modal handleClose={handleClose}>
          <div>{error}</div>
        </Modal>
      )}

      {!dataLoader && !error && (
        <section className="details-page">
          <div className="details-grid">
            <div className="poster-panel">
              <img
                src={posterSrc}
                alt={movies?.Title || "Poster not found"}
                className="poster"
                onError={() => setPosterSrc(posterFallback)}
              />
            </div>

            <div className="details-panel">
              <div className="details-heading-row">
                <span className="details-badge">{movies?.Type || "Movie"}</span>
                <h1 className="movie-heading">{movies?.Title}</h1>
                <p className="details-subtext">
                  A polished overview of cast, plot, and ratings for quick decision
                  making.
                </p>
                <div className="details-actions">
                  <button
                    type="button"
                    className={`details-watchlist-btn ${
                      isSavedToWatchlist ? "details-watchlist-btn-saved" : ""
                    }`}
                    onClick={handleAddToWatchlist}
                    disabled={isSavedToWatchlist}
                  >
                    <i
                      className={`fa-solid ${
                        isSavedToWatchlist ? "fa-check" : "fa-bookmark"
                      }`}
                    ></i>
                    {isSavedToWatchlist ? "Added to watchlist" : "Add to watchlist"}
                  </button>
                </div>
              </div>

              <div className="facts-row">
                <div className="fact-pill">
                  <i className="fa-regular fa-calendar"></i>
                  {movies?.Year || "NA"}
                </div>
                <div className="fact-pill">
                  <i className="fa-solid fa-film"></i>
                  {movies?.Runtime || "NA"}
                </div>
                <div className="fact-pill">
                  <i className="fa-solid fa-certificate"></i>
                  {movies?.Rated || "NA"}
                </div>
              </div>

              <div className="rating-grid">
                {ratings.map((rating) => (
                  <div className="rating-card" key={rating.label}>
                    <img className="rating-logo" src={rating.image} alt={rating.label} />
                    <div className="rating-value">
                      <i className="fa-solid fa-star"></i>
                      {rating.value}
                    </div>
                  </div>
                ))}
              </div>

              <Box sx={{ width: "100%", typography: "body1" }}>
                <TabContext value={value}>
                  <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                    <TabList onChange={handleChange} aria-label="movie tabs">
                      <Tab
                        label="Overview"
                        value="1"
                        sx={{
                          fontSize: "14px",
                          fontWeight: 700,
                          textTransform: "none",
                        }}
                      />
                    </TabList>
                  </Box>
                  <TabPanel value="1" sx={{ padding: "24px 0 0" }}>
                    <div className="info-list">
                      <div className="info-row">
                        <span>Plot</span>
                        <p>{movies?.Plot || "NA"}</p>
                      </div>
                      <div className="info-row">
                        <span>Actors</span>
                        <p>{movies?.Actors || "NA"}</p>
                      </div>
                      <div className="info-row">
                        <span>Genre</span>
                        <p>{movies?.Genre || "NA"}</p>
                      </div>
                      <div className="info-row">
                        <span>Director</span>
                        <p>{movies?.Director || "NA"}</p>
                      </div>
                    </div>
                  </TabPanel>
                </TabContext>
              </Box>
            </div>
          </div>
        </section>
      )}

      <Snackbar
        open={open}
        autoHideDuration={4000}
        onClose={handleWishlistClose}
      >
        <Alert
          onClose={handleWishlistClose}
          severity="success"
          variant="filled"
          sx={{ width: "100%", fontSize: "15px" }}
        >
          <b>{movies?.Title}</b> is added to watchlist
        </Alert>
      </Snackbar>

      <Dialogbox
        error={wishlistError}
        openErrorBox={openErrorBox}
        handleClose={handleDialogClose}
        setOpenErrorBox={setOpenErrorBox}
        component={"movieDetails"}
      />
    </div>
  );
}

export default MovieDetails;
