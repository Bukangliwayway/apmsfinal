import React from "react";
import Navbar from "../components/navigator/Navbar";
import { Box, Grid, Stack } from "@mui/material";
import AdminSidebar from "../components/navigator/AdminSidebar";
function AdminDashboardLayout({ children, mode, setMode, activeIndex }) {
  const sidebarWidth = 25; // Update as needed

  return (
    <Box>
      <Navbar mode={mode} setMode={setMode} />
      <Grid container spacing={8}>
        <Grid
          item
          position="fixed"
          sx={{
            display: { sm: "none", md: "block" },
          }}
          width={sidebarWidth + "vw"}
        >
          <AdminSidebar />
        </Grid>
        <Grid item xs={9} ml={"auto"}>
          <Box sx={{ minHeight: "100vh" }}>{children}</Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default AdminDashboardLayout;
