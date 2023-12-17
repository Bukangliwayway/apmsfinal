import {
  AppBar,
  Badge,
  Box,
  Button,
  ListItemIcon,
  Toolbar,
  Typography,
  styled,
} from "@mui/material";
import React from "react";
import AccountMenu from "../ui/AccountMenu";
import {
  School,
  Notifications,
  ModeNight,
  LightMode,
} from "@mui/icons-material/";

const Navbar = ({ mode, setMode }) => {
  return (
    <AppBar p={2} position="sticky">
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <School sx={{ display: { xs: "block", sm: "none" } }} />
        <Typography variant="h1" sx={{ display: { xs: "none", sm: "block" } }}>
          PUPQC APMS
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box
            onClick={() => setMode(mode === "light" ? "dark" : "light")}
            sx={{ cursor: "pointer" }} // Add cursor style to indicate it's clickable
          >
            {!(mode === "light") ? <ModeNight /> : <LightMode />}
          </Box>
          {/* <Badge badgeContent={5} color="error">
            <Notifications />
          </Badge> */}
          <AccountMenu link="https://ucarecdn.com/c0549749-795b-4ae3-802c-3dfc275aa0b4/-/crop/1190x1000/5,0/-/resize/1035x870/" />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
