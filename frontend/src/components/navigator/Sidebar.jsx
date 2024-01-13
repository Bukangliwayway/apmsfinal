import { Announcement, Article, Dashboard, Event, Explore, Home, Hub, MonetizationOn } from "@mui/icons-material";
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
            <ListItemButton sx={{display:"flex", alignItems: "center"}}>
              <ProfileCard />
            </ListItemButton>
          </ListItem>
        </RouterLink>
        <RouterLink
          to="/home"
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
        <RouterLink
          to="/pup-feeds/announcement"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <ListItem disablePadding>
            <ListItemButton
              onClick={(event) => handleListItemClick(event, 1)}
              sx={centerFlex}
            >
              <ListItemIcon sx={centerFlex}>
                <Announcement
                  sx={{
                    textAlign: "center",
                  }}
                />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="body1" fontWeight={"bold"}>
                    Announcements
                  </Typography>
                }
              />
            </ListItemButton>
          </ListItem>
        </RouterLink>
        <RouterLink
          to="/pup-feeds/news"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <ListItem disablePadding>
            <ListItemButton
              onClick={(event) => handleListItemClick(event, 1)}
              sx={centerFlex}
            >
              <ListItemIcon sx={centerFlex}>
                <Article
                  sx={{
                    textAlign: "center",
                  }}
                />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="body1" fontWeight={"bold"}>
                    News
                  </Typography>
                }
              />
            </ListItemButton>
          </ListItem>
        </RouterLink>
        <RouterLink
          to="/pup-feeds/event"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <ListItem disablePadding>
            <ListItemButton
              onClick={(event) => handleListItemClick(event, 1)}
              sx={centerFlex}
            >
              <ListItemIcon sx={centerFlex}>
                <Event
                  sx={{
                    textAlign: "center",
                  }}
                />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="body1" fontWeight={"bold"}>
                    Events
                  </Typography>
                }
              />
            </ListItemButton>
          </ListItem>
        </RouterLink>
        <RouterLink
          to="/pup-feeds/fundraising"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <ListItem disablePadding>
            <ListItemButton
              onClick={(event) => handleListItemClick(event, 1)}
              sx={centerFlex}
            >
              <ListItemIcon sx={centerFlex}>
                <MonetizationOn
                  sx={{
                    textAlign: "center",
                  }}
                />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="body1" fontWeight={"bold"}>
                    Fundraising
                  </Typography>
                }
              />
            </ListItemButton>
          </ListItem>
        </RouterLink>
      </List>
    </Box>
  );
}

export default Sidebar;
