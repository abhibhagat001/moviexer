import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { useLocation } from "react-router-dom";
import "../Design/MovieDetails.css";
import { themeContext } from "../context/ThemeContext";
import Navbar from "./Navbar";
import WatchlistLoader from "./WatchlistLoader";
 
// import * as React from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
 
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
 
//import images from assets folder
import rotten_tomatoes from "../Assests/Rotten_Tomatoes.png";
import imdb from "../Assests/IMDB.png";
import meta from "../Assests/Metacritic.png";
import api from "./AxiosInstance";
import Dialogbox from "./Dialogbox";
 
function MovieDetails() {
  const { darkMode, setDarkMode } = useContext(themeContext);
  const [movieDetails, setMovieDetails] = useState("");
  const [IsLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [openErrorBox, setOpenErrorBox] = React.useState(false);
  const location = useLocation();
  const movieData = location.state;
 
  useEffect(() => {
    const storedMovie = localStorage.getItem("movieDetail");
    if (storedMovie) {
      const parsedData = JSON.parse(storedMovie);
      if (parsedData.Title === movieData) {
        setMovieDetails(parsedData);
        setIsLoading(false);
        return;
      }
    }
 
    fetchMovieDetails();
  }, [movieData]);
 
  async function fetchMovieDetails() {
    const apiKey = "2149ed44";
    const url = `/?t=${movieData}&apikey=${apiKey}`;
    try {
      const response = await api.get(url);
      setMovieDetails(response.data);
 
      localStorage.setItem("movieDetail", JSON.stringify(response.data));
      setIsLoading(false);
    } catch (err) {
      setOpenErrorBox(true);
      // setIsLoading(false);
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
      } else {
        setError("Error occurred");
      }
    }
  }
 
  const [value, setValue] = React.useState("1");
 
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
 
  const handleClose = (event, reason) => {
    if (reason && reason === "backdropClick") return;
    setOpenErrorBox(true);
  };
 
  return (
    <React.Fragment>
      <div
        className={
          darkMode
            ? "bg-dark text-light mainContainer d-flex flex-column min-vh-100"
            : "bg-light text-dark mainContainer d-flex flex-column min-vh-100"
        }
      >
        <div className="header">
          <Navbar>MOVIEXER</Navbar>
        </div>
 
        {IsLoading ? (
          <div className="d-flex justify-content-center align-items-center">
            <WatchlistLoader />
          </div>
        ) : (
          <div className="container-fluid container-details flex-grow-1 d-flex justify-content-center align-items-center ">
            <div className="row detailsContainer d-flex align-items-center">
              <div className="col-md-4">
                <img
                  src={
                    movieDetails.Poster !== "N/A"
                      ? movieDetails.Poster
                      : `https://placehold.co/4000x2900?text=Poster+not+found!!`
                  }
                  alt="Not found"
                  className="rounded-5 poster"
                />
              </div>
              <div className="col-md-8 movie-title">
                <div className="row movie-title-row">
                  <div className="col-12 movie-heading">
                    {movieDetails.Title}
                  </div>
                </div>
 
                <div className="row movie-runlength d-flex align-items-center">
                  <div className="col-12 movie-runlength d-flex align-items-center">
                    <img
                      style={{ width: "20px", height: "20px" }}
                      src="https://img.icons8.com/doodle/48/calendar--v2.png"
                      alt="calendar--v2"
                    />
                    &nbsp;{movieDetails.Year} &nbsp; | &nbsp;
                    <img
                      style={{ width: "20px", height: "20px" }}
                      src="https://img.icons8.com/dusk/64/movie-projector.png"
                      alt="movie-projector"
                    />
                    &nbsp; {movieDetails.Runtime} &nbsp; | &nbsp;
                    <img
                      style={{ width: "20px", height: "20px" }}
                      src="https://img.icons8.com/parakeet/48/certificate.png"
                      alt="certificate"
                    />
                    &nbsp; {movieDetails.Rated}
                  </div>
                </div>
                <div className="row rating d-flex justify-content-between mt-3">
                  <div className="col-md-3 rating-card">
                    <img classname="img-fluid" src={imdb} alt="" />
                    <div className="text-center p-4">
                      <i className="fa-solid fa-star"></i>&nbsp;
                      {movieDetails?.Ratings[0]?.Value || "NA"}
                    </div>
                  </div>
                  <div className="col-md-3 rating-card">
                    <img classname="img-fluid" src={rotten_tomatoes} alt="" />
                    <div className="text-center p-4">
                      <i className="fa-solid fa-star"></i>&nbsp;
                      {movieDetails?.Ratings[1]?.Value || "NA"}
                    </div>
                  </div>
                  <div className="col-md-3 rating-card">
                    <img classname="img-fluid" src={meta} alt="" />
                    <div className="text-center p-4">
                      <i className="fa-solid fa-star"></i>&nbsp;
                      {movieDetails?.Ratings[2]?.Value || "NA"}
                    </div>
                  </div>
                </div>
 
                <Box
                  sx={{ width: "100%", typography: "body1", fontSize: "13px" }}
                >
                  <TabContext value={value}>
                    <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                      <TabList
                        onChange={handleChange}
                        aria-label="lab API tabs example"
                      >
                        <Tab
                          label="Overview"
                          value="1"
                          sx={{ fontSize: "14px", fontWeight: "600" }}
                        />
                      </TabList>
                    </Box>
                    <TabPanel value="1" sx={{ fontSize: "16px" }}>
                      <div className="row mb-2">
                        <div className="col-md-2 d-flex align-items-center gap-1">
                          <img
                            style={{ width: "25px" }}
                            src="https://img.icons8.com/plasticine/100/film-reel.png"
                            alt="film-reel"
                          />{" "}
                          Plot:
                        </div>
                        <div className="col-md-10">{movieDetails.Plot}</div>
                      </div>
                      <div className="row mb-2">
                        <div className="col-md-2 d-flex align-items-center gap-1">
                          <img
                            style={{ width: "25px" }}
                            src="https://img.icons8.com/color/48/theatre-mask.png"
                            alt="theatre-mask"
                          />{" "}
                          Actors:
                        </div>
                        <div className="col-md-10">{movieDetails.Actors}</div>
                      </div>
                      <div className="row mb-2">
                        <div className="col-md-2 d-flex align-items-center gap-1">
                          <img
                            style={{ width: "20px" }}
                            src="https://img.icons8.com/color/48/comedy.png"
                            alt="comedy"
                          />
                          Genre:
                        </div>
                        <div className="col-md-10">{movieDetails.Genre}</div>
                      </div>
                      <div className="row mb-2">
                        <div className="col-md-2 d-flex align-items-center gap-1">
                          <img
                            style={{ width: "25px" }}
                            src="https://img.icons8.com/external-flaticons-flat-flat-icons/64/external-director-video-production-flaticons-flat-flat-icons-2.png"
                            alt="external-director-video-production-flaticons-flat-flat-icons-2"
                          />
                          Director:
                        </div>
                        <div className="col-md-10">{movieDetails.Director}</div>
                      </div>
                    </TabPanel>
                  </TabContext>
                </Box>
              </div>
            </div>
          </div>
        )}
 
        <Dialogbox
          error={error}
          openErrorBox={openErrorBox}
          handleClose={handleClose}
          setOpenErrorBox={setOpenErrorBox}
          handleClick={fetchMovieDetails}
          component={"movieDetails"}
        />
      </div>
    </React.Fragment>
  );
}
 
export default MovieDetails;
 
 
