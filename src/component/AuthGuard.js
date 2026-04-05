import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
 
const AuthGuard = ({ children }) => {
  const [status, setStatus] = useState(false);
  const navigate = useNavigate();

  const checkToken = React.useCallback(() => {
    try {
      const token = localStorage.getItem("userId");
      if (!token) {
        alert("User not authenticated");
        navigate(`/`);
        return;
      }
      setStatus(true);
    } catch (error) {
      navigate(`/`);
    }
  }, [navigate]);
 
  useEffect(() => {
    checkToken();
  }, [checkToken, children]);
 
  return status && <React.Fragment>{children}</React.Fragment>;
};
 
export default AuthGuard;
 
 
