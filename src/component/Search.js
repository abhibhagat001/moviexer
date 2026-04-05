import React, { useEffect, useState, useMemo } from "react";
import "../Design/search.css";
import MovieList from "./MovieList";
import { useContext } from "react";
import { themeContext } from "../context/ThemeContext";
import Pagination from "@mui/material/Pagination";
import Navbar from "./Navbar";
import WatchlistLoader from "./WatchlistLoader";
import useFetchAPI from "../Hooks/useFetchAPI";
import useLocalStorage from "../Hooks/useLocalStorage";
import Modal from "./Modal";

export default function Search() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { darkMode } = useContext(themeContext);
  const [startSearching, setStartSearching] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [movies, setMovies, dataLoader, error, setError, getMovieDetails] =
    useFetchAPI();
  const [, setStoredValue] = useLocalStorage("movieState", {});

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("movieState"));
    if (saved) {
      setSearchTerm(saved.searchTerm || "");
      setDebouncedSearchTerm(saved.searchTerm || "");
      setMovies(saved.movies);
      setCurrentPage(saved.currentPage || 1);
      setStartSearching(saved.startSearching || false);
    }
  }, [setMovies]);

  useEffect(() => {
    setStoredValue({ searchTerm, movies, currentPage, startSearching });
  }, [searchTerm, movies, currentPage, startSearching, setStoredValue]);

  const filteredMovies = useMemo(() => movies?.Search || [], [movies]);
  const totalPages = movies?.totalResults
    ? Math.ceil(movies.totalResults / 10)
    : 1;

  function handleChange(e) {
    const nextValue = e.target.value;
    setSearchTerm(nextValue);

    if (!nextValue.trim()) {
      setStartSearching(false);
      setMovies(null);
      setCurrentPage(1);
      setDebouncedSearchTerm("");
    }
  }

  useEffect(() => {
    if (!startSearching || !debouncedSearchTerm) {
      return;
    }

    if (currentPage > 1) {
      getMovieDetails("/", {
        apiKey: "2149ed44",
        s: debouncedSearchTerm,
        page: currentPage,
      });

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }, [currentPage, debouncedSearchTerm, getMovieDetails, startSearching]);

  useEffect(() => {
    const trimmedSearch = searchTerm.trim();

    if (!trimmedSearch) {
      return undefined;
    }

    const debounceTimer = setTimeout(() => {
      setCurrentPage(1);
      setDebouncedSearchTerm(trimmedSearch);
      setStartSearching(true);
      getMovieDetails("/", {
        apiKey: "2149ed44",
        s: trimmedSearch,
        page: 1,
      });
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, getMovieDetails]);

  const submitSearch = () => {
    if (searchTerm.trim() === "") {
      alert("Please enter a movie name to search.");
      return;
    }

    const trimmedSearch = searchTerm.trim();
    setCurrentPage(1);
    setDebouncedSearchTerm(trimmedSearch);
    setStartSearching(true);
    getMovieDetails("/", {
      apiKey: "2149ed44",
      s: trimmedSearch,
      page: 1,
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      submitSearch();
    }
  };

  const handleClose = () => {
    setError("");
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar>MOVIEXER</Navbar>

      <main
        className={
          darkMode
            ? "bg-dark darktheme text-light mainScreen flex-grow-1"
            : "lighttheme text-dark mainScreen flex-grow-1"
        }
      >
        <section className="search-shell">
          <div className="search-hero">
            <div className="hero-copy">
              <span className="hero-kicker">Movie discovery, refined</span>
              <h1>Search films, explore details, and build a cleaner watchlist.</h1>
              <p>
                Find titles fast, open full details instantly, and keep your
                saved collection organized in a cleaner, more professional
                workspace.
              </p>
            </div>

            <div className="hero-stats">
              <div className="hero-stat-card">
                <span>Results</span>
                <strong>{movies?.totalResults || "0"}</strong>
                <small>from OMDb search</small>
              </div>
              <div className="hero-stat-card">
                <span>Page</span>
                <strong>{startSearching ? currentPage : "--"}</strong>
                <small>{startSearching ? "active browsing" : "waiting to search"}</small>
              </div>
            </div>
          </div>

          <section className="search-panel">
            <div className="search-panel-top">
              <div>
                <h2>Find your next watch</h2>
                <p>Search by movie title and browse posters, years, and details.</p>
              </div>
            </div>

            <div className="search-facility">
              <div className="search-input-wrap">
                <i className="fa-solid fa-magnifying-glass"></i>
                <input
                  type="search"
                  placeholder="Search movies like Interstellar, Dune, Inception..."
                  className="search-box"
                  value={searchTerm}
                  onKeyDown={handleKeyDown}
                  onChange={handleChange}
                />
              </div>

              <button
                onClick={submitSearch}
                type="button"
                className={!dataLoader ? "button" : "disabled-button"}
                disabled={dataLoader}
              >
                {dataLoader ? "Searching..." : "Search"}
              </button>
            </div>

            {!startSearching && (
              <div className="empty-state">
                <div className="empty-state-badge">Start here</div>
                <h3>Begin with any movie title</h3>
                <p>
                  Try searching for a favorite film to explore posters, ratings,
                  cast, and plot in a cleaner layout.
                </p>
              </div>
            )}

            {startSearching && filteredMovies.length === 0 && !dataLoader && (
              <div className="empty-state">
                <div className="empty-state-badge">No match</div>
                <h3>No movies found</h3>
                <p>Check the spelling or try a broader title to see more results.</p>
              </div>
            )}

            {filteredMovies.length > 0 && (
              <div className="results-summary">
                <div>
                  <h3>Search results</h3>
                  <p>{movies?.totalResults || filteredMovies.length} titles found</p>
                </div>
              </div>
            )}

            <div className="movies-list">
              <div className="row gx-4 gy-4">
                {!dataLoader &&
                  filteredMovies.map((movie) => (
                    <div
                      className="col-xl-3 col-lg-4 col-md-6 movieCard"
                      key={movie.imdbID}
                    >
                      <MovieList
                        movie={movie}
                        uid={localStorage.getItem("userId")}
                      />
                    </div>
                  ))}
              </div>

              {dataLoader && (
                <div className="d-flex justify-content-center py-5">
                  <WatchlistLoader />
                </div>
              )}
            </div>

            {filteredMovies.length > 0 && !dataLoader && (
              <div id="bottom-pagination">
                <Pagination
                  count={parseInt(totalPages, 10)}
                  color="primary"
                  onChange={(e, value) => setCurrentPage(value)}
                  page={currentPage}
                  sx={{
                    "& .MuiPaginationItem-root": {
                      color: darkMode ? "#f8f8fb" : "#151821",
                      fontWeight: "700",
                      borderRadius: "12px",
                    },
                  }}
                />
              </div>
            )}
          </section>
        </section>
      </main>

      {error && (
        <Modal handleClose={handleClose}>
          <div>{error}</div>
        </Modal>
      )}
    </div>
  );
}
