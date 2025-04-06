//watchlist.js
 
import { createContext, useState } from "react";
 
export const wishlistContext = createContext(null);
 
export const WishlistProvider = (props) => {
  const [movies, setMovies] = useState([]);
  return (
    <wishlistContext.Provider value={{ movies, setMovies }}>
      {props.children}
    </wishlistContext.Provider>
  );
};