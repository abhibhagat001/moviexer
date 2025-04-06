import "./App.css";
import Search from "./component/Search";
import MovieDetails from "./component/MovieDetails";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import WatchList from "./component/WatchList.js";
import Login from "./component/Login";
import AuthGuard from "./component/AuthGuard";
import SignUp from "./component/SignUp";
function App() {
  const router = createBrowserRouter([
    { path: "/", element: <SignUp /> },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/search",
      key: "Search",
      element: (
        <AuthGuard>
          <Search />
        </AuthGuard>
      ),
    },
    {
      path: "/movieDetails/:title",
      element: <MovieDetails />,
    },
    {
      path: "/watchlist",
      key: "watchlist",
      element: (
        <AuthGuard>
          <WatchList />
        </AuthGuard>
      ),
    },
    {
      path: "*",
      element: <div>{<h1>404 Page Not Found</h1>}</div>,
    },
  ]);
  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}
export default App;
 
 

 
 

 
 
 
 
 
 

