import { Dashboard, Explore, Home, Hub } from "@mui/icons-material";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import useAll from "../../hooks/utilities/useAll";
import ProfileCard from "./ProfileCard";

function Sidebar() {
  const [selectedIndex, setSelectedIndex] = useState(1);
  const { auth } = useAll();

  const centerFlex = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
  };

  return (
    <Box p={1}>
      <List component="Box">
        <RouterLink
          to="/profile/me"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <ListItem disablePadding>
            <ListItemButton sx={centerFlex}>
              <ProfileCard />
            </ListItemButton>
          </ListItem>
        </RouterLink>
        <RouterLink
          to="/alumni-nexus"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <ListItem disablePadding>
            <ListItemButton
              onClick={(event) => handleListItemClick(event, 1)}
              sx={centerFlex}
            >
              <ListItemIcon sx={centerFlex}>
                <Home
                  sx={{
                    textAlign: "center",
                  }}
                />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="body1" fontWeight={"bold"}>
                    Home
                  </Typography>
                }
              />
            </ListItemButton>
          </ListItem>
        </RouterLink>
        <RouterLink
          to="/alumni-nexus"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <ListItem disablePadding>
            <ListItemButton
              onClick={(event) => handleListItemClick(event, 1)}
              sx={centerFlex}
            >
              <ListItemIcon sx={centerFlex}>
                <Hub
                  sx={{
                    textAlign: "center",
                  }}
                />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="body1" fontWeight={"bold"}>
                    Alumni Nexus
                  </Typography>
                }
              />
            </ListItemButton>
          </ListItem>
        </RouterLink>
        <RouterLink
          to="/explore"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <ListItem disablePadding>
            <ListItemButton
              onClick={(event) => handleListItemClick(event, 1)}
              sx={centerFlex}
            >
              <ListItemIcon sx={centerFlex}>
                <Explore
                  sx={{
                    textAlign: "center",
                  }}
                />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="body1" fontWeight={"bold"}>
                    Explore
                  </Typography>
                }
              />
            </ListItemButton>
          </ListItem>
        </RouterLink>
      </List>

      {auth?.role == "admin" ? (
        <List component="Box">
          <RouterLink
            to="/home"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <ListItem disablePadding>
              <ListItemButton
                onClick={(event) => handleListItemClick(event, 9)}
                sx={centerFlex}
              >
                <ListItemIcon sx={centerFlex}>
                  <Dashboard
                    sx={{
                      textAlign: "center",
                    }}
                  />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="body1" fontWeight={"bold"}>
                      Admin Dashboard
                    </Typography>
                  }
                />
              </ListItemButton>
            </ListItem>
          </RouterLink>
        </List>
      ) : null}
    </Box>
  );
}

export default Sidebar;
