import {
  AccountCircle,
  Campaign,
  CheckBoxOutlineBlank,
  CheckBoxOutlineBlankRounded,
  CheckCircle,
  Dashboard,
  Event,
  ExpandLess,
  ExpandMore,
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
  StarBorder,
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
  Collapse,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useAuth from "../../hooks/useAuth";
import Profile from "./ProfileCard";

function AdminSidebar() {
  const [selectedIndex, setSelectedIndex] = useState(1);
  const { auth, setAuth } = useAuth();
  const [open, setOpen] = useState({});

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
  };

  const handleClick = (key) => {
    setOpen((prevState) => {
      return {
        ...prevState,
        [key]: !prevState[key],
      };
    });
  };

  return (
    <Box p={1} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Card>
        <List sx={{ display: "flex", gap: 0.5, flexDirection: "column" }}>
          <ListItem
            disablePadding
            sx={{
              borderRadius: 3,
            }}
          >
            <ListItemButton onClick={() => handleClick("dashboard")}>
              <ListItemIcon>
                <Home />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="subtitle2" fontWeight={800}>
                    Main Dashboard
                  </Typography>
                }
              />
              {open?.dashboard || false ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
          </ListItem>
          <Collapse in={open?.dashboard || false} timeout="auto" unmountOnExit>
            <List component="Box" disablePadding>
              <RouterLink
                to="/completed-list"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <ListItem
                  disablePadding
                  sx={{
                    borderRadius: 3,
                  }}
                >
                  <ListItemButton sx={{ pl: 4 }}>
                    <ListItemIcon>
                      <CheckCircle />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle2" fontWeight={800}>
                          Profile Completion List
                        </Typography>
                      }
                    />
                  </ListItemButton>
                </ListItem>
              </RouterLink>
            </List>
          </Collapse>
          <RouterLink
            to="/selections"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <ListItem
              disablePadding
              sx={{
                borderRadius: 3,
              }}
            >
              <ListItemButton
                selected={selectedIndex === 3}
                onClick={(event) => handleListItemClick(event, 8)}
              >
                <ListItemIcon>
                  <Settings />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="subtitle2" fontWeight={800}>
                      Options Management
                    </Typography>
                  }
                />
              </ListItemButton>
            </ListItem>
          </RouterLink>
          <RouterLink
            to="/accounts"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <ListItem
              disablePadding
              sx={{
                borderRadius: 3,
              }}
            >
              <ListItemButton
                selected={selectedIndex === 4}
                onClick={(event) => handleListItemClick(event, 9)}
              >
                <ListItemIcon>
                  <People />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="subtitle2" fontWeight={800}>
                      Alumni Accounts
                    </Typography>
                  }
                />
              </ListItemButton>
            </ListItem>
          </RouterLink>
        </List>
      </Card>

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
                selected={selectedIndex === 4}
                onClick={(event) => handleListItemClick(event, 9)}
              >
                <ListItemIcon>
                  <AccountCircle />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="subtitle2" fontWeight={800}>
                      Profile Page
                    </Typography>
                  }
                />
              </ListItemButton>
            </ListItem>
          </RouterLink>
        </List>
      </Card>
    </Box>
  );
}

export default AdminSidebar;
