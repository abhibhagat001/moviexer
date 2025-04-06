import React, { Component } from "react";

import Dialog from "@mui/material/Dialog";

import DialogActions from "@mui/material/DialogActions";

import DialogContent from "@mui/material/DialogContent";

import DialogContentText from "@mui/material/DialogContentText";

import DialogTitle from "@mui/material/DialogTitle";

import Button from "@mui/material/Button";

 

function Dialogbox({

  openErrorBox,

  error,

  handleClose,

  handleClick,

  setOpenErrorBox,

  component,

}) {

  return (

    <Dialog

      open={openErrorBox}

      onClose={handleClose}

      aria-labelledby="alert-dialog-title"

      aria-describedby="alert-dialog-description"

      sx={{

        "& .MuiDialog-container": {

          "& .MuiPaper-root": {

            width: "100%",

            maxWidth: "500px",

          },

        },

      }}

    >

      <DialogTitle

        id="alert-dialog-title"

        sx={{ fontSize: "20px", fontWeight: "600", color: "#B22222" }}

      >

        <i className="fa-solid fa-triangle-exclamation"></i> Something Went

        Wrong

      </DialogTitle>

      <DialogContent>

        <DialogContentText

          id="alert-dialog-description"

          sx={{ fontSize: "14px" }}

        >

          {error}

        </DialogContentText>

      </DialogContent>

      <DialogActions>

        {component !== "login" &&

          component !== "SingUp" &&

          component !== "movielist" && (

            <Button

              onClick={() => {

                handleClick();

                setOpenErrorBox(false);

              }}

              sx={{ fontSize: "12px", fontWeight: "600" }}

            >

              Retry

            </Button>

          )}

 

        {component !== "movieDetails" && component !== "watchlist" && (

          <Button

            onClick={() => {

              setOpenErrorBox(false);

            }}

            sx={{ fontSize: "12px", fontWeight: "600" }}

          >

            Close

          </Button>

        )}

      </DialogActions>

    </Dialog>

  );

}

 

export default Dialogbox;

 

 
