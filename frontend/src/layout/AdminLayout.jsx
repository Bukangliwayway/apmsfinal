import { useState } from "react";
import Navbar from "../components/navigator/Navbar";
import { Box, Grid, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AdminSidebar from "../components/navigator/AdminSidebar";
function AdminLayout({ children }) {
  const [sidebarWidth, setSidebarWidth] = useState(15);
  const [open, setOpen] = useState(false);

  const handleDrawerToggle = () => {
    if (!open) {
      setOpen(true);
      setSidebarWidth(5);
    } else {
      setOpen(false);
      setSidebarWidth(15);
    }
  };

  return (
    <Box>
      <Navbar />
      <Grid container>
        <Grid
          item
          position="fixed"
          sx={{
            display: "flex",
            flexDirection: "column",
          }}
          width={sidebarWidth + "%"}
          p={open ? "0" : "0.5rem"}
          pt="0.5rem"
        >
          <IconButton
            onClick={handleDrawerToggle}
            sx={{
              width: "3rem",
              ...(open ? { marginX: "auto" } : { marginLeft: "auto" }),
              mb: "1rem",
            }}
          >
            <MenuIcon sx={{ fontSize: "2rem" }} />
          </IconButton>
          <AdminSidebar mode={open} />
        </Grid>
        <Grid item xs={open ? 11.4 : 10.2} ml={sidebarWidth + "%"}>
          <Box sx={{ minHeight: "100vh" }}>{children}</Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default AdminLayout;
