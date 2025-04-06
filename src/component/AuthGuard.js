import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
 
const AuthGuard = ({ children }) => {
  const [status, setStatus] = useState(false);
  const navigate = useNavigate();
 
  useEffect(() => {
    checkToken();
  }, [{ children }]);
 
  const checkToken = async () => {
    try {
      const token = localStorage.getItem("userId");
      // let user = true;
      if (!token) {
        alert("User not authenticated");
        navigate(`/`);
      }
      setStatus(true);
      return;
    } catch (error) {
      navigate(`/`);
    }
  };
 
  return status && <React.Fragment>{children}</React.Fragment>;
};
 
export default AuthGuard;
 
 
