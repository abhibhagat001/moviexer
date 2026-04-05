import "../Design/WatchlistLoader.css";
import React from "react";

function WatchlistLoader({ label = "Loading movies" }) {
  return (
    <div className="modern-loader" aria-label={label} role="status">
      <div className="modern-loader-orb modern-loader-orb-one"></div>
      <div className="modern-loader-orb modern-loader-orb-two"></div>
      <div className="modern-loader-ring"></div>
      <div className="modern-loader-core">
        <i className="fa-solid fa-film"></i>
      </div>
      <span className="modern-loader-text">{label}</span>
    </div>
  );
}

export default WatchlistLoader;
