import PublicLayout from "../layout/PublicLayout";
import ProfileLayout from "../layout/ProfileLayout";
import AdminLayout from "../layout/AdminLayout";
import React from "react";
import useAll from "../hooks/utilities/useAll";
import {
  Alert,
  Backdrop,
  Box,
  CircularProgress,
  LinearProgress,
  Snackbar,
} from "@mui/material";

export const MainLayout = ({ mode, children }) => {
  const {
    backdropLoading,
    linearLoading,
    message,
    openSnackbar,
    setOpenSnackbar,
    severity,
  } = useAll();

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnackbar(false);
  };

  let Layout;
  switch (mode) {
    case "profile":
      Layout = ProfileLayout;
      break;
    case "public":
      Layout = PublicLayout;
      break;
    case "admin":
      Layout = AdminLayout;
      break;
    default:
      Layout = React.Fragment;
  }

  return (
    <>
      {linearLoading && (
        <Box
          sx={{
            width: "100%",
            position: "fixed",
            top: 0,
            zIndex: 9999,
          }}
        >
          <LinearProgress />
        </Box>
      )}
      <Backdrop
        open={backdropLoading}
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity={severity} sx={{ width: "100%" }}>
          {message}
        </Alert>
      </Snackbar>
      <Layout>{children}</Layout>
    </>
  );
};
export default MainLayout;
