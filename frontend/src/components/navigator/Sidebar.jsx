import {
  AccountCircle,
  Campaign,
  CheckBoxOutlineBlank,
  CheckBoxOutlineBlankRounded,
  Dashboard,
  Event,
  Explore,
  Home,
  HowToReg,
  Hub,
  LightMode,
  ModeNight,
  MonetizationOn,
  Newspaper,
  People,
  Settings,
  Stars,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Card,
  CardActionArea,
  Skeleton,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Switch,
  Typography,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useAuth from "../../hooks/useAuth";
import Profile from "./ProfileCard";

function Sidebar() {
  const [selectedIndex, setSelectedIndex] = useState(1);
  const { auth, setAuth } = useAuth();

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
  };

  return (
    <Box p={1} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Card>
        <List sx={{ display: "flex", gap: 0.5, flexDirection: "column" }}>
          <RouterLink
            to="/profile/me"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <ListItem
              disablePadding
              sx={{
                borderRadius: 3,
              }}
            >
              <ListItemButton
                selected={selectedIndex === 1}
                onClick={(event) => handleListItemClick(event, 1)}
              >
                <ListItemIcon>
                  <Home />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="subtitle2" fontWeight={800}>
                      Home
                    </Typography>
                  }
                />
              </ListItemButton>
            </ListItem>
          </RouterLink>
          {/* <RouterLink
            to="/alumni-nexus"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <ListItem
              disablePadding
              sx={{
                borderRadius: 3,
              }}
            >
              <ListItemButton
                component="a"
                href="#alumninexus"
                selected={selectedIndex === 4}
                onClick={(event) => handleListItemClick(event, 4)}
              >
                <ListItemIcon>
                  <Hub />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="subtitle2" fontWeight={800}>
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
            <ListItem
              disablePadding
              sx={{
                borderRadius: 3,
              }}
            >
              <ListItemButton
                component="a"
                href="#explore"
                selected={selectedIndex === 3}
                onClick={(event) => handleListItemClick(event, 3)}
              >
                <ListItemIcon>
                  <Explore />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="subtitle2" fontWeight={800}>
                      Explore
                    </Typography>
                  }
                />
              </ListItemButton>
            </ListItem>
          </RouterLink> */}
        </List>
      </Card>

      <Card>
        {auth?.role == "admin" ? (
          <List sx={{ display: "flex", gap: 0.5, flexDirection: "column" }}>
            <RouterLink
              to="/dashboard"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <ListItem
                disablePadding
                sx={{
                  borderRadius: 3,
                }}
              >
                <ListItemButton
                  selected={selectedIndex === 9}
                  onClick={(event) => handleListItemClick(event, 9)}
                >
                  <ListItemIcon>
                    <Dashboard />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle2" fontWeight={800}>
                        Admin Dashboard
                      </Typography>
                    }
                  />
                </ListItemButton>
              </ListItem>
            </RouterLink>
          </List>
        ) : null}
      </Card>
    </Box>
  );
}

export default Sidebar;
