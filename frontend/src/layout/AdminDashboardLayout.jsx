import { useState } from "react";
import Navbar from "../components/navigator/Navbar";
import { Box, Grid, IconButton, Stack } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import AdminSidebar from "../components/navigator/AdminSidebar";
function AdminDashboardLayout({ children, mode, setMode, activeIndex }) {
  const [sidebarWidth, setSidebarWidth] = useState(15)
  const [open, setOpen] = useState(false);

  const handleDrawerToggle = () => {
    if(!open){
      setOpen(true);
      setSidebarWidth(4);
    } else {
      setOpen(false);
      setSidebarWidth(15);
    }
  };
  
  return (
    <Box>
      <Navbar mode={mode} setMode={setMode} />
      <Grid container>
        <Grid
          item
          position="fixed"
          sx={{
            display: "flex",
            flexDirection: "column",
          }}
          width={sidebarWidth  + "vw"}
          p={open ? "0" : "0.5rem"}
          pt="0.5rem"
        >
           <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerToggle}  
            sx={{width: "3rem",...(open ? {marginX: 'auto'} : { marginLeft: 'auto' }) }}
          >
            <MenuIcon sx={{ fontSize: 30 }} />
          </IconButton>
            <AdminSidebar mode={open}/>
        </Grid>
        <Grid item xs={6} ml={sidebarWidth + "vw"}>
          <Box sx={{minHeight: "100vh"}} width={100 - sidebarWidth + "vw"}>{children}</Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default AdminDashboardLayout;


