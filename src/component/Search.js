import React, { useEffect, useState,useMemo } from "react";
import "../Design/search.css";
import MovieList from "./MovieList";
import { useContext } from "react";
import { themeContext } from "../context/ThemeContext";
import Pagination from "@mui/material/Pagination";
import Navbar from "./Navbar";
import WatchlistLoader from "./WatchlistLoader";
import Dialogbox from "./Dialogbox";
import useFetchAPI from "../Hooks/useFetchAPI";
import useLocalStorage from "../Hooks/useLocalStorage";


export default function Search() {

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { darkMode } = useContext(themeContext);
  const [startSearching,setStartSearching] = useState(false);
  const [anim, setAnim] = useState(false);
  const [openErrorBox, setOpenErrorBox] = React.useState(false);
  const [movies,setMovies,dataLoader,error,getMovieDetails] = useFetchAPI();
  const [storedValue, setStoredValue] = useLocalStorage('movieState',{});


  useEffect(()=>{
      const saved = JSON.parse(localStorage.getItem('movieState'));
      if(saved){
          setSearchTerm(saved.searchTerm);
          setMovies(saved.movies);
          setCurrentPage(saved.currentPage);
          setStartSearching(saved.startSearching);
          return;
      }
  },[]);

  useEffect(()=>{
      setStoredValue({searchTerm,movies,currentPage,startSearching});
  },[searchTerm,movies,currentPage,startSearching]);
 

  // Memoize filtered movies to avoid unnecessary re-renders
  const filteredMovies = useMemo(() => {
    return movies?.Search || [];
  }, [movies]);

  //function to handle search box event
  function handleChange(e) {
    setSearchTerm(e.target.value);
  }

  // On button click function invokes and search movies

  function handleClick() {
    setAnim(true);
    setStartSearching(true);
    getMovieDetails(searchTerm,currentPage);
    setTimeout(() => setAnim(false), 500);
  }
 

  useEffect(()=>{

    if(searchTerm) {
      
        let endpoint = `/`;
        let params = {
          apiKey: "2149ed44",
          s: searchTerm.trim(),
          page: currentPage,
        }


        getMovieDetails(endpoint,params);
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });

    }

  },[currentPage]);
 

  // On click of ENTER key search movie
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
       setCurrentPage(1);
        let endpoint = `/`;
        let params = {
          apiKey: "2149ed44",
          s: searchTerm.trim(),
          page: currentPage,
        }

        getMovieDetails(endpoint,params);
        setStartSearching(true);
    }
  };

  const handleSearch=()=>{
    setAnim(true);
    setCurrentPage(1);
    setStartSearching(true);
    let endpoint = `/`;
    let params = {
      apiKey: "2149ed44",
      s: searchTerm.trim(),
      page: currentPage,
    }
    getMovieDetails(endpoint,params);
    setTimeout(() => setAnim(false), 500);
  }
 

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
            onClick={handleSearch}
            type="button"
            className={!dataLoader ? "button" : "disabled-button"}
          >
            <span className="fw-bold">Search</span>
          </button>
        </div>


        {!startSearching  &&  (
          <div id="parentDivWelcomeImg">Start Searching Movies...</div>
        )}
 
        {startSearching && movies?.Search.length===0 && !dataLoader && (
          <div id="parentDivWelcomeImg">Movies Not Found.</div>
        )}
     

        {/* Render the movie list */}
        <div className="movies-list">
          <div className="row">
            {!dataLoader && movies?.Search !== null && filteredMovies.map((movie) => (
                <div
                  className="col-lg-3 col-sm-6 col-md-4 mb-4 py-3 movieCard"
                  key={movie.imdbID}
                >
                  <MovieList movie={movie} uid={localStorage.getItem("userId")} />
                </div>
            ))}
          </div>

          {/* rendering the loader while fetching API */}
          {dataLoader && (
            <div className="d-flex justify-content-center">
              <WatchlistLoader />
            </div>
          )}

        </div>

 
        {/* pagination component */}

        {movies?.Search.length>0 && !dataLoader &&  (

          <div id="bottom-pagination">

            <Pagination
              count={parseInt(Math.ceil(movies?.totalResults / 10))}
              color="primary"
              onChange={(e, value) => setCurrentPage(value)}
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

 

 