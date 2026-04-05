import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { wishlistContext } from "../context/WatchList";
import MovieList from "./MovieList";
import Backdrop from "@mui/material/Backdrop";
import NoDataImage from "../Assests/emptyWatchlist.jpg";
import "../Design/WatchList.css";
import { themeContext } from "../context/ThemeContext";
import { Link } from "react-router-dom";
import { getFirestore, getDoc, setDoc, doc } from "firebase/firestore";
import { app } from "../firebase";
import Navbar from "./Navbar";
import WatchlistLoader from "./WatchlistLoader";
import Dialogbox from "./Dialogbox";

const db = getFirestore(app);

const WatchList = () => {
  const watchlist = useContext(wishlistContext);
  const theme = useContext(themeContext);
  const userId = localStorage.getItem("userId");
  const [isLoading, setIsLoading] = useState(true);
  const [open, setOpen] = React.useState(false);
  const [error, setError] = useState("");
  const [openErrorBox, setOpenErrorBox] = React.useState(false);
  const DocRef = doc(db, "watchlists", userId);

  const fetchList = React.useCallback(async () => {
    try {
      const docSnap = await getDoc(DocRef);
      const docData = docSnap.data();
      if (docData && docData.movies) {
        watchlist.setMovies(docData.movies);
      }
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      setOpenErrorBox(true);
      if (err.code === "unavailable") {
        setError(
          <>
            <i className="fa-solid fa-wifi" style={{ color: "#007BFF" }}></i>{" "}
            Please check your internet conncetion
          </>
        );
      } else {
        setError(
          <>
            <i className="fa-solid fa-wifi" style={{ color: "#007BFF" }}></i>{" "}
            Internal server error
          </>
        );
      }
    }
  }, [DocRef, watchlist]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  async function removeFromWatchList(title) {
    setTimeout(() => {
      setOpen(false);
    }, 2000);

    try {
      const docSnap = await getDoc(DocRef);
      const updatedList = docSnap.data().movies.filter((item) => item.movie.Title !== title);

      await setDoc(DocRef, {
        movies: updatedList,
        userId,
      });
      watchlist.setMovies(updatedList);
    } catch (err) {
      setIsLoading(false);
      setOpenErrorBox(true);
      if (err.code === "unavailable") {
        setError(
          <>
            <i className="fa-solid fa-wifi" style={{ color: "#007BFF" }}></i>{" "}
            Please check your internet conncetion
          </>
        );
      } else {
        setError(
          <>
            <i className="fa-solid fa-wifi" style={{ color: "#007BFF" }}></i>{" "}
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
          : "lighttheme d-flex flex-column w-100 min-vh-100"
      }
    >
      <Navbar>Watchlist</Navbar>

      <section className="watchlist-shell">
        <div className="watchlist-header">
          <div>
            <span className="watchlist-badge">Saved collection</span>
            <h1>Your movie shortlist</h1>
            <p>
              Keep the films you want to revisit in one cleaner, more focused
              space.
            </p>
          </div>

          <Link
            to="#"
            onClick={(e) => {
              e.preventDefault();
              window.history.back();
            }}
            className="watchlist-back-btn"
          >
            <i className="fa-solid fa-arrow-left"></i> Back
          </Link>
        </div>

        {isLoading && (
          <div className="d-flex justify-content-center align-items-center py-5">
            <WatchlistLoader />
          </div>
        )}

        {!openErrorBox && !isLoading && watchlist.movies.length === 0 && (
          <div className="watchlist-empty">
            <img id="noWtchlistFound" src={NoDataImage} alt="Empty watchlist" />
            <div>
              <h2>Your watchlist is empty</h2>
              <p>Save a few titles from search and they’ll appear here.</p>
            </div>
          </div>
        )}

        {!isLoading && watchlist.movies.length > 0 && (
          <div className="watchlist-grid row gx-4 gy-4">
            {watchlist.movies.map((item, index) => (
              <div className="col-xl-3 col-lg-4 col-md-6 user-watchlist" key={index}>
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
      </section>

      <Backdrop sx={(muiTheme) => ({ color: "#ffff", zIndex: muiTheme.zIndex.drawer + 1 })} open={open}>
        <span className="deleting">Removing</span>
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
