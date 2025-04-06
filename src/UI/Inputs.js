//input.js
 
import React from "react";
 
function Inputs({
  htmlFor,
  labelClassName,
  children,
  id,
  type,
  name,
  value,
  placeholder,
  onChange,
  error,
  showPassword,
  togglePassword,
}) {
  return (
    <div className="mb-3 userDetails">
      <label htmlFor={htmlFor} className={labelClassName}>
        {children}
      </label>
 
      {htmlFor !== "password" && (
        <input
          id={id}
          type={type}
          name={name}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          className={`form-control  ${error ? "inputs" : ""}`}
        />
      )}
 
      {htmlFor === "password" && (
        <>
          <div className="password-container">
            <input
              id={id}
              type={type}
              name={name}
              value={value}
              placeholder={placeholder}
              onChange={onChange}
              className={`form-control  ${error ? "inputs" : ""}`}
            />
 
            {/* show password */}
            {!showPassword && (
              <span className="eye-icon">
                <i className="fa-solid fa-eye" onClick={togglePassword}></i>
              </span>
            )}
 
            {/* hide password */}
            {showPassword && (
              <span className="close-eye-icon">
                <i
                  className="fa-solid fa-eye-slash"
                  onClick={togglePassword}
                ></i>
              </span>
            )}
          </div>
        </>
      )}
 
      {/* username error */}
      {error && <div className="invalid-input fw-semibold">{error}</div>}
    </div>
  );
}
 
export default Inputs;