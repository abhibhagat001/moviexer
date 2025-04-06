import React, { useEffect, useState } from "react";

import "../Design/search.css";

import MovieList from "./MovieList";

import { useContext } from "react";

import { themeContext } from "../context/ThemeContext";

import Pagination from "@mui/material/Pagination";

import Navbar from "./Navbar";

 

import WatchlistLoader from "./WatchlistLoader";

import api from "./AxiosInstance";

import Dialogbox from "./Dialogbox";

 

export default function Search() {

  const [searchTerm, SetSearchTerm] = useState(() => {

    return localStorage.getItem("searchTerm");

  });

  const [movies, setMovies] = useState([]);

  const [totalResults, setTotalResults] = useState();

  const [currentPage, setCurrentPage] = useState(1);

  const { darkMode } = useContext(themeContext);

  const [error, setError] = useState("");

 

  const [dataLoader, setDataLoader] = useState(false);

  const [anim, setAnim] = useState(false);

  const [openErrorBox, setOpenErrorBox] = React.useState(false);

 

  useEffect(() => {

    const storedMovies = localStorage.getItem("movies");

    const pages = localStorage.getItem("pages");

    if (storedMovies) {

      setMovies(JSON.parse(storedMovies));

    }

    if (pages) {

      setTotalResults(JSON.parse(pages));

    }

    if (currentPage) {

      setCurrentPage(JSON.parse(localStorage.getItem("currentPage")));

    }

    if (!localStorage.getItem("movies")) {

      setCurrentPage(0);

    }

  }, []);

 

  //function to handle search box event

  function handleChange(e) {

    SetSearchTerm(e.target.value);

    localStorage.setItem("searchTerm", e.target.value);

    setCurrentPage(1);

  }

 

  // On button click function invokes and search movies

  function handleClick() {

    setAnim(true);

    getMovieDetails(searchTerm);

    setTimeout(() => setAnim(false), 500);

  }

 

  async function getMovieDetails(pageNo) {

    if (searchTerm.length === 0) {

      setError(

        <>

          <i

            className="fa-solid fa-triangle-exclamation"

            style={{ color: "#ff9800", fontWeight: "600" }}

          ></i>{" "}

          INVALID INPUT..Enter movie name

        </>

      );

      setOpenErrorBox(true);

 

      return;

    }

 

    setDataLoader(true);

    // API call to search movie

    await api

      .get(`/?s=${searchTerm.trim()}`, {

        params: {

          apiKey: "2149ed44",

          page: pageNo,

        },

      })

      .then((response) => {

        if (response.data.Response === "False") {

          localStorage.setItem("movies", null);

          setCurrentPage(0);

          setMovies(null);

          setDataLoader(false);

 

          return 0;

        }

 

        setMovies(response.data.Search);

        setTotalResults(Math.ceil(response.data.totalResults / 10));

        localStorage.setItem(

          "pages",

          JSON.stringify(Math.ceil(response.data.totalResults / 10))

        );

        localStorage.setItem("movies", JSON.stringify(response.data.Search));

        setDataLoader(false);

      })

      .catch((err) => {

        setOpenErrorBox(true);

        setDataLoader(false);

        if (err.code === "ERR_NETWORK") {

          setError(

            <>

              <i

                class="fa-solid fa-wifi"

                style={{ color: "#007BFF", fontWeight: "600" }}

              ></i>{" "}

              Please check your internet conncetion

            </>

          );

        } else if (err.code === "ECONNABORTED") {

          setError(

            <>

              <i

                className="fa-regular fa-clock"

                style={{ color: "#ff9800", fontWeight: "600" }}

              ></i>{" "}

              Request timeout

            </>

          );

        }

      });

  }

 

  // handling pagination

  const handlePageChange = (event, pageNumber) => {

    window.scrollTo({

      top: 0,

      behavior: "smooth",

    });

    setCurrentPage(pageNumber);

    localStorage.setItem("currentPage", pageNumber);

    getMovieDetails(pageNumber);

  };

 

  // On click of ENTER key search movie

  const handleKeyDown = (e) => {

    if (e.key === "Enter") {

      getMovieDetails(searchTerm);

    }

  };

 

  // prevents closing the dialog box when user clicks outside dialog box

  const handleClose = (event, reason) => {

    if (reason && reason === "backdropClick") return;

    setOpenErrorBox(true);

  };

 

  return (

    <div className="d-flex flex-column min-vh-100">

      <div>

        {/* Navbar */}

        <Navbar>MOVIEXER</Navbar>

      </div>

 

      <div

        className={

          darkMode

            ? "bg-dark darktheme text-light mainScreen flex-grow-1"

            : "lighttheme text-dark mainScreen flex-grow-1"

        }

      >

        {/* search box */}

        <div className="search-facility">

          <input

            type="search"

            placeholder="Enter movie name here..."

            className="form-control search-box fw-bold border border-1 border-dark"

            value={searchTerm}

            onKeyDown={handleKeyDown}

            onChange={handleChange}

          />

 

          {/* search button */}

          <button

            onClick={handleClick}

            type="button"

            className={!dataLoader ? "button" : "disabled-button"}

          >

            <span className="fw-bold">Search</span>

          </button>

        </div>

 

        {/* when user first time open application show this text */}

        {!localStorage.getItem("movies") && (

          <div id="parentDivWelcomeImg">Start Searching movies!!</div>

        )}

 

        {/* Render the movie list */}

        <div className="movies-list">

          {

            <div className="row">

              {!dataLoader &&

                movies !== null &&

                movies.map((movie, index) => (

                  <div

                    className="col-lg-3 col-sm-6 col-md-4 mb-4 py-3 movieCard"

                    key={index}

                  >

                    <MovieList

                      movie={movie}

                      uid={localStorage.getItem("userId")}

                    />

                  </div>

                ))}

            </div>

          }

 

          {/* rendering the loader while fetching API */}

          {dataLoader && (

            <div className="d-flex justify-content-center">

              <WatchlistLoader />

            </div>

          )}

        </div>

 

        {/* Showing this message if movie not found */}

        {!movies && !dataLoader && (

          <div className="not-found d-flex justify-content-center fw-bold mt-5">

            Movie not found !!

            {localStorage.removeItem("pages")}

          </div>

        )}

 

        {/* pagination component */}

        {localStorage.getItem("movies") && !dataLoader && movies !== null && (

          <div id="bottom-pagination">

            <Pagination

              count={totalResults}

              color="primary"

              onChange={handlePageChange}

              page={currentPage}

              sx={{

                "& .MuiPaginationItem-root": {

                  color: darkMode ? "white" : "black",

                  fontWeight: "800",

                },

              }}

            />

          </div>

        )}

      </div>

 

      {/* Dialog box component */}

      <Dialogbox

        error={error}

        openErrorBox={openErrorBox}

        handleClose={handleClose}

        setOpenErrorBox={setOpenErrorBox}

        handleClick={handleClick}

      />

    </div>

  );

}

 

 