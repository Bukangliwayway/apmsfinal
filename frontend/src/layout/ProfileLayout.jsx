import React from "react";
import Sidebar from "../components/navigator/Sidebar";
import Navbar from "../components/navigator/Navbar";
import { Box, Grid } from "@mui/material";
import Rightbar from "../components/navigator/Rightbar";
function ProfileLayout({ children }) {
  const sidebarWidth = 25; // Update as needed
  const rightbarWidth = 30; // Update as needed

  return (
    <Box>
      <Navbar />
      <Grid container spacing={8}>
        <Grid
          item
          position="fixed"
          sx={{
            display: { sm: "none", md: "block" },
          }}
          width={sidebarWidth + "vw"}
        >
          <Sidebar />
        </Grid>
        <Grid item xs={6} mx={"auto"}>
          <Box sx={{ minHeight: "100vh" }}>{children}</Box>
        </Grid>
        <Grid
          item
          position="fixed"
          sx={{
            display: { sm: "none", md: "flex" },
            justifyContent: "center",

            right: 0,
          }}
          width={rightbarWidth + "vw"}
          height={"100vh"}
        >
          <Rightbar />
        </Grid>
      </Grid>
    </Box>
  );
}

export default ProfileLayout;
