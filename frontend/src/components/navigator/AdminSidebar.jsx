import {
  AccountCircle,
  CheckCircle,
  Dashboard,
  ExpandLess,
  ExpandMore,
  Home,
  People,
  Settings,
  SpaceDashboard,
} from "@mui/icons-material";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Collapse,
} from "@mui/material";
import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";

function AdminSidebar({ mode }) {
  const [selectedIndex, setSelectedIndex] = useState(1);
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
      <List sx={{ display: "flex", gap: 0.5, flexDirection: "column" }}>
        <RouterLink
          to="/profile/me"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <ListItemButton
            selected={selectedIndex === 4}
            onClick={(event) => handleListItemClick(event, 9)}
            sx={
              mode
                ? {
                    display: "flex",
                    flexDirection: "column",
                    textAlign: "center",
                    alignItems: "center",
                    justifyContent: "center",
                  }
                : {}
            }
          >
            <ListItemIcon
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Home />
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography
                  variant="subtitle2"
                  fontWeight={800}
                  sx={{ fontSize: mode && "0.625rem" }}
                >
                  Home
                </Typography>
              }
            />
          </ListItemButton>
        </RouterLink>
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
              onClick={!mode ? () => handleClick("dashboard") : undefined}
              sx={
                mode
                  ? {
                      display: "flex",
                      flexDirection: "column",
                      textAlign: "center",
                      alignItems: "center",
                      justifyContent: "center",
                    }
                  : {}
              }
            >
              <ListItemIcon
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <SpaceDashboard />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography
                    variant="subtitle2"
                    fontWeight={800}
                    sx={{ fontSize: mode && "0.625rem" }}
                  >
                    Dashboard
                  </Typography>
                }
              />
            </ListItemButton>
          </ListItem>
        </RouterLink>
        {!mode && (
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
        )}
        <RouterLink
          to="/selections"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <ListItemButton
            selected={selectedIndex === 3}
            onClick={(event) => handleListItemClick(event, 8)}
            sx={
              mode
                ? {
                    display: "flex",
                    flexDirection: "column",
                    textAlign: "center",
                    alignItems: "center",
                    justifyContent: "center",
                  }
                : {}
            }
          >
            <ListItemIcon
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Settings />
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography
                  variant="subtitle2"
                  fontWeight={800}
                  sx={{ fontSize: mode && "0.625rem" }}
                >
                  Manage Options
                </Typography>
              }
            />
          </ListItemButton>
        </RouterLink>
        <RouterLink
          to="/accounts"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <ListItemButton
            selected={selectedIndex === 4}
            onClick={(event) => handleListItemClick(event, 9)}
            sx={
              mode
                ? {
                    display: "flex",
                    flexDirection: "column",
                    textAlign: "center",
                    alignItems: "center",
                    justifyContent: "center",
                  }
                : {}
            }
          >
            <ListItemIcon
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <People />
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography
                  variant="subtitle2"
                  fontWeight={800}
                  sx={{ fontSize: mode && "0.625rem" }}
                >
                  Alumni Accounts
                </Typography>
              }
            />
          </ListItemButton>
        </RouterLink>
      </List>
    </Box>
  );
}

export default AdminSidebar;
